import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Validation schema for news creation
const NewsCreateSchema = z.object({
  title_de: z.string().trim().min(1, 'German title is required').max(200, 'German title must be less than 200 characters'),
  title_en: z.string().trim().min(1, 'English title is required').max(200, 'English title must be less than 200 characters'),
  excerpt_de: z.string().trim().min(1, 'German excerpt is required').max(500, 'German excerpt must be less than 500 characters'),
  excerpt_en: z.string().trim().min(1, 'English excerpt is required').max(500, 'English excerpt must be less than 500 characters'),
  content_de: z.string().trim().min(1, 'German content is required').max(50000, 'German content must be less than 50000 characters'),
  content_en: z.string().trim().min(1, 'English content is required').max(50000, 'English content must be less than 50000 characters'),
  category: z.enum(['events', 'menu', 'general']).optional().default('general'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers and hyphens').max(200, 'Slug must be less than 200 characters').optional(),
  read_time: z.number().int().positive('Read time must be positive').max(999, 'Read time must be less than 999 minutes').optional().default(5),
  image_url: z.string().url('Invalid image URL').max(2048, 'Image URL must be less than 2048 characters').optional(),
  author_name: z.string().trim().max(100, 'Author name must be less than 100 characters').optional().default('Berliner Pub'),
  is_published: z.boolean().optional().default(false)
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Get API key from header
    const apiKey = req.headers.get('x-api-key');
    const userAgent = req.headers.get('user-agent');
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ipAddress = forwarded?.split(',')[0] || realIp || 'unknown';

    // Parse request body
    let requestData: any;
    try {
      requestData = await req.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      
      // Log request with error
      await supabase.from('api_logs').insert([{
        endpoint: '/api/v1/news',
        method: 'POST',
        request_data: null,
        ip_address: ipAddress,
        user_agent: userAgent,
        api_key_id: null,
        response_status: 400,
        response_data: { error: 'Invalid JSON in request body' }
      }]);
      
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Validate request data with Zod schema
    const validation = NewsCreateSchema.safeParse(requestData);
    if (!validation.success) {
      console.error('Validation error:', validation.error.issues);
      
      // Log validation failure
      await supabase.from('api_logs').insert([{
        endpoint: '/api/v1/news',
        method: 'POST',
        request_data: requestData,
        ip_address: ipAddress,
        user_agent: userAgent,
        api_key_id: null,
        response_status: 400,
        response_data: { 
          error: 'Validation failed', 
          details: validation.error.issues 
        }
      }]);
      
      return new Response(
        JSON.stringify({ 
          error: 'Validation failed', 
          details: validation.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Use validated data
    const validatedData = validation.data;

    if (!apiKey) {
      await supabase.from('api_logs').insert([{
        endpoint: '/api/v1/news',
        method: 'POST',
        request_data: validatedData,
        ip_address: ipAddress,
        user_agent: userAgent,
        api_key_id: null,
        response_status: 401,
        response_data: { error: 'API key is required' }
      }]);
      
      return new Response(
        JSON.stringify({ error: 'API key is required. Please provide x-api-key header.' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify API key
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('*')
      .eq('api_key', apiKey)
      .eq('is_active', true)
      .single();

    if (keyError || !keyData) {
      await supabase.from('api_logs').insert([{
        endpoint: '/api/v1/news',
        method: 'POST',
        request_data: validatedData,
        ip_address: ipAddress,
        user_agent: userAgent,
        api_key_id: null,
        response_status: 401,
        response_data: { error: 'Invalid or inactive API key' }
      }]);
      
      return new Response(
        JSON.stringify({ error: 'Invalid or inactive API key' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if API key has expired
    if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
      await supabase.from('api_logs').insert([{
        endpoint: '/api/v1/news',
        method: 'POST',
        request_data: validatedData,
        ip_address: ipAddress,
        user_agent: userAgent,
        api_key_id: keyData.id,
        response_status: 401,
        response_data: { error: 'API key has expired' }
      }]);
      
      return new Response(
        JSON.stringify({ error: 'API key has expired' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check permissions
    if (!keyData.permissions || !keyData.permissions.includes('news:create')) {
      await supabase.from('api_logs').insert([{
        endpoint: '/api/v1/news',
        method: 'POST',
        request_data: validatedData,
        ip_address: ipAddress,
        user_agent: userAgent,
        api_key_id: keyData.id,
        response_status: 403,
        response_data: { error: 'API key does not have permission to create news' }
      }]);
      
      return new Response(
        JSON.stringify({ error: 'API key does not have permission to create news' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check rate limit
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentRequests, error: countError } = await supabase
      .from('api_logs')
      .select('id', { count: 'exact', head: true })
      .eq('api_key_id', keyData.id)
      .eq('response_status', 201)
      .gte('created_at', oneHourAgo);

    if (countError) {
      console.error('Error checking rate limit:', countError);
    }

    const requestCount = recentRequests?.length || 0;
    if (keyData.rate_limit && requestCount >= keyData.rate_limit) {
      await supabase.from('api_logs').insert([{
        endpoint: '/api/v1/news',
        method: 'POST',
        request_data: validatedData,
        ip_address: ipAddress,
        user_agent: userAgent,
        api_key_id: keyData.id,
        response_status: 429,
        response_data: { 
          error: 'Rate limit exceeded',
          limit: keyData.rate_limit,
          reset_in_seconds: 3600
        }
      }]);
      
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again later.',
          limit: keyData.rate_limit,
          reset_in_seconds: 3600
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Generate slug if not provided
    let slug = validatedData.slug;
    if (!slug) {
      slug = validatedData.title_en
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    // Check if slug already exists
    const { data: existingNews } = await supabase
      .from('news')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingNews) {
      // Append timestamp to make slug unique
      slug = `${slug}-${Date.now()}`;
    }

    // Insert news data (using validated data)
    const newsData = {
      title_de: validatedData.title_de,
      title_en: validatedData.title_en,
      excerpt_de: validatedData.excerpt_de,
      excerpt_en: validatedData.excerpt_en,
      content_de: validatedData.content_de,
      content_en: validatedData.content_en,
      category: validatedData.category,
      image_url: validatedData.image_url || null,
      read_time: validatedData.read_time,
      slug: slug,
      author_name: validatedData.author_name,
      is_published: validatedData.is_published,
      published_at: validatedData.is_published ? new Date().toISOString() : null,
    };

    const { data: insertedNews, error: insertError } = await supabase
      .from('news')
      .insert([newsData])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting news:', insertError);
      
      await supabase.from('api_logs').insert([{
        endpoint: '/api/v1/news',
        method: 'POST',
        request_data: validatedData,
        ip_address: ipAddress,
        user_agent: userAgent,
        api_key_id: keyData.id,
        response_status: 500,
        response_data: { error: 'Failed to create news article', details: insertError.message }
      }]);
      
      return new Response(
        JSON.stringify({ error: 'Failed to create news article', details: insertError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Update last_used timestamp for API key
    await supabase
      .from('api_keys')
      .update({ last_used: new Date().toISOString() })
      .eq('id', keyData.id);

    // Log successful request
    await supabase.from('api_logs').insert([{
      endpoint: '/api/v1/news',
      method: 'POST',
      request_data: validatedData,
      ip_address: ipAddress,
      user_agent: userAgent,
      api_key_id: keyData.id,
      response_status: 201,
      response_data: { id: insertedNews.id, slug: insertedNews.slug }
    }]);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'News article created successfully',
        data: {
          id: insertedNews.id,
          slug: insertedNews.slug
        }
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface NewsCreateRequest {
  title_de: string;
  title_en: string;
  excerpt_de: string;
  excerpt_en: string;
  content_de: string;
  content_en: string;
  category?: 'events' | 'menu' | 'general';
  image_url?: string;
  read_time?: number;
  slug?: string;
  author_name?: string;
  is_published?: boolean;
}

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

    let requestData: NewsCreateRequest;
    try {
      requestData = await req.json();
    } catch (error) {
      console.error('Invalid JSON:', error);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Log the request (we'll log regardless of API key validity)
    const logData = {
      endpoint: '/api/v1/news',
      method: 'POST',
      request_data: requestData,
      ip_address: ipAddress,
      user_agent: userAgent,
      api_key_id: null as string | null,
      response_status: 401,
      response_data: null as any
    };

    if (!apiKey) {
      logData.response_data = { error: 'API key is required' };
      await supabase.from('api_logs').insert([logData]);
      
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
      logData.response_data = { error: 'Invalid or inactive API key' };
      await supabase.from('api_logs').insert([logData]);
      
      return new Response(
        JSON.stringify({ error: 'Invalid or inactive API key' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if key has expired
    if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
      logData.response_data = { error: 'API key has expired' };
      logData.api_key_id = keyData.id;
      await supabase.from('api_logs').insert([logData]);
      
      return new Response(
        JSON.stringify({ error: 'API key has expired' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check permissions
    if (!keyData.permissions.includes('news:create')) {
      logData.response_data = { error: 'Insufficient permissions' };
      logData.api_key_id = keyData.id;
      await supabase.from('api_logs').insert([logData]);
      
      return new Response(
        JSON.stringify({ error: 'API key does not have permission to create news' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Rate limiting check (simplified - check last hour)
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    
    const { data: recentLogs, error: logsError } = await supabase
      .from('api_logs')
      .select('id')
      .eq('api_key_id', keyData.id)
      .gte('created_at', oneHourAgo.toISOString())
      .eq('response_status', 201); // Only count successful requests

    if (logsError) {
      console.error('Error checking rate limit:', logsError);
    } else if (recentLogs && recentLogs.length >= keyData.rate_limit) {
      logData.response_data = { error: 'Rate limit exceeded' };
      logData.api_key_id = keyData.id;
      logData.response_status = 429;
      await supabase.from('api_logs').insert([logData]);
      
      return new Response(
        JSON.stringify({ 
          error: `Rate limit exceeded. Maximum ${keyData.rate_limit} requests per hour allowed.` 
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate required fields
    const requiredFields = ['title_de', 'title_en', 'excerpt_de', 'excerpt_en', 'content_de', 'content_en'];
    const missingFields = requiredFields.filter(field => !requestData[field as keyof NewsCreateRequest]);
    
    if (missingFields.length > 0) {
      logData.response_data = { error: `Missing required fields: ${missingFields.join(', ')}` };
      logData.api_key_id = keyData.id;
      logData.response_status = 400;
      await supabase.from('api_logs').insert([logData]);
      
      return new Response(
        JSON.stringify({ 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Generate slug if not provided
    const slug = requestData.slug || requestData.title_en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 100);

    // Check if slug already exists
    const { data: existingNews } = await supabase
      .from('news')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingNews) {
      logData.response_data = { error: 'Slug already exists' };
      logData.api_key_id = keyData.id;
      logData.response_status = 409;
      await supabase.from('api_logs').insert([logData]);
      
      return new Response(
        JSON.stringify({ 
          error: 'A news article with this slug already exists' 
        }),
        { 
          status: 409, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Prepare news data
    const newsData = {
      title_de: requestData.title_de,
      title_en: requestData.title_en,
      excerpt_de: requestData.excerpt_de,
      excerpt_en: requestData.excerpt_en,
      content_de: requestData.content_de,
      content_en: requestData.content_en,
      category: requestData.category || 'general',
      image_url: requestData.image_url || null,
      read_time: requestData.read_time || 5,
      slug: slug,
      author_name: requestData.author_name || 'API User',
      is_published: requestData.is_published || false,
      published_at: requestData.is_published ? new Date().toISOString() : null
    };

    // Create the news article
    const { data: newsResult, error: newsError } = await supabase
      .from('news')
      .insert([newsData])
      .select()
      .single();

    if (newsError) {
      console.error('Error creating news:', newsError);
      logData.response_data = { error: newsError.message };
      logData.api_key_id = keyData.id;
      logData.response_status = 500;
      await supabase.from('api_logs').insert([logData]);
      
      return new Response(
        JSON.stringify({ error: 'Failed to create news article' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Update API key last_used timestamp
    await supabase
      .from('api_keys')
      .update({ last_used: new Date().toISOString() })
      .eq('id', keyData.id);

    // Log successful request
    logData.response_status = 201;
    logData.response_data = { id: newsResult.id, slug: newsResult.slug };
    logData.api_key_id = keyData.id;
    await supabase.from('api_logs').insert([logData]);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: newsResult.id,
          slug: newsResult.slug,
          title: newsResult.title_en,
          is_published: newsResult.is_published,
          created_at: newsResult.created_at
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
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
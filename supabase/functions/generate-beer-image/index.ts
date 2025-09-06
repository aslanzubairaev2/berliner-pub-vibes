import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { beerName, beerType = 'light' } = await req.json()

    if (!beerName) {
      return new Response(
        JSON.stringify({ error: 'Beer name is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))

    // Create prompts based on beer type
    const basePrompt = `Professional product photo of ${beerName} in a tall curved wheat beer glass, vertical orientation, white background, studio lighting, high quality, detailed foam head`
    
    const colorPrompt = beerType === 'dark' 
      ? `${basePrompt}, dark brown beer color, rich chocolate brown liquid, creamy beige foam`
      : `${basePrompt}, golden yellow beer color, clear amber liquid, white foam head`

    const finalPrompt = `${colorPrompt}, photorealistic, commercial photography, clean composition, 4:3 aspect ratio taller than wide`

    console.log('Generating image with prompt:', finalPrompt)

    const image = await hf.textToImage({
      inputs: finalPrompt,
      model: 'black-forest-labs/FLUX.1-schnell',
    })

    // Convert the blob to a base64 string
    const arrayBuffer = await image.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

    return new Response(
      JSON.stringify({ 
        image: `data:image/png;base64,${base64}`,
        beerName,
        beerType,
        prompt: finalPrompt
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
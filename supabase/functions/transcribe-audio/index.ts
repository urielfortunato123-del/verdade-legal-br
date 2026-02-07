import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;
    
    if (!audioFile) {
      return new Response(
        JSON.stringify({ error: "Nenhum arquivo de áudio fornecido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    // Convert audio to base64 for Gemini
    const audioBuffer = await audioFile.arrayBuffer();
    const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
    
    // Use Gemini's multimodal capabilities for transcription
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://verdade-na-lei.lovable.app",
        "X-Title": "Verdade na Lei BR",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: `Você é um transcritor de áudio profissional brasileiro. Transcreva o áudio de forma precisa, mantendo pontuação e parágrafos. 
            
Responda em JSON:
{
  "transcript": "texto transcrito completo",
  "confidence": 0.0-1.0,
  "language": "pt-BR",
  "duration_estimate": "duração estimada em segundos"
}`
          },
          { 
            role: "user", 
            content: [
              { type: "text", text: "Transcreva este áudio em português brasileiro:" },
              { 
                type: "input_audio",
                input_audio: {
                  data: audioBase64,
                  format: audioFile.type.includes("webm") ? "webm" : 
                          audioFile.type.includes("mp3") ? "mp3" : 
                          audioFile.type.includes("wav") ? "wav" : "mp3"
                }
              }
            ]
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("Transcription error:", response.status, errorText);
      throw new Error(`Transcription error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No transcription returned");
    }

    let result;
    try {
      result = JSON.parse(content);
    } catch {
      result = { 
        transcript: content,
        confidence: 0.8,
        language: "pt-BR"
      };
    }

    return new Response(
      JSON.stringify({ success: true, ...result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Transcription error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

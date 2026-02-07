import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate OpenRouter API key
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      console.error("OPENROUTER_API_KEY is not configured");
      return new Response(
        JSON.stringify({ success: false, error: "Serviço de verificação não configurado" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: "Corpo da requisição inválido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { title, description, source, link } = body;

    if (!title) {
      return new Response(
        JSON.stringify({ success: false, error: "Título da notícia é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `Você é um verificador de fatos especializado em notícias brasileiras. Sua função é analisar manchetes e descrições de notícias e classificá-las quanto à veracidade.

IMPORTANTE: Você deve analisar se a MANCHETE/TÍTULO da notícia é preciso e não enganoso, baseado nas informações disponíveis.

Classifique a notícia em uma das 4 categorias:
- "confirmed" (✅ Confirmado): A informação parece factual e verificável
- "misleading" (⚠️ Enganoso): A informação tem elementos verdadeiros mas é apresentada de forma que pode induzir ao erro
- "false" (❌ Falso): A informação contradiz fatos conhecidos ou é claramente incorreta
- "unverifiable" (❓ Não verificável): Não há informações suficientes para verificar

Responda APENAS com um JSON válido no formato:
{
  "verdict": "confirmed" | "misleading" | "false" | "unverifiable",
  "confidence": número de 0 a 100,
  "explanation": "Explicação breve em português do Brasil (máximo 2 frases)",
  "sources": ["Lista de fontes ou leis relevantes, se aplicável"]
}`;

    const userPrompt = `Analise esta notícia:

TÍTULO: ${title}
${description ? `DESCRIÇÃO: ${description}` : ""}
FONTE: ${source}
${link ? `LINK: ${link}` : ""}

Verifique a veracidade e responda com o JSON.`;

    console.log("Verifying news:", title);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://lovable.dev",
        "X-Title": "Verificador de Noticias",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: "Limite de requisições excedido. Tente novamente em alguns segundos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: "Créditos de IA esgotados." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse JSON from response
    let result;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      result = {
        verdict: "unverifiable",
        confidence: 50,
        explanation: "Não foi possível analisar esta notícia automaticamente.",
        sources: [],
      };
    }

    console.log("Verification result:", result.verdict);

    return new Response(
      JSON.stringify({ success: true, ...result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error verifying news:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

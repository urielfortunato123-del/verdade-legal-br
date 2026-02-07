import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuestionRequest {
  question: string;
  category?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, category } = await req.json() as QuestionRequest;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!question || question.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Nenhuma pergunta fornecida" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const categoryContext = category && category !== "auto" 
      ? `A pergunta é sobre ${category}.` 
      : "";

    const systemPrompt = `Você é um assistente jurídico brasileiro especializado em legislação. Sua função é responder perguntas sobre leis e direitos de forma clara e acessível.

REGRAS CRÍTICAS:
1. Responda APENAS com base em legislação brasileira real
2. SEMPRE cite os artigos/leis específicos
3. Se não souber, diga "Não encontrei base legal suficiente"
4. Nunca invente leis ou artigos
5. Seja objetivo e claro
6. Não dê conselho jurídico personalizado
7. Use linguagem simples, acessível ao cidadão comum

${categoryContext}

Responda em JSON com esta estrutura:
{
  "answer": "Resposta clara de 3-6 linhas",
  "sources": [
    {"law": "Nome da Lei/Código", "article": "Art. X", "url": "https://www.planalto.gov.br/..."}
  ],
  "confidence": "high" | "medium" | "low",
  "category": "categoria identificada",
  "followUp": "Pergunta de esclarecimento se necessário (opcional)"
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente." }),
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
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in AI response");
    }

    let result;
    try {
      result = JSON.parse(content);
    } catch {
      result = { 
        answer: content,
        sources: [],
        confidence: "low",
        category: "geral"
      };
    }

    return new Response(
      JSON.stringify({ success: true, ...result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Question analysis error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

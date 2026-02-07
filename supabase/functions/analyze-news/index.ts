import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "API não configurada" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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
        JSON.stringify({ success: false, error: "Título é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Analyzing news:", title);

    const systemPrompt = `Você é um analista de notícias brasileiro especializado. Sua tarefa é fazer uma análise completa e imparcial de notícias.

Forneça uma análise estruturada com:
1. RESUMO: Um resumo claro e objetivo da notícia (2-3 parágrafos)
2. CONTEXTO: Informações de contexto importantes para entender a notícia
3. PONTOS PRINCIPAIS: Lista dos principais pontos da matéria
4. ANÁLISE CRÍTICA: Análise imparcial considerando diferentes perspectivas
5. VERIFICAÇÃO: Avaliação da veracidade (Confirmado/Enganoso/Falso/Não verificável) com explicação
6. FONTES RECOMENDADAS: Sugestões de fontes oficiais para verificar as informações

Responda em formato JSON:
{
  "resumo": "texto do resumo",
  "contexto": "texto do contexto",
  "pontosPrincipais": ["ponto 1", "ponto 2", ...],
  "analiseCritica": "texto da análise",
  "verificacao": {
    "veredicto": "confirmed|misleading|false|unverifiable",
    "confianca": número 0-100,
    "explicacao": "explicação"
  },
  "fontesRecomendadas": ["fonte 1", "fonte 2", ...]
}`;

    const userPrompt = `Analise esta notícia em detalhes:

TÍTULO: ${title}
${description ? `DESCRIÇÃO: ${description}` : ""}
FONTE: ${source}
${link ? `LINK: ${link}` : ""}

Forneça uma análise completa em JSON.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://lovable.dev",
        "X-Title": "Analisador de Noticias",
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
          JSON.stringify({ success: false, error: "Limite de requisições excedido." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("OpenRouter error:", response.status, errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Sem resposta da IA");
    }

    let analysis;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("JSON não encontrado");
      }
    } catch {
      console.error("Failed to parse:", content);
      analysis = {
        resumo: content,
        contexto: "",
        pontosPrincipais: [],
        analiseCritica: "",
        verificacao: { veredicto: "unverifiable", confianca: 50, explicacao: "Não foi possível analisar" },
        fontesRecomendadas: [],
      };
    }

    console.log("Analysis complete for:", title);

    // Save to database
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        await supabase.from("news_verifications").insert({
          news_title: title,
          news_description: description || null,
          news_source: source,
          news_link: link || null,
          news_category: body.category || null,
          verdict: analysis.verificacao?.veredicto || "unverifiable",
          confidence: analysis.verificacao?.confianca || 50,
          explanation: analysis.verificacao?.explicacao || null,
          resumo: analysis.resumo || null,
          contexto: analysis.contexto || null,
          pontos_principais: analysis.pontosPrincipais || [],
          analise_critica: analysis.analiseCritica || null,
          fontes_recomendadas: analysis.fontesRecomendadas || [],
        });
        
        console.log("Verification saved to database");
      }
    } catch (dbError) {
      console.error("Error saving to database:", dbError);
      // Continue even if save fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis,
        newsData: { title, description, source, link }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error analyzing news:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

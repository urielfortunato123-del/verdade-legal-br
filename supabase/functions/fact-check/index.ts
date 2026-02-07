import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FactCheckRequest {
  claim: string;
  inputType?: "text" | "link";
}

async function fetchUrlContent(url: string): Promise<string> {
  try {
    console.log("Fetching URL content:", url);
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; FactCheckBot/1.0)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Extract text content from HTML (basic extraction)
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 8000); // Limit content length
    
    return textContent;
  } catch (error) {
    console.error("Error fetching URL:", error);
    throw new Error("Não foi possível acessar o link fornecido");
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { claim, inputType = "text" } = await req.json() as FactCheckRequest;
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    if (!claim || claim.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Nenhuma afirmação fornecida" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let contentToAnalyze = claim;
    
    // If it's a link, fetch the content
    if (inputType === "link") {
      contentToAnalyze = await fetchUrlContent(claim);
      console.log("Fetched content length:", contentToAnalyze.length);
    }

    console.log("Fact-checking:", inputType === "link" ? `URL: ${claim}` : claim.substring(0, 100) + "...");

    const systemPrompt = `Você é um verificador de fatos especializado no Brasil, similar ao "Fato ou Fake" do G1 e às agências de checagem como Aos Fatos e Lupa.

MISSÃO: Analisar afirmações, posts de redes sociais e notícias para verificar sua veracidade.

REGRAS CRÍTICAS:
1. Seja IMPARCIAL - não favoreça nenhum lado político
2. Baseie-se APENAS em fatos verificáveis e fontes confiáveis
3. Separe FATO de OPINIÃO
4. Considere o CONTEXTO completo
5. Identifique informações FORA DE CONTEXTO ou DISTORCIDAS
6. NÃO invente dados ou estatísticas

CATEGORIAS DE VEREDITO (use exatamente estes valores):
- "verdade": Afirmação comprovadamente verdadeira
- "mentira": Afirmação comprovadamente falsa  
- "meia_verdade": Contém verdade parcial mas induz ao erro ou é exagerada
- "inconclusivo": Impossível verificar com fontes disponíveis

Responda em JSON com esta estrutura EXATA:
{
  "postResumo": "Resumo objetivo do que a publicação/afirmação diz (2-3 linhas)",
  "veredito": "verdade" | "mentira" | "meia_verdade" | "inconclusivo",
  "vereditoTitulo": "Título curto e direto: 'VERDADE', 'MENTIRA', 'MEIA VERDADE' ou 'INCONCLUSIVO'",
  "explicacao": "Explicação detalhada de 4-8 linhas sobre por que a afirmação é verdade/mentira. Use linguagem clara e acessível.",
  "pontosChave": [
    "Ponto importante 1",
    "Ponto importante 2", 
    "Ponto importante 3"
  ],
  "fontes": [
    {"nome": "Nome da fonte", "descricao": "O que a fonte diz", "url": "https://..."},
    {"nome": "Nome da fonte 2", "descricao": "O que a fonte diz", "url": "https://..."}
  ],
  "contexto": "Contexto adicional importante que ajuda a entender o tema (opcional)",
  "dataVerificacao": "${new Date().toISOString().split('T')[0]}",
  "confianca": 0.0 a 1.0
}`;

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
          { role: "system", content: systemPrompt },
          { role: "user", content: `Verifique esta afirmação/publicação:\n\n${contentToAnalyze}` },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns segundos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos de IA insuficientes. Adicione créditos ao workspace." }),
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

    console.log("Fact-check completed");

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
      console.error("JSON parse error:", parseError);
      result = { 
        postResumo: "Não foi possível analisar a afirmação",
        veredito: "nao_verificavel",
        vereditoTitulo: "Análise inconclusiva",
        explicacao: content,
        pontosChave: [],
        fontes: [],
        confianca: 0.3
      };
    }

    return new Response(
      JSON.stringify({ success: true, ...result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Fact-check error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

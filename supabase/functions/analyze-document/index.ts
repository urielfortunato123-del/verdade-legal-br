import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalyzeRequest {
  text?: string;
  imageUrl?: string;
  imageBase64?: string;
  mode: "news_tv" | "document";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, imageUrl, imageBase64, mode } = await req.json() as AnalyzeRequest;
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    if (!text && !imageUrl && !imageBase64) {
      return new Response(
        JSON.stringify({ error: "No text or image provided for analysis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = mode === "news_tv" 
      ? `Você é um verificador de fatos jurídicos brasileiro. Sua função é analisar textos de notícias/matérias e:
1. Identificar afirmações verificáveis sobre leis, direitos ou programas governamentais
2. Classificar cada afirmação como:
   - "confirmed" (✅): A lei brasileira confirma claramente
   - "misleading" (⚠️): Existe base legal, mas há distorção/omissão
   - "false" (❌): Não existe base legal ou contraria a lei
   - "unverifiable" (❓): Não é possível verificar apenas com legislação

REGRAS CRÍTICAS:
- Nunca invente leis ou artigos
- Se não souber, classifique como "unverifiable"
- Sempre cite artigos/leis específicos quando existirem
- Seja objetivo, sem opinião política

Responda em JSON com esta estrutura:
{
  "overallVerdict": "confirmed" | "misleading" | "false" | "unverifiable",
  "summary": "Resumo de 2-3 frases",
  "claims": [
    {
      "text": "texto da afirmação",
      "verdict": "confirmed" | "misleading" | "false" | "unverifiable",
      "explanation": "explicação curta",
      "sources": [{"law": "Nome da Lei", "article": "Art. X", "url": "URL oficial"}]
    }
  ]
}`
      : `Você é um assistente jurídico brasileiro especializado em análise de documentos. Sua função é:
1. Extrair informações-chave (datas, valores, nomes, CPF/CNPJ mascarados)
2. Identificar pontos legais relevantes
3. Resumir o documento de forma objetiva

REGRAS:
- Mascare dados sensíveis (CPF: 123.***.***-**)
- Não dê conselhos jurídicos, apenas informações
- Cite leis relevantes quando aplicável

Responda em JSON:
{
  "summary": "Resumo do documento",
  "keyInfo": [{"key": "Campo", "value": "Valor"}],
  "legalPoints": ["Ponto jurídico relevante 1", "..."],
  "relatedLaws": [{"law": "Nome", "article": "Art.", "relevance": "Por que é relevante"}]
}`;

    // Build message content based on input type
    let userContent: Array<{ type: string; text?: string; image_url?: { url: string } }>;

    if (imageUrl || imageBase64) {
      // Multimodal request with image
      const imageSource = imageBase64 
        ? `data:image/jpeg;base64,${imageBase64}`
        : imageUrl;

      userContent = [
        {
          type: "text",
          text: `Analise o seguinte conteúdo (extraia o texto da imagem se necessário e verifique as informações):\n\n${text || "Extraia e analise o texto desta imagem."}`
        },
        {
          type: "image_url",
          image_url: {
            url: imageSource!
          }
        }
      ];
    } else {
      // Text-only request
      userContent = [
        {
          type: "text",
          text: `Analise o seguinte texto:\n\n${text}`
        }
      ];
    }

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
          { role: "user", content: userContent },
        ],
        response_format: { type: "json_object" },
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
          JSON.stringify({ error: "Créditos insuficientes. Adicione créditos na sua conta." }),
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

    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch {
      analysis = { 
        overallVerdict: "unverifiable", 
        summary: content,
        claims: [] 
      };
    }

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Analysis error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

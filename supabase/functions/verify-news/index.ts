import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Search Brave for corroborating/contradicting sources
async function searchBrave(query: string, apiKey: string): Promise<{ title: string; url: string; snippet: string }[]> {
  try {
    const params = new URLSearchParams({
      q: query,
      count: "8",
      search_lang: "pt-br",
      country: "BR",
      freshness: "pw", // past week
    });

    const response = await fetch(`https://api.search.brave.com/res/v1/web/search?${params}`, {
      headers: {
        "Accept": "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": apiKey,
      },
    });

    if (!response.ok) {
      console.error("Brave Search error:", response.status);
      return [];
    }

    const data = await response.json();
    const results = data.web?.results || [];

    return results.map((r: any) => ({
      title: r.title || "",
      url: r.url || "",
      snippet: r.description || "",
    }));
  } catch (error) {
    console.error("Brave Search failed:", error);
    return [];
  }
}

// Try to fetch article content from a URL (basic scraping)
async function fetchArticleSnippet(url: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; NewsVerifier/1.0)" },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) return "";

    const html = await response.text();
    // Extract text from paragraphs
    const paragraphs = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
    const text = paragraphs
      .slice(0, 10)
      .map(p => p.replace(/<[^>]*>/g, "").trim())
      .filter(t => t.length > 50)
      .join("\n");

    return text.substring(0, 1500);
  } catch {
    return "";
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "Serviço de verificação não configurado" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const BRAVE_API_KEY = Deno.env.get("BRAVE_SEARCH_API_KEY");

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

    console.log("Verifying news with multi-source search:", title);

    // STEP 1: Search multiple sources via Brave Search
    let searchResults: { title: string; url: string; snippet: string }[] = [];
    let articleContents: string[] = [];

    if (BRAVE_API_KEY) {
      // Search with the exact title
      const titleSearch = searchBrave(title, BRAVE_API_KEY);
      // Search with key terms + "é verdade" to find fact-checks
      const factCheckSearch = searchBrave(`"${title.split(" ").slice(0, 6).join(" ")}" verificação fact-check`, BRAVE_API_KEY);
      
      const [titleResults, factCheckResults] = await Promise.all([titleSearch, factCheckSearch]);
      
      // Merge and deduplicate by URL
      const allResults = [...titleResults, ...factCheckResults];
      const seen = new Set<string>();
      searchResults = allResults.filter(r => {
        if (seen.has(r.url)) return false;
        seen.add(r.url);
        return true;
      }).slice(0, 10);

      console.log(`Found ${searchResults.length} sources from web search`);

      // STEP 2: Fetch content from top 3 most relevant sources (excluding the original)
      const sourcesToFetch = searchResults
        .filter(r => !link || !r.url.includes(new URL(link).hostname))
        .slice(0, 3);

      const contentPromises = sourcesToFetch.map(r => fetchArticleSnippet(r.url));
      articleContents = (await Promise.all(contentPromises)).filter(c => c.length > 100);

      console.log(`Fetched content from ${articleContents.length} articles`);
    } else {
      console.warn("BRAVE_SEARCH_API_KEY not configured, skipping web search");
    }

    // STEP 3: Build context-rich prompt with all gathered evidence
    const sourcesContext = searchResults.length > 0
      ? `\n\nFONTES ENCONTRADAS NA WEB (${searchResults.length} resultados):\n${searchResults.map((r, i) => 
          `${i + 1}. [${r.title}] (${r.url})\n   Trecho: ${r.snippet}`
        ).join("\n\n")}`
      : "\n\nNenhuma fonte adicional encontrada na web.";

    const articlesContext = articleContents.length > 0
      ? `\n\nCONTEÚDO DE ARTIGOS RELACIONADOS:\n${articleContents.map((c, i) => 
          `--- Artigo ${i + 1} ---\n${c}`
        ).join("\n\n")}`
      : "";

    const systemPrompt = `Você é um verificador de fatos jornalístico rigoroso, especializado em notícias brasileiras. 

METODOLOGIA DE VERIFICAÇÃO:
1. Analise a manchete/título da notícia
2. Compare com as fontes encontradas na web (fornecidas abaixo)
3. Verifique se múltiplas fontes independentes confirmam ou contradizem a informação
4. Considere a credibilidade das fontes (veículos tradicionais vs blogs)
5. Identifique se há checagens de fatos (fact-checks) já realizadas sobre o tema

CRITÉRIOS DE CLASSIFICAÇÃO:
- "confirmed" (✅ Confirmado): Múltiplas fontes independentes confirmam. Confiança alta.
- "misleading" (⚠️ Enganoso): Tem base factual mas título exagera, omite contexto ou distorce.
- "false" (❌ Falso): Fontes confiáveis contradizem. Fact-checkers classificaram como falso.
- "unverifiable" (❓ Não verificável): Poucas fontes disponíveis ou informação muito recente.

IMPORTANTE: 
- Seja rigoroso. Na dúvida, classifique como "misleading" ou "unverifiable".
- Cite as fontes específicas que embasam sua conclusão.
- A confiança deve refletir quantas fontes independentes corroboram o veredito.

Responda APENAS com JSON válido:
{
  "verdict": "confirmed" | "misleading" | "false" | "unverifiable",
  "confidence": número de 0 a 100,
  "explanation": "Explicação detalhada em português do Brasil (2-4 frases) citando fontes",
  "sources": ["Lista de fontes confiáveis consultadas com URLs quando disponíveis"]
}`;

    const userPrompt = `NOTÍCIA A VERIFICAR:
TÍTULO: ${title}
${description ? `DESCRIÇÃO: ${description}` : ""}
FONTE ORIGINAL: ${source}
${link ? `LINK: ${link}` : ""}
${sourcesContext}
${articlesContext}

Com base nas fontes encontradas, verifique a veracidade desta notícia e responda com o JSON.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://lovable.dev",
        "X-Title": "Verificador de Noticias",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
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

    let result;
    try {
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

    // Add web search sources to the result if not already included
    if (searchResults.length > 0 && (!result.sources || result.sources.length === 0)) {
      result.sources = searchResults.slice(0, 5).map(r => r.url);
    }

    console.log(`Verification result: ${result.verdict} (${result.confidence}%) - ${searchResults.length} sources checked`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        ...result,
        sourcesChecked: searchResults.length,
      }),
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

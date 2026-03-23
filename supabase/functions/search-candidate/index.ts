import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function searchBrave(query: string, apiKey: string): Promise<{ title: string; url: string; snippet: string }[]> {
  try {
    const params = new URLSearchParams({
      q: query,
      count: "10",
      search_lang: "pt-br",
      country: "BR",
    });

    const response = await fetch(`https://api.search.brave.com/res/v1/web/search?${params}`, {
      headers: {
        "Accept": "application/json",
        "X-Subscription-Token": apiKey,
      },
    });

    if (!response.ok) return [];

    const data = await response.json();
    return (data.web?.results || []).map((r: any) => ({
      title: r.title || "",
      url: r.url || "",
      snippet: r.description || "",
    }));
  } catch {
    return [];
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
        JSON.stringify({ success: false, error: "Serviço não configurado" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const BRAVE_API_KEY = Deno.env.get("BRAVE_SEARCH_API_KEY");

    const body = await req.json();
    const { candidateName } = body;

    if (!candidateName || candidateName.trim().length < 3) {
      return new Response(
        JSON.stringify({ success: false, error: "Nome do candidato é obrigatório (mínimo 3 caracteres)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Searching candidate:", candidateName);

    // Search multiple angles
    let searchContext = "";

    if (BRAVE_API_KEY) {
      const [generalResults, politicalResults, newsResults] = await Promise.all([
        searchBrave(`${candidateName} político candidato Brasil biografia`, BRAVE_API_KEY),
        searchBrave(`${candidateName} TSE eleições projetos de lei votações`, BRAVE_API_KEY),
        searchBrave(`${candidateName} polêmicas processos escândalos investigação`, BRAVE_API_KEY),
      ]);

      const allResults = [...generalResults, ...politicalResults, ...newsResults];
      const seen = new Set<string>();
      const unique = allResults.filter(r => {
        if (seen.has(r.url)) return false;
        seen.add(r.url);
        return true;
      });

      searchContext = unique.length > 0
        ? `\n\nFONTES DA WEB (${unique.length} resultados):\n${unique.map((r, i) => 
            `${i + 1}. [${r.title}] (${r.url})\n   ${r.snippet}`
          ).join("\n\n")}`
        : "\n\nNenhuma fonte encontrada na web.";

      console.log(`Found ${unique.length} web sources for ${candidateName}`);
    }

    const systemPrompt = `Você é um analista político jornalístico brasileiro imparcial e rigoroso. Sua função é compilar um dossiê completo sobre candidatos políticos brasileiros com base em fontes públicas.

IMPORTANTE: Mantenha absoluta NEUTRALIDADE POLÍTICA. Foque exclusivamente em fatos verificáveis. Não emita opinião, não faça propaganda a favor nem contra nenhum candidato.

Responda APENAS com JSON válido no formato abaixo. Se não encontrar informações suficientes, preencha com "Informação não disponível".

{
  "nome_completo": "Nome completo do candidato",
  "partido": "Partido atual e sigla",
  "cargo_atual": "Cargo político atual ou último cargo",
  "estado": "Estado de atuação",
  "idade": "Idade ou data de nascimento se disponível",
  "formacao": "Formação acadêmica",
  "historico_politico": [
    "Cargos e mandatos em ordem cronológica (mais recente primeiro)"
  ],
  "principais_projetos": [
    "Projetos de lei ou iniciativas legislativas relevantes"
  ],
  "votacoes_polemicas": [
    "Votações importantes ou controversas em que participou"
  ],
  "processos_juridicos": [
    "Processos judiciais, investigações ou condenações conhecidas"
  ],
  "patrimonio_declarado": "Patrimônio declarado ao TSE (se disponível)",
  "curiosidades": [
    "Fatos relevantes adicionais"
  ],
  "fontes": ["URLs das fontes utilizadas"],
  "aviso": "As informações acima são baseadas em fontes públicas disponíveis na internet e podem estar incompletas ou desatualizadas. Verifique nos sites oficiais do TSE, Câmara dos Deputados e Senado Federal."
}`;

    const userPrompt = `Compile um dossiê completo sobre o candidato/político: ${candidateName}
${searchContext}

Com base nas informações disponíveis, gere o dossiê em JSON.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://lovable.dev",
        "X-Title": "Verdade na Lei - Candidatos",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        max_tokens: 4000,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI error:", response.status, errorText);
      throw new Error(`AI error: ${response.status}`);
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
        throw new Error("No JSON found");
      }
    } catch {
      console.error("Failed to parse:", content);
      return new Response(
        JSON.stringify({ success: false, error: "Não foi possível processar as informações do candidato." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, candidate: result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

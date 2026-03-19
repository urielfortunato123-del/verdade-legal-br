import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// RSS feeds de notícias brasileiras por categoria
const RSS_FEEDS: Record<string, { name: string; url: string; encoding?: string }[]> = {
  geral: [
    { name: "G1", url: "https://g1.globo.com/rss/g1/" },
    { name: "Metrópoles", url: "https://www.metropoles.com/feed" },
    { name: "Folha de S.Paulo", url: "https://feeds.folha.uol.com.br/emcimadahora/rss091.xml" },
    { name: "Estadão", url: "https://www.estadao.com.br/rss/ultimas.xml" },
    { name: "Gazeta do Povo", url: "https://www.gazetadopovo.com.br/feed/rss/" },
    { name: "CartaCapital", url: "https://www.cartacapital.com.br/feed/" },
    { name: "Oeste", url: "https://revistaoeste.com/feed/" },
    { name: "UOL", url: "https://rss.uol.com.br/feed/noticias.xml" },
    { name: "Jovem Pan", url: "https://jovempan.com.br/feed" },
    { name: "CNN Brasil", url: "https://www.cnnbrasil.com.br/feed/" },
    { name: "Brasil 247", url: "https://www.brasil247.com/feed" },
    { name: "Brasil de Fato", url: "https://www.brasildefato.com.br/rss2.xml" },
    { name: "O Antagonista", url: "https://oantagonista.com.br/feed/" },
    { name: "Brasil Paralelo", url: "https://www.brasilparalelo.com.br/feed" },
    { name: "Jornal da Cidade Online", url: "https://www.jornaldacidadeonline.com.br/feed" },
    { name: "Esquerda Diário", url: "https://www.esquerdadiario.com.br/feed" },
    { name: "Revista Crusoé", url: "https://crusoe.com.br/feed/" },
    { name: "Pleno News", url: "https://pleno.news/feed" },
    { name: "Conexão Política", url: "https://conexaopolitica.com.br/feed/" },
    { name: "Poder360", url: "https://www.poder360.com.br/feed/" },
    { name: "Revista Oeste", url: "https://revistaoeste.com/feed/" },
  ],
  politica: [
    { name: "G1 Política", url: "https://g1.globo.com/rss/g1/politica/" },
    { name: "Metrópoles", url: "https://www.metropoles.com/brasil/politica-brasil/feed" },
    { name: "Folha Poder", url: "https://feeds.folha.uol.com.br/poder/rss091.xml" },
    { name: "Estadão Política", url: "https://www.estadao.com.br/rss/politica.xml" },
    { name: "Gazeta do Povo", url: "https://www.gazetadopovo.com.br/republica/feed/rss/" },
    { name: "CartaCapital", url: "https://www.cartacapital.com.br/politica/feed/" },
    { name: "Oeste", url: "https://revistaoeste.com/politica/feed/" },
    { name: "Senado", url: "https://www12.senado.leg.br/noticias/feed" },
    { name: "Jovem Pan", url: "https://jovempan.com.br/noticias/politica/feed" },
    { name: "CNN Brasil", url: "https://www.cnnbrasil.com.br/politica/feed/" },
    { name: "Brasil 247", url: "https://www.brasil247.com/feed/politica" },
    { name: "Brasil de Fato", url: "https://www.brasildefato.com.br/rss2.xml" },
    { name: "O Antagonista", url: "https://oantagonista.com.br/feed/" },
    { name: "Brasil Paralelo", url: "https://www.brasilparalelo.com.br/feed" },
    { name: "Jornal da Cidade Online", url: "https://www.jornaldacidadeonline.com.br/feed" },
    { name: "Esquerda Diário", url: "https://www.esquerdadiario.com.br/feed" },
    { name: "Revista Crusoé", url: "https://crusoe.com.br/feed/" },
    { name: "Pleno News", url: "https://pleno.news/feed" },
    { name: "Conexão Política", url: "https://conexaopolitica.com.br/feed/" },
    { name: "Poder360", url: "https://www.poder360.com.br/feed/" },
  ],
  economia: [
    { name: "G1 Economia", url: "https://g1.globo.com/rss/g1/economia/" },
    { name: "Metrópoles", url: "https://www.metropoles.com/negocios/feed" },
    { name: "Folha Mercado", url: "https://feeds.folha.uol.com.br/mercado/rss091.xml" },
    { name: "Estadão Economia", url: "https://www.estadao.com.br/rss/economia.xml" },
    { name: "Gazeta do Povo", url: "https://www.gazetadopovo.com.br/economia/feed/rss/" },
    { name: "Oeste", url: "https://revistaoeste.com/economia/feed/" },
    { name: "CNN Brasil", url: "https://www.cnnbrasil.com.br/economia/feed/" },
  ],
  esportes: [
    { name: "G1 Esportes", url: "https://g1.globo.com/rss/g1/esporte/" },
    { name: "Metrópoles", url: "https://www.metropoles.com/esportes/feed" },
    { name: "Folha Esporte", url: "https://feeds.folha.uol.com.br/esporte/rss091.xml" },
    { name: "Oeste", url: "https://revistaoeste.com/esportes/feed/" },
    { name: "UOL Esporte", url: "https://rss.uol.com.br/feed/esporte.xml" },
  ],
  tecnologia: [
    { name: "G1 Tecnologia", url: "https://g1.globo.com/rss/g1/tecnologia/" },
    { name: "Metrópoles", url: "https://www.metropoles.com/tecnologia/feed" },
    { name: "Folha Tec", url: "https://feeds.folha.uol.com.br/tec/rss091.xml" },
    { name: "UOL Tecnologia", url: "https://rss.uol.com.br/feed/tecnologia.xml" },
  ],
  entretenimento: [
    { name: "G1 Pop & Arte", url: "https://g1.globo.com/rss/g1/pop-arte/" },
    { name: "Metrópoles", url: "https://www.metropoles.com/entretenimento/feed" },
    { name: "Folha Ilustrada", url: "https://feeds.folha.uol.com.br/ilustrada/rss091.xml" },
    { name: "UOL Entretenimento", url: "https://rss.uol.com.br/feed/entretenimento.xml" },
  ],
};

interface NewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
  imageUrl: string | null;
}

function extractImageUrl(itemXml: string): string | null {
  // Try media:content
  const mediaMatch = itemXml.match(/<media:content[^>]+url=["']([^"']+)["']/);
  if (mediaMatch) return mediaMatch[1];

  // Try media:thumbnail
  const thumbMatch = itemXml.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/);
  if (thumbMatch) return thumbMatch[1];

  // Try enclosure with image type
  const enclosureMatch = itemXml.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image\/[^"']+["']/);
  if (enclosureMatch) return enclosureMatch[1];

  // Try enclosure without type check (often images)
  const enclosureAny = itemXml.match(/<enclosure[^>]+url=["']([^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/i);
  if (enclosureAny) return enclosureAny[1];

  // Try image tag inside description CDATA
  const imgMatch = itemXml.match(/<img[^>]+src=["']([^"']+)["']/);
  if (imgMatch) return imgMatch[1];

  return null;
}

function parseRSSItem(item: string, source: string): NewsItem | null {
  try {
    const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/s);
    const linkMatch = item.match(/<link>(.*?)<\/link>/s);
    const descMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/s);
    const dateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/s);

    const title = titleMatch ? (titleMatch[1] || titleMatch[2])?.trim() : null;
    const link = linkMatch ? linkMatch[1]?.trim() : null;
    const description = descMatch ? (descMatch[1] || descMatch[2])?.trim() : "";
    const pubDate = dateMatch ? dateMatch[1]?.trim() : new Date().toISOString();
    const imageUrl = extractImageUrl(item);

    if (!title || !link) return null;

    const cleanDescription = description
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&#x27;/g, "'")
      .replace(/\]\]>/g, "")
      .substring(0, 200)
      .trim();

    return {
      title,
      link,
      description: cleanDescription,
      pubDate,
      source,
      imageUrl,
    };
  } catch {
    return null;
  }
}

async function fetchRSSFeed(feedUrl: string, sourceName: string): Promise<NewsItem[]> {
  try {
    const response = await fetch(feedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; NewsBot/1.0)",
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${sourceName}: ${response.status}`);
      return [];
    }

    // Get as ArrayBuffer and decode with proper encoding
    const buffer = await response.arrayBuffer();
    let xml: string;
    
    // Check content-type header for encoding hints
    const contentType = response.headers.get("content-type") || "";
    
    // Folha uses ISO-8859-1, check URL or content-type
    const isFolha = feedUrl.includes("folha.uol.com.br");
    const isLatin1 = contentType.toLowerCase().includes("iso-8859-1") || 
                     contentType.toLowerCase().includes("latin1") ||
                     isFolha;
    
    if (isLatin1) {
      xml = new TextDecoder("iso-8859-1").decode(buffer);
    } else {
      // First decode as UTF-8
      xml = new TextDecoder("utf-8").decode(buffer);
      
      // Check XML declaration for encoding
      const encodingMatch = xml.match(/<\?xml[^>]+encoding=["']([^"']+)["']/i);
      const declaredEncoding = encodingMatch?.[1]?.toLowerCase();
      
      if (declaredEncoding === "iso-8859-1" || declaredEncoding === "latin1") {
        xml = new TextDecoder("iso-8859-1").decode(buffer);
      } else if (xml.includes("\uFFFD")) {
        // Fallback: if we see replacement characters, try Latin-1
        xml = new TextDecoder("iso-8859-1").decode(buffer);
      }
    }
    
    const items: NewsItem[] = [];

    // Extrair itens do RSS
    const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g);
    if (!itemMatches) return [];

    for (const itemXml of itemMatches.slice(0, 5)) {
      const parsed = parseRSSItem(itemXml, sourceName);
      if (parsed) items.push(parsed);
    }

    return items;
  } catch (error) {
    console.error(`Error fetching ${sourceName}:`, error);
    return [];
  }
}

// Mapeamento de coordenadas para estado/região do Brasil
function getStateFromCoords(lat: number, lon: number): string {
  // Approximate Brazilian state detection based on lat/lon ranges
  const states: { name: string; feeds: { name: string; url: string }[]; latMin: number; latMax: number; lonMin: number; lonMax: number }[] = [
    { name: "SP", latMin: -25.5, latMax: -19.5, lonMin: -53.5, lonMax: -44.0, feeds: [
      { name: "G1 SP", url: "https://g1.globo.com/rss/g1/sao-paulo/" },
      { name: "Folha SP", url: "https://feeds.folha.uol.com.br/cotidiano/rss091.xml" },
      { name: "Estadão SP", url: "https://www.estadao.com.br/rss/sao-paulo.xml" },
    ]},
    { name: "RJ", latMin: -23.5, latMax: -20.5, lonMin: -44.9, lonMax: -40.5, feeds: [
      { name: "G1 RJ", url: "https://g1.globo.com/rss/g1/rio-de-janeiro/" },
      { name: "O Globo", url: "https://oglobo.globo.com/rss/oglobo.xml" },
    ]},
    { name: "MG", latMin: -23.0, latMax: -14.0, lonMin: -51.5, lonMax: -39.8, feeds: [
      { name: "G1 MG", url: "https://g1.globo.com/rss/g1/minas-gerais/" },
    ]},
    { name: "BA", latMin: -18.5, latMax: -8.5, lonMin: -46.5, lonMax: -37.0, feeds: [
      { name: "G1 BA", url: "https://g1.globo.com/rss/g1/bahia/" },
    ]},
    { name: "RS", latMin: -34.0, latMax: -27.0, lonMin: -58.0, lonMax: -49.5, feeds: [
      { name: "G1 RS", url: "https://g1.globo.com/rss/g1/rs/" },
      { name: "GaúchaZH", url: "https://gauchazh.clicrbs.com.br/rss/" },
    ]},
    { name: "PR", latMin: -27.0, latMax: -22.5, lonMin: -55.0, lonMax: -48.0, feeds: [
      { name: "G1 PR", url: "https://g1.globo.com/rss/g1/parana/" },
      { name: "Gazeta do Povo", url: "https://www.gazetadopovo.com.br/feed/rss/" },
    ]},
    { name: "SC", latMin: -29.5, latMax: -25.5, lonMin: -54.0, lonMax: -48.0, feeds: [
      { name: "G1 SC", url: "https://g1.globo.com/rss/g1/santa-catarina/" },
    ]},
    { name: "PE", latMin: -10.0, latMax: -7.0, lonMin: -41.5, lonMax: -34.5, feeds: [
      { name: "G1 PE", url: "https://g1.globo.com/rss/g1/pernambuco/" },
    ]},
    { name: "CE", latMin: -8.0, latMax: -2.5, lonMin: -41.5, lonMax: -37.0, feeds: [
      { name: "G1 CE", url: "https://g1.globo.com/rss/g1/ceara/" },
    ]},
    { name: "DF", latMin: -16.1, latMax: -15.4, lonMin: -48.3, lonMax: -47.3, feeds: [
      { name: "G1 DF", url: "https://g1.globo.com/rss/g1/distrito-federal/" },
      { name: "Metrópoles DF", url: "https://www.metropoles.com/distrito-federal/feed" },
    ]},
    { name: "GO", latMin: -19.5, latMax: -12.5, lonMin: -53.0, lonMax: -46.0, feeds: [
      { name: "G1 GO", url: "https://g1.globo.com/rss/g1/goias/" },
    ]},
    { name: "PA", latMin: -10.0, latMax: 2.5, lonMin: -58.5, lonMax: -46.0, feeds: [
      { name: "G1 PA", url: "https://g1.globo.com/rss/g1/para/" },
    ]},
    { name: "AM", latMin: -10.0, latMax: 3.0, lonMin: -74.0, lonMax: -56.0, feeds: [
      { name: "G1 AM", url: "https://g1.globo.com/rss/g1/amazonas/" },
    ]},
  ];

  for (const state of states) {
    if (lat >= state.latMin && lat <= state.latMax && lon >= state.lonMin && lon <= state.lonMax) {
      return state.name;
    }
  }
  return "BR"; // fallback
}

function getLocalFeeds(lat: number, lon: number): { name: string; url: string }[] {
  const states = [
    { name: "SP", latMin: -25.5, latMax: -19.5, lonMin: -53.5, lonMax: -44.0, feeds: [
      { name: "G1 São Paulo", url: "https://g1.globo.com/rss/g1/sao-paulo/" },
      { name: "Folha Cotidiano", url: "https://feeds.folha.uol.com.br/cotidiano/rss091.xml" },
    ]},
    { name: "RJ", latMin: -23.5, latMax: -20.5, lonMin: -44.9, lonMax: -40.5, feeds: [
      { name: "G1 Rio de Janeiro", url: "https://g1.globo.com/rss/g1/rio-de-janeiro/" },
    ]},
    { name: "MG", latMin: -23.0, latMax: -14.0, lonMin: -51.5, lonMax: -39.8, feeds: [
      { name: "G1 Minas Gerais", url: "https://g1.globo.com/rss/g1/minas-gerais/" },
    ]},
    { name: "BA", latMin: -18.5, latMax: -8.5, lonMin: -46.5, lonMax: -37.0, feeds: [
      { name: "G1 Bahia", url: "https://g1.globo.com/rss/g1/bahia/" },
    ]},
    { name: "RS", latMin: -34.0, latMax: -27.0, lonMin: -58.0, lonMax: -49.5, feeds: [
      { name: "G1 Rio Grande do Sul", url: "https://g1.globo.com/rss/g1/rs/" },
    ]},
    { name: "PR", latMin: -27.0, latMax: -22.5, lonMin: -55.0, lonMax: -48.0, feeds: [
      { name: "G1 Paraná", url: "https://g1.globo.com/rss/g1/parana/" },
      { name: "Gazeta do Povo", url: "https://www.gazetadopovo.com.br/feed/rss/" },
    ]},
    { name: "SC", latMin: -29.5, latMax: -25.5, lonMin: -54.0, lonMax: -48.0, feeds: [
      { name: "G1 Santa Catarina", url: "https://g1.globo.com/rss/g1/santa-catarina/" },
    ]},
    { name: "PE", latMin: -10.0, latMax: -7.0, lonMin: -41.5, lonMax: -34.5, feeds: [
      { name: "G1 Pernambuco", url: "https://g1.globo.com/rss/g1/pernambuco/" },
    ]},
    { name: "CE", latMin: -8.0, latMax: -2.5, lonMin: -41.5, lonMax: -37.0, feeds: [
      { name: "G1 Ceará", url: "https://g1.globo.com/rss/g1/ceara/" },
    ]},
    { name: "DF", latMin: -16.1, latMax: -15.4, lonMin: -48.3, lonMax: -47.3, feeds: [
      { name: "G1 Distrito Federal", url: "https://g1.globo.com/rss/g1/distrito-federal/" },
      { name: "Metrópoles DF", url: "https://www.metropoles.com/distrito-federal/feed" },
    ]},
    { name: "GO", latMin: -19.5, latMax: -12.5, lonMin: -53.0, lonMax: -46.0, feeds: [
      { name: "G1 Goiás", url: "https://g1.globo.com/rss/g1/goias/" },
    ]},
    { name: "PA", latMin: -10.0, latMax: 2.5, lonMin: -58.5, lonMax: -46.0, feeds: [
      { name: "G1 Pará", url: "https://g1.globo.com/rss/g1/para/" },
    ]},
    { name: "AM", latMin: -10.0, latMax: 3.0, lonMin: -74.0, lonMax: -56.0, feeds: [
      { name: "G1 Amazonas", url: "https://g1.globo.com/rss/g1/amazonas/" },
    ]},
    { name: "MA", latMin: -11.0, latMax: -1.0, lonMin: -48.5, lonMax: -41.5, feeds: [
      { name: "G1 Maranhão", url: "https://g1.globo.com/rss/g1/maranhao/" },
    ]},
    { name: "ES", latMin: -21.5, latMax: -17.5, lonMin: -41.9, lonMax: -39.5, feeds: [
      { name: "G1 Espírito Santo", url: "https://g1.globo.com/rss/g1/espirito-santo/" },
    ]},
  ];

  for (const state of states) {
    if (lat >= state.latMin && lat <= state.latMax && lon >= state.lonMin && lon <= state.lonMax) {
      return state.feeds;
    }
  }

  // Fallback: general Brazil feeds
  return [
    { name: "G1", url: "https://g1.globo.com/rss/g1/" },
    { name: "Metrópoles", url: "https://www.metropoles.com/feed" },
  ];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let category = "geral";
    let latitude: number | null = null;
    let longitude: number | null = null;

    try {
      const body = await req.json();
      if (body.category && (RSS_FEEDS[body.category] || body.category === "local")) {
        category = body.category;
      }
      if (body.latitude !== undefined) latitude = body.latitude;
      if (body.longitude !== undefined) longitude = body.longitude;
    } catch {
      // Sem body, usar categoria geral
    }

    console.log(`Fetching news (category: ${category}, lat: ${latitude}, lon: ${longitude})...`);

    let feeds: { name: string; url: string }[];

    if (category === "local" && latitude !== null && longitude !== null) {
      feeds = getLocalFeeds(latitude, longitude);
      console.log(`Local feeds for coords (${latitude}, ${longitude}):`, feeds.map(f => f.name));
    } else {
      feeds = RSS_FEEDS[category] || RSS_FEEDS.geral;
    }

    const feedPromises = feeds.map((feed) =>
      fetchRSSFeed(feed.url, feed.name)
    );

    const results = await Promise.all(feedPromises);
    const allNews = results.flat();

    allNews.sort((a, b) => {
      const dateA = new Date(a.pubDate).getTime();
      const dateB = new Date(b.pubDate).getTime();
      return dateB - dateA;
    });

    const news = allNews.slice(0, 15);

    console.log(`Fetched ${news.length} news items for category: ${category}`);

    return new Response(
      JSON.stringify({ success: true, news, category }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching news:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

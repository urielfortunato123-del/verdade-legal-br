import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Mic, BookOpen, MessageSquare, Scale, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  type: "question" | "law";
  title: string;
  description?: string;
  href: string;
}

const quickQuestions = [
  { title: "Isso é crime?", href: "/perguntar?q=Isso é crime?" },
  { title: "Estou no meu direito?", href: "/perguntar?q=Estou no meu direito?" },
  { title: "Posso ser multado?", href: "/perguntar?q=Posso ser multado?" },
  { title: "É legal gravar conversas?", href: "/perguntar?q=É legal gravar conversas?" },
  { title: "Tenho direito a indenização?", href: "/perguntar?q=Tenho direito a indenização?" },
];

const laws = [
  { title: "Constituição Federal", description: "Lei fundamental do Brasil", href: "/biblioteca" },
  { title: "Código Penal", description: "Decreto-Lei 2.848/1940", href: "/biblioteca" },
  { title: "Código Civil", description: "Lei 10.406/2002", href: "/biblioteca" },
  { title: "Código de Defesa do Consumidor", description: "Lei 8.078/1990", href: "/biblioteca" },
  { title: "Lei Maria da Penha", description: "Lei 11.340/2006", href: "/biblioteca" },
  { title: "Estatuto da Criança e do Adolescente", description: "Lei 8.069/1990", href: "/biblioteca" },
  { title: "Estatuto do Idoso", description: "Lei 10.741/2003", href: "/biblioteca" },
  { title: "Código de Trânsito", description: "Lei 9.503/1997", href: "/biblioteca" },
];

export function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    const matchedQuestions: SearchResult[] = quickQuestions
      .filter(q => q.title.toLowerCase().includes(lowerQuery))
      .map(q => ({ type: "question", title: q.title, href: q.href }));

    const matchedLaws: SearchResult[] = laws
      .filter(l => 
        l.title.toLowerCase().includes(lowerQuery) || 
        l.description?.toLowerCase().includes(lowerQuery)
      )
      .map(l => ({ type: "law", title: l.title, description: l.description, href: l.href }));

    setResults([...matchedQuestions.slice(0, 3), ...matchedLaws.slice(0, 4)]);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/perguntar?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === "question") {
      navigate(result.href);
    } else {
      navigate(result.href);
    }
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative">
      <form onSubmit={handleSubmit} className="search-bar">
        <Search className="w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Pergunte sobre leis, notícias ou..."
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
        />
        <button 
          type="button"
          onClick={() => navigate("/checar-audio")}
          className="p-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Mic className="w-5 h-5" />
        </button>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (query.trim() || true) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
          {results.length > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              {results.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => handleResultClick(result)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors",
                    idx !== results.length - 1 && "border-b border-gray-50"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                    result.type === "question" ? "bg-primary/10" : "bg-accent/10"
                  )}>
                    {result.type === "question" ? (
                      <MessageSquare className="w-4 h-4 text-primary" />
                    ) : (
                      <Scale className="w-4 h-4 text-accent" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{result.title}</p>
                    {result.description && (
                      <p className="text-xs text-gray-500 truncate">{result.description}</p>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="p-4 text-center">
              <p className="text-gray-500 text-sm mb-2">Nenhum resultado para "{query}"</p>
              <button
                onClick={handleSubmit}
                className="text-primary font-medium text-sm hover:underline"
              >
                Perguntar sobre isso →
              </button>
            </div>
          ) : (
            <div className="p-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
                Sugestões
              </p>
              {quickQuestions.slice(0, 3).map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(q.href)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Search className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{q.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

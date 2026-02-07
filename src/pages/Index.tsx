import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import {
  MessageSquare,
  Mic,
  History,
  MoreHorizontal,
  Search,
  ChevronRight,
  User,
  Home,
  Star,
  Scale,
  Video,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const mainCards = [
    {
      emoji: "📘",
      title: "Perguntar",
      subtitle: "Lei",
      href: "/perguntar",
      variant: "green" as const,
    },
    {
      emoji: "📺",
      title: "Checar Notícia",
      subtitle: "",
      href: "/checar-imagem",
      variant: "green" as const,
    },
    {
      emoji: "⚖️",
      title: "Biblioteca",
      subtitle: "de Leis",
      href: "/biblioteca",
      variant: "blue" as const,
    },
    {
      emoji: "🎙️",
      title: "Gravar Áudio",
      subtitle: "",
      href: "/checar-audio",
      variant: "yellow" as const,
    },
  ];

  const quickQuestions = [
    "Isso é crime?",
    "Estou no meu direito?",
    "Posso ser multado?",
  ];

  return (
    <Layout hideHeader hideFooter>
      <div className="min-h-screen bg-brasil-sparkle pb-24">
        {/* Header Section */}
        <div className="px-4 pt-6 pb-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <button className="p-2 text-white/70 hover:text-white">
              <ChevronRight className="w-6 h-6 rotate-180" />
            </button>
            <div className="avatar-circle">
              <User className="w-6 h-6" />
            </div>
            <button className="p-2 text-white/70 hover:text-white">
              <MoreHorizontal className="w-6 h-6" />
            </button>
          </div>

          {/* Greeting */}
          <div className="text-center mb-6 animate-fade-in">
            <h1 className="text-3xl font-display font-bold text-white mb-2 text-shadow">
              Olá Brasileiros
            </h1>
            <div className="flag-badge inline-flex">
              <span className="text-lg">🇧🇷</span>
              <span>Brasil</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-bar mb-6 animate-fade-in animation-delay-100">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pergunte sobre leis, notícias ou..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
              onFocus={() => navigate("/perguntar")}
            />
            <button 
              onClick={() => navigate("/checar-audio")}
              className="p-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Menu */}
        <div className="px-4 mb-6">
          <h2 className="section-title">MENU PRINCIPAL</h2>
          
          <div className="grid grid-cols-2 gap-3 mb-4 animate-fade-in animation-delay-200">
            {mainCards.map((card) => (
              <button
                key={card.title}
                onClick={() => navigate(card.href)}
                className={`card-action card-action-${card.variant} text-left`}
              >
                <div className="flex flex-col h-full min-h-[100px]">
                  <div className="text-3xl mb-2">{card.emoji}</div>
                  <div className="mt-auto">
                    <div className="font-bold text-lg text-white leading-tight">
                      {card.title}
                    </div>
                    {card.subtitle && (
                      <div className="font-bold text-lg text-white/90 leading-tight">
                        {card.subtitle}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Secondary Buttons */}
          <div className="grid grid-cols-2 gap-3 animate-fade-in animation-delay-300">
            <button 
              onClick={() => navigate("/historico")}
              className="btn-compact"
            >
              <History className="w-5 h-5 text-secondary" />
              <span>Histórico</span>
            </button>
            <button 
              onClick={() => navigate("/sobre")}
              className="btn-compact"
            >
              <MoreHorizontal className="w-5 h-5 text-secondary" />
              <span>Mais</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </button>
          </div>
        </div>

        {/* Quick Questions Section */}
        <div className="px-4 mb-6">
          <div className="card-light p-4 animate-fade-in animation-delay-300">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-card-light-foreground">Consulta Rápida</h3>
                <p className="text-sm text-muted-foreground">Dúvidas Frequentes</p>
              </div>
              <button className="p-2 rounded-full bg-secondary text-secondary-foreground">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => navigate(`/perguntar?q=${encodeURIComponent(question)}`)}
                  className="quick-item w-full"
                >
                  <div className="flex items-center gap-3">
                    <Search className="w-4 h-4 text-primary" />
                    <span className="font-medium">{question}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bottom-nav">
          <button className="flex flex-col items-center gap-1 text-secondary">
            <Home className="w-6 h-6" />
          </button>
          <button 
            onClick={() => navigate("/historico")}
            className="flex flex-col items-center gap-1 text-white/50 hover:text-white/80"
          >
            <Star className="w-6 h-6" />
          </button>
          <button 
            onClick={() => navigate("/biblioteca")}
            className="flex flex-col items-center gap-1 text-white/50 hover:text-white/80"
          >
            <Scale className="w-6 h-6" />
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

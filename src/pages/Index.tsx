import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { SearchBar } from "@/components/SearchBar";
import { NewsSection } from "@/components/NewsSection";
import {
  User,
  Home,
  Star,
  Scale,
  Menu,
  MessageSquare,
  FileText,
  BookOpen,
  Mic,
  Clock,
  MoreHorizontal,
  ChevronRight,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: MessageSquare,
      label: "Perguntar",
      href: "/perguntar",
      variant: "default" as const,
    },
    {
      icon: FileText,
      label: "Checar Notícia",
      href: "/checar-imagem",
      variant: "pink" as const,
    },
    {
      icon: BookOpen,
      label: "Biblioteca",
      href: "/biblioteca",
      variant: "blue" as const,
    },
    {
      icon: Mic,
      label: "Gravar Áudio",
      href: "/checar-audio",
      variant: "yellow" as const,
    },
    {
      icon: Clock,
      label: "Histórico",
      href: "/historico",
      variant: "default" as const,
    },
    {
      icon: MoreHorizontal,
      label: "Mais",
      href: "/sobre",
      variant: "blue" as const,
    },
  ];

  const quickQuestions = [
    "Isso é crime?",
    "Estou no meu direito?",
    "Posso ser multado?",
  ];

  const getIconClass = (variant: string) => {
    switch (variant) {
      case "yellow":
        return "menu-icon menu-icon-yellow";
      case "blue":
        return "menu-icon menu-icon-blue";
      case "pink":
        return "menu-icon menu-icon-pink";
      default:
        return "menu-icon";
    }
  };

  return (
    <Layout hideHeader hideFooter>
      <div className="min-h-screen bg-gradient-orbs pb-28">
        {/* Decorative Orbs */}
        <div className="orb-green" />
        <div className="orb-yellow" />

        {/* Content */}
        <div className="relative z-10 px-5 pt-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/40" />
              <div className="w-2 h-2 rounded-full bg-white/40" />
              <div className="w-2 h-2 rounded-full bg-white/40" />
            </div>
            <button className="p-2 text-white/60 hover:text-white transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Avatar & Greeting */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden mb-4 shadow-lg">
              <span className="text-[140px] leading-none scale-150">🇧🇷</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-white mb-1">
              Olá Brasileiro
            </h1>
            <p className="text-lg text-white/80 font-medium mb-2">
              Antes de acreditar, verifique!
            </p>
            <div className="badge-glass">
              <span>Brasil</span>
            </div>
          </div>

          {/* Search */}
          <div className="mb-8">
            <SearchBar />
          </div>

          {/* Main Menu */}
          <div className="mb-8">
            <p className="section-label">MENU PRINCIPAL</p>
            <div className="grid grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.href)}
                  className="menu-card"
                >
                  <div className={getIconClass(item.variant)}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-white/90 text-center leading-tight">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Questions - Glass Panel */}
          <div className="glass-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-bold text-white text-lg">
                  Consulta Rápida
                </h2>
                <p className="text-sm text-white/60">Dúvidas Frequentes</p>
              </div>
              <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/90 transition-all hover:scale-105">
                <ChevronRight className="w-5 h-5 text-secondary-foreground" />
              </button>
            </div>

            <div className="space-y-3">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() =>
                    navigate(`/perguntar?q=${encodeURIComponent(question)}`)
                  }
                  className="quick-item-glass w-full"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-verde-brasil to-verde-brasil-dark flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-white/90">{question}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/40" />
                </button>
              ))}
            </div>
          </div>

          {/* News Section */}
          <div className="mt-6">
            <NewsSection />
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="nav-bottom">
          <button className="nav-item active">
            <Home className="w-6 h-6" />
          </button>
          <button onClick={() => navigate("/historico")} className="nav-item">
            <Star className="w-6 h-6" />
          </button>
          <button onClick={() => navigate("/biblioteca")} className="nav-item">
            <Scale className="w-6 h-6" />
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

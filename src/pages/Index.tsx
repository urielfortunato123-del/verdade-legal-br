import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { SearchBar } from "@/components/SearchBar";
import { NewsSection } from "@/components/NewsSection";
import {
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
      variant: "green" as const,
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
      variant: "green" as const,
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

  const getIconBgClass = (variant: string) => {
    switch (variant) {
      case "yellow":
        return "bg-gradient-to-br from-amarelo-ouro to-amarelo-ouro-dark";
      case "blue":
        return "bg-gradient-to-br from-azul-ordem to-azul-ordem-light";
      case "pink":
        return "bg-gradient-to-br from-rose-500 to-pink-600";
      default:
        return "bg-gradient-to-br from-verde to-verde-dark";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Avatar & Greeting */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden mb-4 shadow-lg bg-muted">
              <span className="text-[126px] leading-none">🇧🇷</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-1">
              Olá Brasileiro
            </h1>
            <p className="text-lg text-foreground/80 font-medium mb-3">
              Antes de acreditar, verifique!
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-muted text-muted-foreground">
              <span>🇧🇷</span>
              <span>Brasil</span>
            </div>
          </div>

          {/* Search */}
          <div className="mb-8">
            <SearchBar />
          </div>

          {/* Main Menu */}
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              MENU PRINCIPAL
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.href)}
                  className="flex flex-col items-center justify-center gap-3 p-5 cursor-pointer bg-card border border-border rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md ${getIconBgClass(item.variant)}`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-card-foreground text-center leading-tight">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Questions */}
          <div className="bg-card rounded-2xl shadow-card p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-bold text-card-foreground text-lg">
                  Consulta Rápida
                </h2>
                <p className="text-sm text-muted-foreground">Dúvidas Frequentes</p>
              </div>
              <button 
                onClick={() => navigate("/perguntar")}
                className="w-10 h-10 rounded-full bg-verde flex items-center justify-center hover:bg-verde-light transition-all hover:scale-105"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="space-y-3">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() =>
                    navigate(`/perguntar?q=${encodeURIComponent(question)}`)
                  }
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-muted/50 border border-border hover:bg-muted hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-verde flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-card-foreground">{question}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>

          {/* News Section */}
          <NewsSection />
        </div>
      </div>
    </Layout>
  );
};

export default Index;

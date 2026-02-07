import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { SearchBar } from "@/components/SearchBar";
import {
  User,
  Home,
  Star,
  Scale,
  ChevronLeft,
  Menu,
  MessageSquare,
  FileText,
  BookOpen,
  Mic,
  Clock,
  MoreHorizontal,
  ChevronRight,
  Search,
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
      variant: "default" as const,
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
      variant: "default" as const,
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
      default:
        return "menu-icon";
    }
  };

  return (
    <Layout hideHeader hideFooter>
      <div className="min-h-screen bg-starry pb-24">
        {/* Header */}
        <div className="relative z-10 px-5 pt-4">
          <div className="flex items-center justify-between mb-6">
            <button className="p-2 text-white/70 hover:text-white transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="p-2 text-white/70 hover:text-white transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Avatar & Greeting */}
          <div className="flex flex-col items-center mb-6">
            <div className="avatar-ring mb-3">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-white mb-1">
              Olá Brasileiro
            </h1>
            <div className="badge-flag">
              <span className="text-base">🇧🇷</span>
              <span className="text-white/80">Brasil</span>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <SearchBar />
          </div>

          {/* Main Menu */}
          <div className="mb-6">
            <p className="section-label">MENU PRINCIPAL</p>
            <div className="grid grid-cols-3 gap-3">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.href)}
                  className="menu-card"
                >
                  <div className={getIconClass(item.variant)}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-white/90 text-center">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* White Card Section */}
        <div className="relative z-10 card-white min-h-[280px] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-gray-800">Consulta Rápida</h2>
              <p className="text-sm text-gray-500">Dúvidas Frequentes</p>
            </div>
            <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/90 transition-colors">
              <ChevronRight className="w-5 h-5 text-secondary-foreground" />
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
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <Search className="w-4 h-4 text-green-700" />
                  </div>
                  <span className="font-medium text-gray-700">{question}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="nav-bottom">
          <button className="nav-item active">
            <Home className="w-6 h-6" />
          </button>
          <button 
            onClick={() => navigate("/historico")}
            className="nav-item"
          >
            <Star className="w-6 h-6" />
          </button>
          <button 
            onClick={() => navigate("/biblioteca")}
            className="nav-item"
          >
            <Scale className="w-6 h-6" />
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

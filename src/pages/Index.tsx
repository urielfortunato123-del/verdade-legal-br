import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { SearchBar } from "@/components/SearchBar";
import { HeadlinesTicker } from "@/components/HeadlinesTicker";
import { LiveVisitorCounter } from "@/components/LiveVisitorCounter";
import { NewspaperNews } from "@/components/NewspaperNews";
import { DonationModal, useDonationModal } from "@/components/DonationModal";
import { AnimatedCard } from "@/components/AnimatedCard";
import {
  MessageSquare,
  FileText,
  BookOpen,
  Search,
  ChevronRight,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { open: donationOpen, setOpen: setDonationOpen } = useDonationModal();

  const menuItems = [
    { icon: Search, label: "Fact Check", href: "/fact-check", variant: "pink" as const },
    { icon: MessageSquare, label: "Perguntar", href: "/perguntar", variant: "green" as const },
    { icon: FileText, label: "Checar Imagem", href: "/checar-imagem", variant: "blue" as const },
    { icon: BookOpen, label: "Biblioteca", href: "/biblioteca", variant: "green" as const },
  ];

  const quickQuestions = [
    "Isso é crime?",
    "Estou no meu direito?",
    "Posso ser multado?",
  ];

  const getIconBgClass = (variant: string) => {
    switch (variant) {
      case "yellow": return "bg-gradient-to-br from-amarelo-ouro to-amarelo-ouro-dark";
      case "blue": return "bg-gradient-to-br from-azul-ordem to-azul-ordem-light";
      case "pink": return "bg-gradient-to-br from-rose-500 to-pink-600";
      default: return "bg-gradient-to-br from-verde to-verde-dark";
    }
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Layout>
      <HeadlinesTicker />
      <DonationModal open={donationOpen} onOpenChange={setDonationOpen} />

      {/* Newspaper Masthead */}
      <div className="border-b-2 border-foreground/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground capitalize">{dateStr}</p>
            <LiveVisitorCounter />
          </div>
          <div className="text-center py-4">
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-black text-foreground tracking-tight leading-none">
              Verdade na Lei
            </h1>
            <div className="flex items-center justify-center gap-4 mt-2">
              <div className="h-px flex-1 max-w-24 bg-foreground/30" />
              <p className="text-sm md:text-base font-body text-muted-foreground italic">
                Antes de acreditar, verifique
              </p>
              <div className="h-px flex-1 max-w-24 bg-foreground/30" />
            </div>
          </div>
          <div className="border-t border-foreground/10 pt-3">
            <p className="text-xs text-center text-muted-foreground uppercase tracking-[0.3em] font-medium">
              🇧🇷 O jornal digital do cidadão brasileiro
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Search */}
          <div className="mb-6">
            <SearchBar />
          </div>

          {/* Tools Strip - horizontal newspaper-style section */}
          <div className="border-y border-foreground/10 py-4 mb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground mb-3 font-sans">
              Ferramentas de Verificação
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {menuItems.map((item, i) => (
                <AnimatedCard key={item.label} index={i}>
                  <button
                    onClick={() => navigate(item.href)}
                    className="flex flex-col items-center justify-center gap-2 p-3 w-full cursor-pointer bg-card border border-border rounded-lg hover:shadow-md hover:border-primary/30 transition-all duration-200"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${getIconBgClass(item.variant)}`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[11px] font-medium text-card-foreground text-center leading-tight font-sans">
                      {item.label}
                    </span>
                  </button>
                </AnimatedCard>
              ))}
            </div>
          </div>

          {/* Main Content: Newspaper Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Column - News */}
            <div className="lg:col-span-2">
              <NewspaperNews />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Questions - Editorial sidebar */}
              <div className="border border-border rounded-lg p-5 bg-card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-serif font-bold text-foreground text-xl">
                      Consulta Rápida
                    </h2>
                    <p className="text-xs text-muted-foreground font-body italic">Dúvidas frequentes dos leitores</p>
                  </div>
                  <button
                    onClick={() => navigate("/perguntar")}
                    className="w-8 h-8 rounded-full bg-verde flex items-center justify-center hover:bg-verde-light transition-all hover:scale-105"
                  >
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>

                <div className="space-y-2">
                  {quickQuestions.map((question, i) => (
                    <motion.button
                      key={question}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.35 }}
                      whileHover={{ x: 4 }}
                      onClick={() => navigate(`/perguntar?q=${encodeURIComponent(question)}`)}
                      className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg bg-muted/50 border border-border hover:bg-muted hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-verde flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-sm text-card-foreground">{question}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Editorial Note */}
              <div className="border border-border rounded-lg p-5 bg-card">
                <h3 className="font-serif font-bold text-foreground text-lg mb-2">
                  Nota Editorial
                </h3>
                <p className="text-sm font-body text-muted-foreground leading-relaxed">
                  O <strong>Verdade na Lei</strong> é um jornal digital independente que utiliza inteligência artificial
                  para verificar fatos e informar o cidadão brasileiro com base na legislação vigente.
                </p>
                <p className="text-sm font-body text-muted-foreground leading-relaxed mt-2">
                  Nosso compromisso é com a verdade, a transparência e o acesso à informação de qualidade.
                </p>
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-sans">
                    Fontes: +25 veículos de imprensa
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

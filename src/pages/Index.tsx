import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { SearchBar } from "@/components/SearchBar";
import { HeadlinesTicker } from "@/components/HeadlinesTicker";
import { LiveVisitorCounter } from "@/components/LiveVisitorCounter";
import { NewspaperNews } from "@/components/NewspaperNews";
import { DonationModal, useDonationModal } from "@/components/DonationModal";
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
    { icon: Search, label: "Fact Check", href: "/fact-check" },
    { icon: MessageSquare, label: "Perguntar", href: "/perguntar" },
    
    { icon: BookOpen, label: "Biblioteca", href: "/biblioteca" },
  ];

  const quickQuestions = [
    "Isso é crime?",
    "Estou no meu direito?",
    "Posso ser multado?",
  ];

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

      {/* Masthead — NYT style */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground font-sans">
            <p className="capitalize">{dateStr}</p>
            <LiveVisitorCounter />
          </div>
        </div>
      </div>

      {/* Main Title */}
      <div className="border-b-2 border-foreground">
        <div className="container mx-auto px-4 py-6 text-center">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-black text-foreground tracking-tight leading-none">
            Verdade na Lei
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-2 font-body italic">
            Antes de acreditar, verifique
          </p>
        </div>
      </div>

      {/* Category nav strip */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-0 overflow-x-auto py-0">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.href)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap border-r border-border last:border-r-0 first:border-l border-l-0 font-sans"
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Search */}
          <div className="mb-6">
            <SearchBar />
          </div>

          {/* Main Content: NYT Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Main Column — News */}
            <div className="lg:col-span-8 lg:pr-6 lg:border-r border-border">
              <NewspaperNews />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 lg:pl-6 mt-6 lg:mt-0 space-y-6">
              {/* Quick Questions */}
              <div className="p-5 rounded-lg border border-border dark:glass-card-dark dark:border-0 dark:glow-green">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-serif font-bold text-foreground text-lg">
                    Consulta Rápida
                  </h2>
                  <button
                    onClick={() => navigate("/perguntar")}
                    className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors font-sans"
                  >
                    Ver mais →
                  </button>
                </div>

                <div className="space-y-0 divide-y divide-border dark:divide-border/50">
                  {quickQuestions.map((question, i) => (
                    <motion.button
                      key={question}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.08, duration: 0.3 }}
                      onClick={() => navigate(`/perguntar?q=${encodeURIComponent(question)}`)}
                      className="flex items-center justify-between w-full py-3 group"
                    >
                      <div className="flex items-center gap-2.5">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <span className="text-sm text-foreground group-hover:underline">{question}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Editorial Note */}
              <div className="p-5 rounded-lg border border-border dark:glass-card-dark dark:border-0">
                <h3 className="font-serif font-bold text-foreground text-base mb-2">
                  Nota Editorial
                </h3>
                <p className="text-sm font-body text-muted-foreground leading-relaxed">
                  O <strong className="text-foreground">Verdade na Lei</strong> é um jornal digital independente que utiliza inteligência artificial
                  para verificar fatos e informar o cidadão brasileiro com base na legislação vigente.
                </p>
                <p className="text-sm font-body text-muted-foreground leading-relaxed mt-2">
                  Nosso compromisso é com a verdade, a transparência e o acesso à informação de qualidade.
                </p>
                <div className="mt-3 pt-3 border-t border-border dark:border-border/50">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-sans">
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

import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VerdictBadge, VerdictType } from "@/components/ui/VerdictBadge";
import {
  Search,
  MessageSquare,
  Image,
  Mic,
  Calendar,
  FileText,
  Star,
  StarOff,
  Trash2,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HistoryItem {
  id: string;
  type: "question" | "image" | "audio";
  title: string;
  preview: string;
  verdict?: VerdictType;
  date: Date;
  isFavorite: boolean;
}

const mockHistory: HistoryItem[] = [
  {
    id: "1",
    type: "question",
    title: "Prazo para troca de produto com defeito",
    preview: "Qual o prazo para troca de produto com defeito segundo o CDC?",
    date: new Date(2024, 0, 15, 14, 30),
    isFavorite: true,
  },
  {
    id: "2",
    type: "image",
    title: "Matéria sobre 14º salário",
    preview: "Governo anuncia que aposentados terão direito a 14º salário...",
    verdict: "false",
    date: new Date(2024, 0, 14, 10, 15),
    isFavorite: false,
  },
  {
    id: "3",
    type: "audio",
    title: "Gravação sobre FGTS",
    preview: "O governo anunciou que vai liberar o FGTS para todos...",
    verdict: "misleading",
    date: new Date(2024, 0, 13, 16, 45),
    isFavorite: true,
  },
  {
    id: "4",
    type: "question",
    title: "Direitos na demissão sem justa causa",
    preview: "Quais são meus direitos se for demitido sem justa causa?",
    date: new Date(2024, 0, 12, 9, 0),
    isFavorite: false,
  },
  {
    id: "5",
    type: "image",
    title: "Print sobre novo benefício",
    preview: "Cidadãos podem receber até R$ 5.000 do governo...",
    verdict: "unverifiable",
    date: new Date(2024, 0, 10, 11, 20),
    isFavorite: false,
  },
];

const typeIcons = {
  question: MessageSquare,
  image: Image,
  audio: Mic,
};

const typeLabels = {
  question: "Pergunta",
  image: "Imagem",
  audio: "Áudio",
};

const typeEmojis = {
  question: "📘",
  image: "📸",
  audio: "🎙️",
};

const Historico = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [history, setHistory] = useState(mockHistory);

  const toggleFavorite = (id: string) => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredHistory = history.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-4xl mb-4 block">🗂️</span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Histórico
            </h1>
            <p className="text-foreground/80">
              Suas consultas e relatórios salvos.
            </p>
          </div>

          {/* Search */}
          <div className="bg-card rounded-2xl shadow-card p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar no histórico..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl text-base"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            <Button className="shrink-0 rounded-xl bg-verde text-primary-foreground">
              Todos
            </Button>
            <Button variant="outline" className="shrink-0 gap-2 rounded-xl">
              <Star className="w-4 h-4" />
              Favoritos
            </Button>
            <Button variant="outline" className="shrink-0 gap-2 rounded-xl">
              📘 Perguntas
            </Button>
            <Button variant="outline" className="shrink-0 gap-2 rounded-xl">
              📸 Imagens
            </Button>
            <Button variant="outline" className="shrink-0 gap-2 rounded-xl">
              🎙️ Áudios
            </Button>
          </div>

          {/* History List */}
          <div className="space-y-4">
            {filteredHistory.map((item) => {
              const Icon = typeIcons[item.type];
              return (
                <div
                  key={item.id}
                  className={cn(
                    "bg-card rounded-2xl shadow-card p-5",
                    "transition-all duration-200 hover:shadow-elevated",
                    "border-2 border-transparent hover:border-verde-brasil/30"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-azul-ordem flex items-center justify-center shrink-0 shadow-md">
                      <span className="text-xl">{typeEmojis[item.type]}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-muted-foreground uppercase">
                              {typeLabels[item.type]}
                            </span>
                            {item.verdict && (
                              <VerdictBadge verdict={item.verdict} size="sm" showEmoji />
                            )}
                          </div>
                          <h3 className="font-semibold text-card-foreground truncate">
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                            {item.preview}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl"
                            onClick={() => toggleFavorite(item.id)}
                          >
                            {item.isFavorite ? (
                              <Star className="w-5 h-5 text-amarelo-progresso fill-amarelo-progresso" />
                            ) : (
                              <StarOff className="w-5 h-5 text-muted-foreground" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                            <Download className="w-5 h-5 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl"
                            onClick={() => deleteItem(item.id)}
                          >
                            <Trash2 className="w-5 h-5 text-muted-foreground hover:text-vermelho-alerta" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(item.date)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredHistory.length === 0 && (
              <div className="text-center py-16">
                <FileText className="w-16 h-16 mx-auto mb-4 text-foreground/30" />
                <p className="text-foreground/60 text-lg">
                  Nenhum item encontrado.
                </p>
              </div>
            )}
          </div>

          {/* Export All */}
          {history.length > 0 && (
            <div className="mt-8 text-center">
              <Button className="gap-2 bg-verde hover:bg-verde-brasil-light text-primary-foreground rounded-xl px-8 h-12 font-semibold">
                <Download className="w-5 h-5" />
                Exportar todo o histórico (PDF)
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Historico;

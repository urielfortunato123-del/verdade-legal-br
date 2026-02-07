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

// Mock data
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
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Histórico
            </h1>
            <p className="text-muted-foreground">
              Suas consultas anteriores e relatórios salvos.
            </p>
          </div>

          {/* Search */}
          <div className="bg-card rounded-xl border border-border shadow-card p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar no histórico..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            <Button variant="secondary" size="sm" className="shrink-0">
              Todos
            </Button>
            <Button variant="ghost" size="sm" className="shrink-0 gap-1">
              <Star className="w-3 h-3" />
              Favoritos
            </Button>
            <Button variant="ghost" size="sm" className="shrink-0 gap-1">
              <MessageSquare className="w-3 h-3" />
              Perguntas
            </Button>
            <Button variant="ghost" size="sm" className="shrink-0 gap-1">
              <Image className="w-3 h-3" />
              Imagens
            </Button>
            <Button variant="ghost" size="sm" className="shrink-0 gap-1">
              <Mic className="w-3 h-3" />
              Áudios
            </Button>
          </div>

          {/* History List */}
          <div className="space-y-3">
            {filteredHistory.map((item) => {
              const Icon = typeIcons[item.type];
              return (
                <div
                  key={item.id}
                  className={cn(
                    "bg-card rounded-xl border border-border shadow-card p-4",
                    "transition-all duration-200 hover:shadow-elevated"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                        "bg-secondary"
                      )}
                    >
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-muted-foreground uppercase">
                              {typeLabels[item.type]}
                            </span>
                            {item.verdict && (
                              <VerdictBadge verdict={item.verdict} size="sm" />
                            )}
                          </div>
                          <h3 className="font-medium text-foreground truncate">
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
                            className="h-8 w-8"
                            onClick={() => toggleFavorite(item.id)}
                          >
                            {item.isFavorite ? (
                              <Star className="w-4 h-4 text-accent fill-accent" />
                            ) : (
                              <StarOff className="w-4 h-4 text-muted-foreground" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="w-4 h-4 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => deleteItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.date)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredHistory.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">
                  Nenhum item encontrado no histórico.
                </p>
              </div>
            )}
          </div>

          {/* Export All */}
          {history.length > 0 && (
            <div className="mt-8 text-center">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
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

import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  BookOpen,
  ExternalLink,
  ChevronRight,
  Scale,
  FileText,
  ScrollText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const lawTypes = [
  { value: "all", label: "Todas as normas" },
  { value: "constituicao", label: "Constituição" },
  { value: "codigo", label: "Códigos" },
  { value: "lei", label: "Leis Ordinárias" },
  { value: "lei_complementar", label: "Leis Complementares" },
  { value: "decreto", label: "Decretos" },
  { value: "estatuto", label: "Estatutos" },
];

const mockLaws = [
  {
    id: 1,
    type: "constituicao",
    icon: Scale,
    title: "Constituição Federal de 1988",
    number: "",
    year: 1988,
    summary: "Lei fundamental e suprema do Brasil, que organiza o Estado e define direitos e garantias fundamentais.",
    status: "vigente",
    url: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
  },
  {
    id: 2,
    type: "codigo",
    icon: BookOpen,
    title: "Código Penal",
    number: "Decreto-Lei 2.848",
    year: 1940,
    summary: "Define os crimes e as penas aplicáveis no Brasil.",
    status: "vigente",
    url: "https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848.htm",
  },
  {
    id: 3,
    type: "codigo",
    icon: BookOpen,
    title: "Código Civil",
    number: "Lei 10.406",
    year: 2002,
    summary: "Regula os direitos e obrigações de ordem privada concernente às pessoas, bens e suas relações.",
    status: "vigente",
    url: "https://www.planalto.gov.br/ccivil_03/leis/2002/l10406.htm",
  },
  {
    id: 4,
    type: "codigo",
    icon: BookOpen,
    title: "Código de Defesa do Consumidor",
    number: "Lei 8.078",
    year: 1990,
    summary: "Estabelece normas de proteção e defesa do consumidor.",
    status: "vigente",
    url: "https://www.planalto.gov.br/ccivil_03/leis/l8078.htm",
  },
  {
    id: 5,
    type: "codigo",
    icon: BookOpen,
    title: "Código de Trânsito Brasileiro",
    number: "Lei 9.503",
    year: 1997,
    summary: "Institui o Código de Trânsito Brasileiro.",
    status: "vigente",
    url: "https://www.planalto.gov.br/ccivil_03/leis/l9503.htm",
  },
  {
    id: 6,
    type: "estatuto",
    icon: ScrollText,
    title: "Estatuto da Criança e do Adolescente",
    number: "Lei 8.069",
    year: 1990,
    summary: "Dispõe sobre o Estatuto da Criança e do Adolescente.",
    status: "vigente",
    url: "https://www.planalto.gov.br/ccivil_03/leis/l8069.htm",
  },
  {
    id: 7,
    type: "lei",
    icon: FileText,
    title: "Lei Maria da Penha",
    number: "Lei 11.340",
    year: 2006,
    summary: "Cria mecanismos para coibir a violência doméstica e familiar contra a mulher.",
    status: "vigente",
    url: "https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2006/lei/l11340.htm",
  },
  {
    id: 8,
    type: "estatuto",
    icon: ScrollText,
    title: "Estatuto do Idoso",
    number: "Lei 10.741",
    year: 2003,
    summary: "Dispõe sobre o Estatuto do Idoso.",
    status: "vigente",
    url: "https://www.planalto.gov.br/ccivil_03/leis/2003/l10.741.htm",
  },
];

const Biblioteca = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const filteredLaws = mockLaws.filter((law) => {
    const matchesSearch =
      law.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      law.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      law.number.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === "all" || law.type === selectedType;

    return matchesSearch && matchesType;
  });

  const statusColors = {
    vigente: "text-verde-brasil bg-verde-brasil/10 border-verde-brasil/30",
    revogada: "text-vermelho-alerta bg-vermelho-alerta/10 border-vermelho-alerta/30",
    parcial: "text-amarelo-progresso bg-amarelo-progresso/10 border-amarelo-progresso/30",
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-4xl mb-4 block">⚖️</span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Biblioteca de Leis
            </h1>
            <p className="text-foreground/80">
              Constituição, códigos e leis. Pesquisa completa.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-card rounded-2xl shadow-card p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar por assunto, lei nº, artigo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-xl text-base"
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="md:w-[220px] h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {lawTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {filteredLaws.map((law) => {
              const Icon = law.icon;
              return (
                <a
                  key={law.id}
                  href={law.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "block bg-card rounded-2xl shadow-card p-6",
                    "transition-all duration-200 hover:shadow-elevated",
                    "border-2 border-transparent hover:border-verde-brasil/30",
                    "group"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-azul-ordem flex items-center justify-center shrink-0 shadow-md">
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-display font-bold text-lg text-card-foreground group-hover:text-verde-brasil transition-colors">
                            {law.title}
                          </h3>
                          {law.number && (
                            <p className="text-sm text-muted-foreground">
                              {law.number}/{law.year}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span
                            className={cn(
                              "px-3 py-1 rounded-full text-xs font-semibold capitalize border",
                              statusColors[law.status as keyof typeof statusColors]
                            )}
                          >
                            {law.status}
                          </span>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-verde-brasil group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>

                      <p className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {law.summary}
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}

            {filteredLaws.length === 0 && (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-foreground/30" />
                <p className="text-foreground/60 text-lg">
                  Nenhuma norma encontrada.
                </p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="mt-8 p-4 rounded-xl bg-card shadow-card text-center text-sm text-muted-foreground">
            <p>
              Mostrando {filteredLaws.length} de {mockLaws.length} normas •
              Última sincronização: {new Date().toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Biblioteca;

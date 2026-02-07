import { Layout } from "@/components/Layout";
import { ActionCard } from "@/components/ActionCard";
import { VerdictBadge } from "@/components/ui/VerdictBadge";
import {
  MessageSquare,
  Image,
  Mic,
  BookOpen,
  History,
  Shield,
  Search,
  FileCheck,
} from "lucide-react";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm mb-6 animate-fade-in">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">
                Verificação baseada em legislação oficial
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in animation-delay-100">
              Verdade na Lei BR
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed mb-8 animate-fade-in animation-delay-200">
              Verifique informações jurídicas com base na legislação brasileira oficial.
              Sem opinião política. Só fatos verificáveis e base legal.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-in animation-delay-300">
              <VerdictBadge verdict="confirmed" size="lg" />
              <VerdictBadge verdict="misleading" size="lg" />
              <VerdictBadge verdict="false" size="lg" />
              <VerdictBadge verdict="unverifiable" size="lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Actions */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-4">
              O que você quer verificar?
            </h2>
            <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
              Escolha uma opção para começar. Todas as verificações são feitas com base em
              legislação oficial e fontes públicas.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ActionCard
                icon={MessageSquare}
                title="Perguntar"
                description="Faça perguntas sobre leis e direitos. Receba respostas baseadas em legislação oficial."
                href="/perguntar"
                variant="primary"
              />

              <ActionCard
                icon={Image}
                title="Checar Imagem"
                description="Envie foto de TV ou print de matéria para verificar afirmações jurídicas."
                href="/checar-imagem"
              />

              <ActionCard
                icon={Mic}
                title="Checar Áudio"
                description="Grave ou envie áudio para transcrição e verificação de informações legais."
                href="/checar-audio"
              />

              <ActionCard
                icon={BookOpen}
                title="Biblioteca de Leis"
                description="Pesquise na base completa de legislação brasileira: Constituição, códigos e leis."
                href="/biblioteca"
              />

              <ActionCard
                icon={History}
                title="Histórico"
                description="Acesse suas consultas anteriores e relatórios salvos."
                href="/historico"
              />

              <ActionCard
                icon={FileCheck}
                title="Relatórios"
                description="Gere PDFs detalhados com análise completa e cadeia de custódia."
                href="/historico"
                variant="accent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-12 md:py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-4">
              Como funciona
            </h2>
            <p className="text-muted-foreground text-center mb-10">
              Processo transparente de verificação em 3 etapas
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  icon: Search,
                  title: "Envie sua dúvida",
                  description:
                    "Pergunte sobre uma lei, envie foto de matéria ou grave um áudio.",
                },
                {
                  step: "2",
                  icon: BookOpen,
                  title: "Análise legal",
                  description:
                    "Nosso sistema busca na base de legislação oficial e identifica artigos relevantes.",
                },
                {
                  step: "3",
                  icon: FileCheck,
                  title: "Resultado verificado",
                  description:
                    "Receba a classificação com fontes legais, links e nível de confiança.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-14 h-14 mx-auto mb-4 hero-gradient rounded-full flex items-center justify-center shadow-lg">
                    <item.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              {[
                { value: "10.000+", label: "Leis indexadas" },
                { value: "100%", label: "Fontes oficiais" },
                { value: "0%", label: "Opinião política" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-6 rounded-xl bg-card border border-border shadow-card"
                >
                  <div className="font-display text-3xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

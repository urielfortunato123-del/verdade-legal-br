import { Layout } from "@/components/Layout";
import { ActionCard } from "@/components/ActionCard";
import { VerdictBadge } from "@/components/ui/VerdictBadge";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Image,
  Mic,
  BookOpen,
  History,
  Settings,
  Search,
  MapPin,
  Shield,
} from "lucide-react";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section - Brasil Blue */}
      <section className="bg-hero py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Greeting */}
            <div className="flex items-center gap-2 mb-6 animate-fade-in">
              <span className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Olá Brasileiros
              </span>
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-sm text-foreground/80">
                <MapPin className="w-3 h-3" />
                <span>Brasil</span>
              </div>
            </div>

            {/* Tagline */}
            <div className="mb-8 animate-fade-in animation-delay-100">
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 leading-tight">
                A verdade precisa de base.
                <br />
                <span className="text-amarelo-progresso">Não de opinião.</span>
              </h1>
              <p className="text-lg text-foreground/80">
                Aqui a lei fala. Sem mentira.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8 animate-fade-in animation-delay-200">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Pergunte sobre leis, notícias ou grave um áudio"
                className="h-14 pl-12 pr-4 text-base rounded-2xl bg-card text-card-foreground border-0 shadow-lg placeholder:text-muted-foreground"
              />
            </div>

            {/* Verdict examples */}
            <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-in animation-delay-300">
              <VerdictBadge verdict="confirmed" size="lg" showEmoji />
              <VerdictBadge verdict="misleading" size="lg" showEmoji />
              <VerdictBadge verdict="false" size="lg" showEmoji />
              <VerdictBadge verdict="unverifiable" size="lg" showEmoji />
            </div>
          </div>
        </div>
      </section>

      {/* Main Actions - Cards Grid */}
      <section className="py-10 md:py-14 bg-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <ActionCard
                icon={MessageSquare}
                emoji="📘"
                title="Perguntar Lei"
                description="Tire dúvidas sobre leis por texto ou voz. Resposta com base legal."
                href="/perguntar"
                variant="primary"
              />

              <ActionCard
                icon={Image}
                emoji="📸"
                title="Checar Notícia"
                description="Foto, PDF ou Word. Analisamos e verificamos na legislação."
                href="/checar-imagem"
              />

              <ActionCard
                icon={Mic}
                emoji="🎙️"
                title="Gravar Áudio"
                description="Grave jornal, TV ou conversa. Transcrevemos e checamos."
                href="/checar-audio"
              />

              <ActionCard
                icon={BookOpen}
                emoji="⚖️"
                title="Biblioteca de Leis"
                description="Constituição, códigos e leis. Pesquisa completa."
                href="/biblioteca"
              />

              <ActionCard
                icon={History}
                emoji="🗂️"
                title="Histórico"
                description="Suas consultas e relatórios salvos."
                href="/historico"
              />

              <ActionCard
                icon={Settings}
                emoji="⚙️"
                title="Mais"
                description="Configurações, ajuda e informações."
                href="/sobre"
                variant="accent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-10 md:py-14 bg-hero border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              {[
                { value: "10.000+", label: "Leis indexadas", icon: "⚖️" },
                { value: "100%", label: "Fontes oficiais", icon: "📜" },
                { value: "0%", label: "Opinião política", icon: "🚫" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-6 rounded-2xl bg-card shadow-card"
                >
                  <span className="text-3xl mb-2 block">{stat.icon}</span>
                  <div className="font-display text-3xl font-bold text-verde-brasil mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For Who Section */}
      <section className="py-10 md:py-14 bg-hero border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
              Para quem é
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Cidadãos comuns",
                "Trabalhadores",
                "Estudantes",
                "Jornalistas",
                "Advogados",
                "Qualquer brasileiro",
              ].map((audience) => (
                <span
                  key={audience}
                  className="px-4 py-2 rounded-full bg-white/10 text-foreground text-sm font-medium"
                >
                  {audience}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-14 bg-hero border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-verde-brasil/20 text-verde-brasil-light text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              Verificação baseada em legislação oficial
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Cansou de ser enganado?
            </h2>
            <p className="text-foreground/80 mb-6">
              Use a lei a seu favor. Verifique antes de acreditar.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

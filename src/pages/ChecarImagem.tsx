import { useState, useRef } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { VerdictBadge, VerdictType } from "@/components/ui/VerdictBadge";
import {
  Upload,
  Camera,
  Loader2,
  FileText,
  ExternalLink,
  X,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Claim {
  text: string;
  verdict: VerdictType;
  explanation: string;
  sources?: { law: string; article: string; url: string }[];
}

// Mock response for demo
const mockAnalysis = {
  extractedText:
    "Governo anuncia que aposentados terão direito a 14º salário a partir de 2024. A medida está prevista na Constituição Federal.",
  overallVerdict: "false" as VerdictType,
  claims: [
    {
      text: "Aposentados terão direito a 14º salário",
      verdict: "false" as VerdictType,
      explanation:
        "Não existe previsão legal de 14º salário para aposentados no Brasil. O INSS paga 13º salário conforme Lei 8.213/91.",
      sources: [
        {
          law: "Lei 8.213/91",
          article: "Art. 40",
          url: "https://www.planalto.gov.br/ccivil_03/leis/l8213.htm",
        },
      ],
    },
    {
      text: "A medida está prevista na Constituição Federal",
      verdict: "false" as VerdictType,
      explanation:
        "A Constituição Federal não prevê 14º salário. O Art. 7º, VIII garante apenas o 13º salário.",
      sources: [
        {
          law: "Constituição Federal",
          article: "Art. 7º, VIII",
          url: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
        },
      ],
    },
  ] as Claim[],
};

const ChecarImagem = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<typeof mockAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setAnalysis(mockAnalysis);
    setIsLoading(false);
  };

  const clearImage = () => {
    setImage(null);
    setAnalysis(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Checar Matéria (Imagem)
            </h1>
            <p className="text-muted-foreground">
              Envie foto de TV ou print de matéria para verificar afirmações jurídicas.
            </p>
          </div>

          {/* Upload Section */}
          {!image && (
            <div className="bg-card rounded-xl border border-border shadow-card p-8">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
              />

              <label
                htmlFor="image-upload"
                className={cn(
                  "flex flex-col items-center justify-center",
                  "min-h-[300px] rounded-xl border-2 border-dashed border-border",
                  "cursor-pointer transition-colors",
                  "hover:border-primary/50 hover:bg-secondary/30"
                )}
              >
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="font-medium text-foreground mb-1">
                  Clique para enviar ou arraste uma imagem
                </p>
                <p className="text-sm text-muted-foreground">
                  PNG, JPG ou WEBP até 10MB
                </p>

                <div className="flex gap-3 mt-6">
                  <Button variant="outline" className="gap-2" asChild>
                    <span>
                      <Upload className="w-4 h-4" />
                      Escolher arquivo
                    </span>
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Camera className="w-4 h-4" />
                    Usar câmera
                  </Button>
                </div>
              </label>
            </div>
          )}

          {/* Image Preview */}
          {image && !analysis && (
            <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
              <div className="relative">
                <img
                  src={image}
                  alt="Imagem para análise"
                  className="w-full max-h-[400px] object-contain bg-secondary/30"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-4 right-4"
                  onClick={clearImage}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="p-6">
                <Button
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="w-full gap-2"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analisando imagem...
                    </>
                  ) : (
                    <>Analisar Imagem</>
                  )}
                </Button>

                {isLoading && (
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground text-center">
                    <p>Extraindo texto (OCR)...</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-6 animate-fade-in">
              {/* Image with Verdict */}
              <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
                <div className="relative">
                  <img
                    src={image!}
                    alt="Imagem analisada"
                    className="w-full max-h-[300px] object-contain bg-secondary/30"
                  />
                  <div className="absolute top-4 left-4">
                    <VerdictBadge verdict={analysis.overallVerdict} size="lg" />
                  </div>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-4 right-4"
                    onClick={clearImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Extracted Text */}
                <div className="p-6 border-t border-border">
                  <h3 className="font-semibold text-sm mb-2 text-muted-foreground">
                    Texto extraído da imagem:
                  </h3>
                  <p className="text-foreground bg-secondary/30 p-4 rounded-lg italic">
                    "{analysis.extractedText}"
                  </p>
                </div>
              </div>

              {/* Claims Analysis */}
              <div className="bg-card rounded-xl border border-border shadow-card">
                <div className="p-6 border-b border-border">
                  <h2 className="font-display font-semibold text-lg">
                    Afirmações Identificadas
                  </h2>
                </div>

                <div className="divide-y divide-border">
                  {analysis.claims.map((claim, index) => (
                    <div key={index} className="p-6">
                      <div className="flex items-start gap-4">
                        <VerdictBadge verdict={claim.verdict} size="sm" />
                        <div className="flex-1">
                          <p className="font-medium text-foreground mb-2">
                            "{claim.text}"
                          </p>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                            {claim.explanation}
                          </p>

                          {claim.sources && claim.sources.length > 0 && (
                            <div className="space-y-2">
                              {claim.sources.map((source, sIndex) => (
                                <a
                                  key={sIndex}
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                  <FileText className="w-3 h-3" />
                                  {source.law} - {source.article}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Gerar Relatório PDF
                </Button>
                <Button variant="ghost" onClick={clearImage}>
                  Analisar outra imagem
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ChecarImagem;

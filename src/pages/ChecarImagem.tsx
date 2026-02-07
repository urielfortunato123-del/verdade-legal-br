import { useState, useRef } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/ShareButtons";
import { ContentModeToggle } from "@/components/ContentModeToggle";
import { useAnalyzeDocument, DocumentAnalysis, DocumentModeAnalysis } from "@/hooks/useAnalyzeDocument";
import { VerdictSeal, VerdictBadge } from "@/components/ui/VerdictBadge";
import { 
  Camera, 
  FileText, 
  Loader2, 
  Upload,
  CheckCircle,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

const ChecarImagem = () => {
  const [mode, setMode] = useState<"news_tv" | "document">("news_tv");
  const [fileName, setFileName] = useState("");
  const { analyze, isAnalyzing, analysis } = useAnalyzeDocument();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = (e.target?.result as string)?.split(",")[1];
        if (base64) {
          toast.info("Analisando imagem...");
          await analyze("Imagem enviada para análise. Extraindo texto...", mode);
        }
      };
      reader.readAsDataURL(file);
    } else {
      const text = `Documento: ${file.name}\nTipo: ${file.type}\n\nTexto será extraído...`;
      await analyze(text, mode);
    }
  };

  const handleCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  const clearFile = () => {
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const isNewsMode = mode === "news_tv";
  const newsAnalysis = analysis as DocumentAnalysis | null;
  const docAnalysis = analysis as DocumentModeAnalysis | null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-4xl mb-4 block">📸</span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Checar Notícia
            </h1>
            <p className="text-foreground/80">
              Envie foto ou documento para verificar a veracidade.
            </p>
          </div>

          {/* Upload Section */}
          {!analysis && (
            <div className="bg-card rounded-2xl shadow-card p-6 space-y-6">
              <ContentModeToggle mode={mode} onChange={setMode} />

              {!fileName ? (
                <div className="space-y-3">
                  {/* Camera Button */}
                  <Button
                    onClick={handleCameraCapture}
                    disabled={isAnalyzing}
                    className="w-full h-16 gap-3 bg-verde hover:bg-verde-brasil-light text-primary-foreground rounded-xl text-lg font-semibold justify-start px-6"
                  >
                    <Camera className="w-6 h-6" />
                    Tirar Foto
                  </Button>

                  {/* PDF Button */}
                  <Button
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.accept = ".pdf";
                        fileInputRef.current.click();
                      }
                    }}
                    disabled={isAnalyzing}
                    variant="outline"
                    className="w-full h-16 gap-3 rounded-xl text-lg font-semibold justify-start px-6 border-2"
                  >
                    <div className="bg-vermelho-alerta text-white text-xs px-2 py-1 rounded font-bold">
                      PDF
                    </div>
                    Enviar PDF
                  </Button>

                  {/* Word Button */}
                  <Button
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.accept = ".doc,.docx";
                        fileInputRef.current.click();
                      }
                    }}
                    disabled={isAnalyzing}
                    variant="outline"
                    className="w-full h-16 gap-3 rounded-xl text-lg font-semibold justify-start px-6 border-2"
                  >
                    <div className="bg-azul-info text-white text-xs px-2 py-1 rounded font-bold">
                      DOCX
                    </div>
                    Enviar Word
                  </Button>

                  {/* Image Upload */}
                  <Button
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.accept = "image/*";
                        fileInputRef.current.click();
                      }
                    }}
                    disabled={isAnalyzing}
                    variant="outline"
                    className="w-full h-16 gap-3 rounded-xl text-lg font-semibold justify-start px-6 border-2"
                  >
                    <Upload className="w-6 h-6" />
                    Enviar Imagem
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border">
                    <div className="w-14 h-14 rounded-full bg-verde flex items-center justify-center shadow-md">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-card-foreground">{fileName}</p>
                      <p className="text-sm text-muted-foreground">Pronto para análise</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={clearFile}>
                      Remover
                    </Button>
                  </div>
                </div>
              )}

              {/* Hidden Inputs */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileSelect}
              />

              {/* Loading State */}
              {isAnalyzing && (
                <div className="text-center py-8 space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin text-verde mx-auto" />
                  <div>
                    <p className="text-card-foreground font-semibold">Analisando conteúdo...</p>
                    <p className="text-muted-foreground text-sm">Verificando base legal</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Analysis Results */}
          {analysis && !isAnalyzing && (
            <div className="space-y-6 animate-fade-in">
              {isNewsMode && newsAnalysis?.overallVerdict && (
                <>
                  {/* Verdict Seal */}
                  <div className="bg-card rounded-2xl shadow-card p-8">
                    <VerdictSeal verdict={newsAnalysis.overallVerdict} />
                  </div>

                  {/* Summary */}
                  <div className="bg-card rounded-2xl shadow-card p-6">
                    <h2 className="font-display font-bold text-xl text-card-foreground mb-4">
                      Resumo da Análise
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {newsAnalysis.summary}
                    </p>
                  </div>

                  {/* Claims */}
                  {newsAnalysis.claims && newsAnalysis.claims.length > 0 && (
                    <div className="bg-card rounded-2xl shadow-card overflow-hidden">
                      <div className="p-6 border-b border-border">
                        <h2 className="font-display font-bold text-xl text-card-foreground flex items-center gap-2">
                          <BookOpen className="w-6 h-6 text-verde" />
                          O que a lei diz
                        </h2>
                      </div>

                      <div className="divide-y divide-border">
                        {newsAnalysis.claims.map((claim, idx) => (
                          <div key={idx} className="p-6">
                            <div className="flex items-start gap-4">
                              <VerdictBadge verdict={claim.verdict} size="md" showEmoji />
                              <div className="flex-1">
                                <p className="font-semibold text-card-foreground mb-2">
                                  "{claim.text}"
                                </p>
                                <p className="text-muted-foreground leading-relaxed mb-4">
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
                                        className="inline-flex items-center gap-2 text-sm text-verde hover:underline font-medium"
                                      >
                                        <FileText className="w-4 h-4" />
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
                  )}

                  {/* Share */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <ShareButtons 
                      verdict={newsAnalysis.overallVerdict}
                      summary={newsAnalysis.summary}
                      sources={newsAnalysis.claims?.[0]?.sources || []}
                    />
                    <Button 
                      variant="ghost" 
                      onClick={clearFile}
                      className="text-foreground/70 hover:text-foreground"
                    >
                      Analisar outro documento
                    </Button>
                  </div>
                </>
              )}

              {!isNewsMode && docAnalysis?.summary && (
                <div className="bg-card rounded-2xl shadow-card p-6 space-y-6">
                  <div>
                    <h2 className="font-display font-bold text-xl text-card-foreground mb-3">
                      Resumo do Documento
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {docAnalysis.summary}
                    </p>
                  </div>

                  {docAnalysis.keyInfo?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-card-foreground mb-3">
                        Informações Extraídas
                      </h3>
                      <div className="space-y-2">
                        {docAnalysis.keyInfo.map((info, idx) => (
                          <div 
                            key={idx} 
                            className="flex justify-between p-3 rounded-xl bg-muted/30 border border-border"
                          >
                            <span className="text-muted-foreground">{info.key}</span>
                            <span className="text-card-foreground font-medium">{info.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {docAnalysis.legalPoints?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-card-foreground mb-3">
                        Pontos Legais
                      </h3>
                      <ul className="space-y-2">
                        {docAnalysis.legalPoints.map((point, idx) => (
                          <li 
                            key={idx} 
                            className="text-muted-foreground flex gap-3 items-start"
                          >
                            <CheckCircle className="w-5 h-5 text-verde flex-shrink-0 mt-0.5" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button 
                    variant="outline" 
                    onClick={clearFile}
                    className="w-full"
                  >
                    Analisar outro documento
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ChecarImagem;

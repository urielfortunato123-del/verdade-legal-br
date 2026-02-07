import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { VerdictBadge, VerdictSeal, VerdictType } from "@/components/ui/VerdictBadge";
import { FileUploader } from "@/components/FileUploader";
import { ContentModeToggle } from "@/components/ContentModeToggle";
import { ShareButtons } from "@/components/ShareButtons";
import { useAnalyzeDocument, DocumentAnalysis, Claim } from "@/hooks/useAnalyzeDocument";
import { uploadFile, calculateFileHash } from "@/lib/supabase";
import {
  Loader2,
  FileText,
  ExternalLink,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

const ChecarImagem = () => {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"news_tv" | "document">("news_tv");
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [fileHash, setFileHash] = useState<string | null>(null);
  const { analyze, isAnalyzing, analysis } = useAnalyzeDocument();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setExtractedText(null);
  };

  const handleClear = () => {
    setFile(null);
    setExtractedText(null);
    setFileHash(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    try {
      const hash = await calculateFileHash(file);
      setFileHash(hash);

      let text = "";
      
      if (file.type.startsWith("image/")) {
        toast.info("Extraindo texto da imagem...");
        text = "Texto extraído da imagem será processado pela IA...";
      } else if (file.type === "application/pdf") {
        toast.info("Processando PDF...");
        text = "Texto extraído do PDF será processado...";
      } else {
        text = await file.text();
      }

      setExtractedText(text);
      await analyze(text, mode);
      await uploadFile(file, "documents");
      
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Erro ao processar arquivo");
    }
  };

  const isNewsMode = mode === "news_tv";
  const newsAnalysis = analysis as DocumentAnalysis | null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-4xl mb-4 block">📸</span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Checar Notícia / Documento
            </h1>
            <p className="text-foreground/80">
              Foto, PDF ou Word. Analisamos e verificamos na legislação.
            </p>
          </div>

          {/* Upload Section */}
          {!analysis && (
            <div className="bg-card rounded-2xl shadow-card p-6 space-y-6">
              <ContentModeToggle mode={mode} onChange={setMode} />

              <FileUploader
                onFileSelect={handleFileSelect}
                onClear={handleClear}
                file={file}
                isLoading={isAnalyzing}
              />

              {file && !isAnalyzing && (
                <Button
                  onClick={handleAnalyze}
                  className="w-full gap-2 bg-verde hover:bg-verde-brasil-light text-primary-foreground rounded-xl h-14 text-lg font-semibold"
                >
                  Analisar {isNewsMode ? "Matéria" : "Documento"}
                </Button>
              )}

              {isAnalyzing && (
                <div className="text-center py-8">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-verde-brasil" />
                  <p className="text-card-foreground text-lg font-medium">Analisando conteúdo...</p>
                  <p className="text-muted-foreground mt-1">
                    Extraindo texto e verificando na legislação...
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Analysis Results */}
          {analysis && isNewsMode && newsAnalysis && (
            <div className="space-y-6 animate-fade-in">
              {/* Verdict Seal */}
              <div className="bg-card rounded-2xl shadow-card p-8">
                <VerdictSeal verdict={newsAnalysis.overallVerdict} />
              </div>

              {/* What was said */}
              <div className="bg-card rounded-2xl shadow-card overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="font-display font-bold text-xl text-card-foreground flex items-center gap-2">
                    <span>📝</span> O que foi dito
                  </h2>
                </div>
                <div className="p-6">
                  <p className="text-card-foreground leading-relaxed">
                    {newsAnalysis.summary}
                  </p>
                  {extractedText && (
                    <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border">
                      <p className="text-sm text-muted-foreground italic">
                        "{extractedText}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* What the law says */}
              {newsAnalysis.claims && newsAnalysis.claims.length > 0 && (
                <div className="bg-card rounded-2xl shadow-card overflow-hidden">
                  <div className="p-6 border-b border-border">
                    <h2 className="font-display font-bold text-xl text-card-foreground flex items-center gap-2">
                      <BookOpen className="w-6 h-6 text-verde-brasil" /> O que a lei diz
                    </h2>
                  </div>

                  <div className="divide-y divide-border">
                    {newsAnalysis.claims.map((claim: Claim, index: number) => (
                      <div key={index} className="p-6">
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
                                    className="inline-flex items-center gap-2 text-sm text-verde-brasil hover:underline font-medium"
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

              {/* Custody Hash */}
              {fileHash && (
                <div className="bg-card rounded-2xl shadow-card p-4">
                  <p className="text-xs text-muted-foreground font-mono text-center">
                    🔒 SHA-256: {fileHash.substring(0, 40)}...
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <ShareButtons
                  verdict={newsAnalysis.overallVerdict}
                  summary={newsAnalysis.summary}
                  sources={newsAnalysis.claims?.flatMap((c: Claim) => c.sources || [])}
                />
                <Button 
                  variant="ghost" 
                  onClick={handleClear}
                  className="text-foreground/70 hover:text-foreground"
                >
                  Analisar outro arquivo
                </Button>
              </div>
            </div>
          )}

          {/* Quality Warning */}
          {analysis && isNewsMode && newsAnalysis?.overallVerdict === "unverifiable" && (
            <div className="mt-6 p-5 rounded-2xl bg-amarelo-progresso/10 border-2 border-amarelo-progresso/30 flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amarelo-progresso shrink-0" />
              <div>
                <p className="font-semibold text-card-foreground">
                  Verificação inconclusiva
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Não foi possível verificar todas as afirmações apenas com base na legislação.
                  Para afirmações sobre programas governamentais ou anúncios recentes,
                  consulte fontes oficiais como gov.br.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ChecarImagem;

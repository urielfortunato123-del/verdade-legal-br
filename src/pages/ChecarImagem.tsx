import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { VerdictBadge, VerdictType } from "@/components/ui/VerdictBadge";
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
      // Calculate hash for custody chain
      const hash = await calculateFileHash(file);
      setFileHash(hash);

      // For now, we'll use a simple text extraction approach
      // In production, this would use OCR services
      let text = "";
      
      if (file.type.startsWith("image/")) {
        // For images, we'll send to AI for OCR
        toast.info("Extraindo texto da imagem...");
        
        // Convert image to base64 for AI processing
        const reader = new FileReader();
        text = await new Promise((resolve) => {
          reader.onload = () => {
            // For demo, we'll use a placeholder
            // In production, this would use Vision AI for OCR
            resolve("Texto extraído da imagem será processado pela IA...");
          };
          reader.readAsDataURL(file);
        });
      } else if (file.type === "application/pdf") {
        toast.info("Processando PDF...");
        text = "Texto extraído do PDF será processado...";
      } else {
        // For DOCX, read as text
        text = await file.text();
      }

      setExtractedText(text);

      // Analyze the text
      await analyze(text, mode);

      // Upload file for storage
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
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Checar Arquivo
            </h1>
            <p className="text-muted-foreground">
              Envie foto, PDF ou Word para verificação de informações jurídicas.
            </p>
          </div>

          {/* Upload Section */}
          {!analysis && (
            <div className="bg-card rounded-xl border border-border shadow-card p-6 space-y-6">
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
                  className="w-full gap-2"
                  size="lg"
                >
                  Analisar {isNewsMode ? "Matéria" : "Documento"}
                </Button>
              )}

              {isAnalyzing && (
                <div className="text-center py-4">
                  <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-primary" />
                  <p className="text-muted-foreground">Analisando conteúdo...</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Extraindo texto e verificando na legislação...
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Analysis Results - News/TV Mode */}
          {analysis && isNewsMode && newsAnalysis && (
            <div className="space-y-6 animate-fade-in">
              {/* Overall Verdict */}
              <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-semibold text-lg mb-1">
                      Resultado da Análise
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {file?.name}
                    </p>
                  </div>
                  <VerdictBadge
                    verdict={newsAnalysis.overallVerdict}
                    size="lg"
                  />
                </div>

                {/* Summary */}
                <div className="px-6 pb-6">
                  <p className="text-foreground leading-relaxed">
                    {newsAnalysis.summary}
                  </p>
                </div>

                {/* Extracted Text */}
                {extractedText && (
                  <div className="px-6 pb-6">
                    <h3 className="font-semibold text-sm mb-2 text-muted-foreground">
                      Texto extraído:
                    </h3>
                    <p className="text-sm text-foreground bg-secondary/30 p-4 rounded-lg italic">
                      "{extractedText}"
                    </p>
                  </div>
                )}

                {/* Hash for custody */}
                {fileHash && (
                  <div className="px-6 pb-6">
                    <p className="text-xs text-muted-foreground font-mono">
                      SHA-256: {fileHash.substring(0, 32)}...
                    </p>
                  </div>
                )}
              </div>

              {/* Claims */}
              {newsAnalysis.claims && newsAnalysis.claims.length > 0 && (
                <div className="bg-card rounded-xl border border-border shadow-card">
                  <div className="p-6 border-b border-border">
                    <h2 className="font-display font-semibold text-lg">
                      Afirmações Identificadas
                    </h2>
                  </div>

                  <div className="divide-y divide-border">
                    {newsAnalysis.claims.map((claim: Claim, index: number) => (
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
              )}

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <ShareButtons
                  verdict={newsAnalysis.overallVerdict}
                  summary={newsAnalysis.summary}
                  sources={newsAnalysis.claims?.flatMap((c: Claim) => c.sources || [])}
                />
                <Button variant="ghost" onClick={handleClear}>
                  Analisar outro arquivo
                </Button>
              </div>
            </div>
          )}

          {/* Quality Warning */}
          {analysis && isNewsMode && newsAnalysis?.overallVerdict === "unverifiable" && (
            <div className="mt-4 p-4 rounded-lg bg-secondary/50 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-verdict-misleading shrink-0" />
              <div>
                <p className="font-medium text-foreground">
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

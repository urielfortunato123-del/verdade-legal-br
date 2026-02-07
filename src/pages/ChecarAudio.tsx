import { useState, useRef } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { VerdictBadge, VerdictType } from "@/components/ui/VerdictBadge";
import {
  Mic,
  Upload,
  Loader2,
  FileText,
  ExternalLink,
  Square,
  Play,
  Pause,
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
  transcript:
    "O governo anunciou que vai liberar o FGTS para todos os trabalhadores sem nenhuma restrição. Isso está garantido pela CLT.",
  overallVerdict: "misleading" as VerdictType,
  claims: [
    {
      text: "O governo vai liberar o FGTS para todos os trabalhadores",
      verdict: "misleading" as VerdictType,
      explanation:
        "Existem modalidades de saque do FGTS, mas não é liberado 'para todos sem restrição'. As condições estão previstas na Lei 8.036/90.",
      sources: [
        {
          law: "Lei 8.036/90",
          article: "Art. 20",
          url: "https://www.planalto.gov.br/ccivil_03/leis/l8036.htm",
        },
      ],
    },
    {
      text: "Isso está garantido pela CLT",
      verdict: "false" as VerdictType,
      explanation:
        "O FGTS não é regulamentado pela CLT, mas sim pela Lei 8.036/90. A CLT trata de relações trabalhistas, não do fundo de garantia.",
      sources: [
        {
          law: "CLT",
          article: "Decreto-Lei 5.452/43",
          url: "https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm",
        },
      ],
    },
  ] as Claim[],
};

const ChecarAudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<typeof mockAnalysis | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setAnalysis(null);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // In real app, would stop recording and get audio file
      setAudioFile(new File([], "gravacao.webm", { type: "audio/webm" }));
    } else {
      setIsRecording(true);
      setRecordingTime(0);
      // Simulate recording timer
      const interval = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
      setTimeout(() => {
        clearInterval(interval);
      }, 60000); // Max 1 minute
    }
  };

  const handleAnalyze = async () => {
    if (!audioFile) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setAnalysis(mockAnalysis);
    setIsLoading(false);
  };

  const clearAudio = () => {
    setAudioFile(null);
    setAnalysis(null);
    setRecordingTime(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Checar Áudio
            </h1>
            <p className="text-muted-foreground">
              Grave ou envie áudio para transcrição e verificação de informações legais.
            </p>
          </div>

          {/* Recording/Upload Section */}
          {!audioFile && !analysis && (
            <div className="bg-card rounded-xl border border-border shadow-card p-8">
              <div className="flex flex-col items-center">
                {/* Recording Button */}
                <button
                  onClick={toggleRecording}
                  className={cn(
                    "w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300",
                    "shadow-lg hover:shadow-xl",
                    isRecording
                      ? "bg-destructive animate-pulse"
                      : "hero-gradient hover:opacity-90"
                  )}
                >
                  {isRecording ? (
                    <Square className="w-10 h-10 text-destructive-foreground" />
                  ) : (
                    <Mic className="w-10 h-10 text-primary-foreground" />
                  )}
                </button>

                <p className="mt-4 font-medium text-foreground">
                  {isRecording
                    ? `Gravando... ${formatTime(recordingTime)}`
                    : "Clique para gravar"}
                </p>

                {!isRecording && (
                  <>
                    <p className="text-sm text-muted-foreground mt-2 mb-6">
                      ou
                    </p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="audio-upload"
                    />

                    <Button variant="outline" className="gap-2" asChild>
                      <label htmlFor="audio-upload" className="cursor-pointer">
                        <Upload className="w-4 h-4" />
                        Enviar arquivo de áudio
                      </label>
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Audio Ready to Analyze */}
          {audioFile && !analysis && (
            <div className="bg-card rounded-xl border border-border shadow-card p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full hero-gradient flex items-center justify-center">
                  <Mic className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{audioFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {audioFile.size > 0
                      ? `${(audioFile.size / 1024 / 1024).toFixed(2)} MB`
                      : "Gravação pronta"}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={clearAudio}>
                  Remover
                </Button>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full gap-2"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Transcrevendo e analisando...
                  </>
                ) : (
                  <>Analisar Áudio</>
                )}
              </Button>

              {isLoading && (
                <div className="mt-4 space-y-2 text-sm text-muted-foreground text-center">
                  <p>Convertendo áudio em texto...</p>
                </div>
              )}
            </div>
          )}

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-6 animate-fade-in">
              {/* Transcript with Verdict */}
              <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full hero-gradient flex items-center justify-center">
                      <Mic className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Áudio analisado</p>
                      <p className="text-sm text-muted-foreground">
                        Transcrição completa
                      </p>
                    </div>
                  </div>
                  <VerdictBadge verdict={analysis.overallVerdict} size="lg" />
                </div>

                {/* Transcript */}
                <div className="p-6">
                  <h3 className="font-semibold text-sm mb-2 text-muted-foreground">
                    Transcrição:
                  </h3>
                  <p className="text-foreground bg-secondary/30 p-4 rounded-lg italic">
                    "{analysis.transcript}"
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
                <Button variant="ghost" onClick={clearAudio}>
                  Analisar outro áudio
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ChecarAudio;

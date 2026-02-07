import { useState, useRef, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VerdictBadge, VerdictSeal } from "@/components/ui/VerdictBadge";
import { ContentModeToggle } from "@/components/ContentModeToggle";
import { ShareButtons } from "@/components/ShareButtons";
import { useAnalyzeDocument, DocumentAnalysis, Claim } from "@/hooks/useAnalyzeDocument";
import { uploadFile, getEdgeFunctionUrl } from "@/lib/supabase";
import {
  Mic,
  Upload,
  Loader2,
  FileText,
  ExternalLink,
  Square,
  BookOpen,
  Download,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ChecarAudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioTitle, setAudioTitle] = useState("");
  const [mode, setMode] = useState<"news_tv" | "document">("news_tv");
  const [transcript, setTranscript] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionStep, setTranscriptionStep] = useState<"idle" | "uploading" | "transcribing" | "analyzing">("idle");
  const [recordingTime, setRecordingTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { analyze, isAnalyzing, analysis } = useAnalyzeDocument();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setTranscript(null);
    }
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([blob], `gravacao-${Date.now()}.webm`, {
          type: "audio/webm",
        });
        setAudioFile(file);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Não foi possível acessar o microfone");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [isRecording]);

  const handleTranscribe = async () => {
    if (!audioFile) return;

    setIsTranscribing(true);
    setTranscriptionStep("uploading");
    
    try {
      await uploadFile(audioFile, "audios");
      
      setTranscriptionStep("transcribing");

      const formData = new FormData();
      formData.append("audio", audioFile);

      const response = await fetch(getEdgeFunctionUrl("transcribe-audio"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Transcription failed");
      }

      const result = await response.json();
      
      if (result.transcript) {
        setTranscript(result.transcript);
        toast.success("Áudio transcrito com sucesso!");
        
        setTranscriptionStep("analyzing");
        await analyze(result.transcript, mode);
      } else {
        throw new Error("No transcript returned");
      }
    } catch (error) {
      console.error("Transcription error:", error);
      toast.error("Erro na transcrição. Tente novamente.");
    } finally {
      setIsTranscribing(false);
      setTranscriptionStep("idle");
    }
  };

  const getStepInfo = () => {
    switch (transcriptionStep) {
      case "uploading":
        return { text: "Enviando áudio...", progress: 20 };
      case "transcribing":
        return { text: "Transcrevendo com IA...", progress: 50 };
      case "analyzing":
        return { text: "Analisando conteúdo...", progress: 80 };
      default:
        return { text: "", progress: 0 };
    }
  };

  const clearAudio = () => {
    setAudioFile(null);
    setTranscript(null);
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

  const newsAnalysis = analysis as DocumentAnalysis | null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-4xl mb-4 block">🎙️</span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Gravar Áudio
            </h1>
            <p className="text-foreground/80">
              Jornal, TV ou conversa. Transcrevemos e verificamos.
            </p>
          </div>

          {/* Recording/Upload Section */}
          {!analysis && (
            <div className="bg-card rounded-2xl shadow-card p-6 space-y-6">
              <ContentModeToggle mode={mode} onChange={setMode} />

              {!audioFile && (
                <>
                  {/* Recording Button */}
                  <div className="flex flex-col items-center py-10">
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={isTranscribing}
                      className={cn(
                        "w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300",
                        "shadow-xl hover:shadow-2xl focus:outline-none",
                        isRecording
                          ? "bg-vermelho-alerta animate-pulse"
                          : "bg-verde hover:bg-verde-brasil-light animate-pulse-brasil"
                      )}
                    >
                      {isRecording ? (
                        <Square className="w-12 h-12 text-white" />
                      ) : (
                        <Mic className="w-12 h-12 text-white" />
                      )}
                    </button>

                    <p className="mt-6 font-display font-bold text-xl text-card-foreground">
                      {isRecording
                        ? "Gravando..."
                        : "Clique para gravar"}
                    </p>
                    {isRecording && (
                      <p className="text-muted-foreground text-sm mt-1">
                        Clique novamente para parar
                      </p>
                    )}
                  </div>

                  {/* Upload Option */}
                  {!isRecording && (
                    <>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-card px-4 text-sm text-muted-foreground">
                            ou
                          </span>
                        </div>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="audio-upload"
                      />

                      <Button
                        variant="outline"
                        className="w-full gap-2 h-14 text-base rounded-xl"
                        asChild
                      >
                        <label htmlFor="audio-upload" className="cursor-pointer">
                          <Upload className="w-5 h-5" />
                          Enviar arquivo de áudio
                        </label>
                      </Button>
                    </>
                  )}
                </>
              )}

              {/* Audio Ready */}
              {audioFile && !transcript && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border">
                    <div className="w-14 h-14 rounded-full bg-verde flex items-center justify-center shadow-md">
                      <Mic className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-card-foreground">
                        {audioFile.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          const url = URL.createObjectURL(audioFile);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = audioFile.name;
                          a.click();
                          URL.revokeObjectURL(url);
                          toast.success("Áudio salvo!");
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={clearAudio}>
                        Remover
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="title" className="text-card-foreground font-semibold">
                      Título (opcional)
                    </Label>
                    <Input
                      id="title"
                      placeholder="Ex: Jornal das 7, Entrevista..."
                      value={audioTitle}
                      onChange={(e) => setAudioTitle(e.target.value)}
                      className="mt-2 rounded-xl h-12"
                    />
                  </div>

                  {isTranscribing ? (
                    <div className="space-y-4 animate-fade-in">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-verde/20 flex items-center justify-center">
                          <Loader2 className="w-5 h-5 text-verde animate-spin" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-card-foreground">
                            {getStepInfo().text}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Isso pode levar alguns segundos...
                          </p>
                        </div>
                      </div>
                      <Progress value={getStepInfo().progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span className={transcriptionStep === "uploading" ? "text-verde font-medium" : ""}>
                          📤 Upload
                        </span>
                        <span className={transcriptionStep === "transcribing" ? "text-verde font-medium" : ""}>
                          🎙️ Transcrição
                        </span>
                        <span className={transcriptionStep === "analyzing" ? "text-verde font-medium" : ""}>
                          ⚖️ Análise
                        </span>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={handleTranscribe}
                      disabled={isAnalyzing}
                      className="w-full gap-2 bg-verde hover:bg-verde-brasil-light text-primary-foreground rounded-xl h-14 text-lg font-semibold"
                    >
                      Transcrever e Analisar
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Analysis Results */}
          {analysis && newsAnalysis && (
            <div className="space-y-6 animate-fade-in">
              {/* Verdict Seal */}
              <div className="bg-card rounded-2xl shadow-card p-8">
                <VerdictSeal verdict={newsAnalysis.overallVerdict} />
              </div>

              {/* Transcript */}
              <div className="bg-card rounded-2xl shadow-card overflow-hidden">
                <div className="p-6 border-b border-border flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-verde flex items-center justify-center shadow-md">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-lg text-card-foreground">
                      {audioTitle || "Áudio analisado"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Transcrição completa
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-sm text-muted-foreground mb-3">
                    📝 Transcrição:
                  </h3>
                  <p className="text-card-foreground bg-muted/30 p-4 rounded-xl border border-border italic">
                    "{transcript}"
                  </p>
                </div>

                <div className="px-6 pb-6">
                  <p className="text-card-foreground leading-relaxed">
                    {newsAnalysis.summary}
                  </p>
                </div>
              </div>

              {/* Claims Analysis */}
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

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <ShareButtons
                  verdict={newsAnalysis.overallVerdict}
                  summary={newsAnalysis.summary}
                  sources={newsAnalysis.claims?.flatMap((c: Claim) => c.sources || [])}
                />
                <Button 
                  variant="ghost" 
                  onClick={clearAudio}
                  className="text-foreground/70 hover:text-foreground"
                >
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

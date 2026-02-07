import { useState, useRef, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VerdictBadge } from "@/components/ui/VerdictBadge";
import { ContentModeToggle } from "@/components/ContentModeToggle";
import { ShareButtons } from "@/components/ShareButtons";
import { useAnalyzeDocument, DocumentAnalysis, Claim } from "@/hooks/useAnalyzeDocument";
import { uploadFile, calculateFileHash, getEdgeFunctionUrl } from "@/lib/supabase";
import {
  Mic,
  Upload,
  Loader2,
  FileText,
  ExternalLink,
  Square,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ChecarAudio = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioTitle, setAudioTitle] = useState("");
  const [mode, setMode] = useState<"news_tv" | "document">("news_tv");
  const [transcript, setTranscript] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
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
    try {
      // Upload the audio file
      await uploadFile(audioFile, "audios");

      // Create FormData for transcription
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
        
        // Analyze the transcript
        await analyze(result.transcript, mode);
      } else {
        throw new Error("No transcript returned");
      }
    } catch (error) {
      console.error("Transcription error:", error);
      toast.error("Erro na transcrição. Tente novamente.");
    } finally {
      setIsTranscribing(false);
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
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Checar Áudio
            </h1>
            <p className="text-muted-foreground">
              Grave ou envie áudio para transcrição e verificação.
            </p>
          </div>

          {/* Recording/Upload Section */}
          {!analysis && (
            <div className="bg-card rounded-xl border border-border shadow-card p-6 space-y-6">
              <ContentModeToggle mode={mode} onChange={setMode} />

              {!audioFile && (
                <>
                  {/* Recording Button */}
                  <div className="flex flex-col items-center py-8">
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={isTranscribing}
                      className={cn(
                        "w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300",
                        "shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary/20",
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
                        className="w-full gap-2"
                        asChild
                      >
                        <label
                          htmlFor="audio-upload"
                          className="cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
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
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30">
                    <div className="w-12 h-12 rounded-full hero-gradient flex items-center justify-center">
                      <Mic className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {audioFile.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {audioFile.size > 0
                          ? `${(audioFile.size / 1024 / 1024).toFixed(2)} MB`
                          : `Duração: ${formatTime(recordingTime)}`}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={clearAudio}>
                      Remover
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="title">Título (opcional)</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Jornal das 7, Entrevista..."
                      value={audioTitle}
                      onChange={(e) => setAudioTitle(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <Button
                    onClick={handleTranscribe}
                    disabled={isTranscribing || isAnalyzing}
                    className="w-full gap-2"
                    size="lg"
                  >
                    {isTranscribing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Transcrevendo...
                      </>
                    ) : (
                      <>Transcrever e Analisar</>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Analysis Results */}
          {analysis && newsAnalysis && (
            <div className="space-y-6 animate-fade-in">
              {/* Transcript with Verdict */}
              <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full hero-gradient flex items-center justify-center">
                      <Mic className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {audioTitle || audioFile?.name || "Áudio analisado"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Transcrição completa
                      </p>
                    </div>
                  </div>
                  <VerdictBadge
                    verdict={newsAnalysis.overallVerdict}
                    size="lg"
                  />
                </div>

                {/* Transcript */}
                <div className="p-6">
                  <h3 className="font-semibold text-sm mb-2 text-muted-foreground">
                    Transcrição:
                  </h3>
                  <p className="text-foreground bg-secondary/30 p-4 rounded-lg italic">
                    "{transcript}"
                  </p>
                </div>

                {/* Summary */}
                <div className="px-6 pb-6">
                  <p className="text-foreground leading-relaxed">
                    {newsAnalysis.summary}
                  </p>
                </div>
              </div>

              {/* Claims Analysis */}
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

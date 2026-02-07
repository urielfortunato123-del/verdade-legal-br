import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ShareButtons } from "@/components/ShareButtons";
import { useAnalyzeDocument, DocumentAnalysis, DocumentModeAnalysis } from "@/hooks/useAnalyzeDocument";
import { VerdictSeal, VerdictBadge } from "@/components/ui/VerdictBadge";
import { 
  Camera, 
  FileText, 
  Loader2, 
  ChevronLeft,
  Image as ImageIcon,
  CheckCircle,
  Menu,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

const ChecarImagem = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"news_tv" | "document">("news_tv");
  const [extractedText, setExtractedText] = useState("");
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
      setExtractedText(text);
      await analyze(text, mode);
    }
  };

  const handleCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  const isNewsMode = mode === "news_tv";
  const newsAnalysis = analysis as DocumentAnalysis | null;
  const docAnalysis = analysis as DocumentModeAnalysis | null;

  return (
    <Layout hideHeader hideFooter>
      <div className="min-h-screen pb-8">
        {/* Header */}
        <div className="bg-brasil-sparkle px-4 pt-6 pb-8">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 text-white/70 hover:text-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-verde-brasil-light" />
              <span className="font-display font-bold text-white">
                VERDADE<br/><span className="text-amarelo-ouro">NA LEI</span> BR
              </span>
            </div>
            <button className="p-2 text-white/70 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-display font-bold text-white mb-1">
              CHECAR NOTÍCIA
            </h1>
            <p className="text-white/70 text-sm flex items-center justify-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Foto / PDF / Word
            </p>
          </div>
        </div>

        {/* Content Card */}
        <div className="px-4 -mt-4">
          <div className="card-light p-5">
            <p className="text-center text-gray-600 mb-5">
              <span className="font-semibold text-gray-800">Enviar</span> foto ou documento para checar a veracidade.
            </p>

            {/* Upload Buttons */}
            <div className="space-y-3 mb-6">
              <button 
                onClick={handleCameraCapture}
                className="btn-action btn-green"
                disabled={isAnalyzing}
              >
                <div className="flex items-center gap-3">
                  <Camera className="w-6 h-6" />
                  <span>TIRAR FOTO</span>
                </div>
                <Camera className="w-5 h-5 opacity-60" />
              </button>

              <button 
                onClick={() => fileInputRef.current?.click()}
                className="btn-action btn-yellow"
                disabled={isAnalyzing}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-red-500 text-white text-xs px-2 py-0.5 rounded font-bold">PDF</div>
                  <span>ENVIAR PDF</span>
                </div>
                <FileText className="w-5 h-5 opacity-60" />
              </button>

              <button 
                onClick={() => fileInputRef.current?.click()}
                className="btn-action btn-blue"
                disabled={isAnalyzing}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded font-bold">DOCX</div>
                  <span>ENVIAR WORD</span>
                </div>
                <FileText className="w-5 h-5 opacity-60" />
              </button>
            </div>

            {/* Mode Toggle */}
            <div className="mode-toggle">
              <button 
                onClick={() => setMode("news_tv")}
                className={`mode-toggle-btn ${mode === "news_tv" ? "active" : ""}`}
              >
                <span className="w-2 h-2 rounded-full bg-current"></span>
                Notícia / TV
              </button>
              <button 
                onClick={() => setMode("document")}
                className={`mode-toggle-btn ${mode === "document" ? "active" : ""}`}
              >
                <span className="w-2 h-2 rounded-full bg-current"></span>
                Documento
              </button>
            </div>

            {/* Hidden File Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,image/*"
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
              <div className="mt-6 text-center py-8">
                <Loader2 className="w-10 h-10 animate-spin text-verde-brasil mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Analisando conteúdo...</p>
                <p className="text-gray-400 text-sm">Verificando base legal</p>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Results */}
        {analysis && !isAnalyzing && (
          <div className="px-4 mt-4">
            <div className="card-light p-5">
              {isNewsMode && newsAnalysis?.overallVerdict && (
                <>
                  <div className="flex justify-center mb-6">
                    <VerdictSeal verdict={newsAnalysis.overallVerdict} />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Resumo</h4>
                      <p className="text-gray-600 text-sm">{newsAnalysis.summary}</p>
                    </div>

                    {newsAnalysis.claims?.map((claim, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-start gap-2 mb-2">
                          <VerdictBadge verdict={claim.verdict} size="sm" />
                        </div>
                        <p className="text-gray-700 text-sm mb-1">"{claim.text}"</p>
                        <p className="text-gray-500 text-xs">{claim.explanation}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <ShareButtons 
                      verdict={newsAnalysis.overallVerdict}
                      summary={newsAnalysis.summary}
                      sources={newsAnalysis.claims?.[0]?.sources || []}
                    />
                  </div>
                </>
              )}

              {!isNewsMode && docAnalysis?.summary && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Resumo do Documento</h4>
                    <p className="text-gray-600 text-sm">{docAnalysis.summary}</p>
                  </div>

                  {docAnalysis.keyInfo?.length > 0 && (
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Informações Extraídas</h4>
                      <div className="space-y-2">
                        {docAnalysis.keyInfo.map((info, idx) => (
                          <div key={idx} className="flex justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-gray-500 text-sm">{info.key}</span>
                            <span className="text-gray-800 font-medium text-sm">{info.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {docAnalysis.legalPoints?.length > 0 && (
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Pontos Legais</h4>
                      <ul className="space-y-1">
                        {docAnalysis.legalPoints.map((point, idx) => (
                          <li key={idx} className="text-gray-600 text-sm flex gap-2">
                            <CheckCircle className="w-4 h-4 text-verde-brasil flex-shrink-0 mt-0.5" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* History Preview */}
        <div className="px-4 mt-6">
          <h2 className="section-title text-white/60">HISTÓRICO</h2>
          
          <div className="space-y-3">
            {[
              { verdict: "misleading" as const, title: "Enganoso", desc: "Post afirmou que cierto...", date: "24/04/2024 12:45" },
              { verdict: "confirmed" as const, title: "Confirmado", desc: "Jornal da Noite", date: "23/04/2024 20:30" },
              { verdict: "false" as const, title: "Falso", desc: "Dano e fraude?", date: "23/04/2024 15:00" },
            ].map((item, idx) => (
              <div key={idx} className="history-item">
                <div className="flex-shrink-0">
                  <VerdictBadge verdict={item.verdict} size="sm" showIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                  <p className="text-gray-500 text-xs truncate">{item.desc}</p>
                  <p className="text-gray-400 text-xs mt-1">{item.date}</p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChecarImagem;

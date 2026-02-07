import jsPDF from "jspdf";
import type { AnalysisResult } from "@/hooks/useAnalyzeNews";

const verdictLabels: Record<string, string> = {
  confirmed: "✅ Confirmado",
  misleading: "⚠️ Enganoso",
  false: "❌ Falso",
  unverifiable: "❓ Não Verificável",
};

export function generateNewsPdf(data: AnalysisResult): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let y = 20;

  const addText = (text: string, fontSize: number, isBold = false, color: [number, number, number] = [0, 0, 0]) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, maxWidth);
    
    // Check if we need a new page
    if (y + lines.length * (fontSize * 0.4) > 280) {
      doc.addPage();
      y = 20;
    }
    
    doc.text(lines, margin, y);
    y += lines.length * (fontSize * 0.4) + 4;
  };

  const addSection = (title: string, content: string) => {
    addText(title, 12, true, [41, 98, 255]);
    addText(content, 10, false);
    y += 4;
  };

  // Header
  doc.setFillColor(41, 98, 255);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Análise de Notícia", margin, 25);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, margin, 35);
  
  y = 55;

  // News Info
  addText(data.newsData.title, 14, true);
  addText(`Fonte: ${data.newsData.source}`, 10, false, [100, 100, 100]);
  if (data.newsData.link) {
    addText(`Link: ${data.newsData.link}`, 8, false, [100, 100, 100]);
  }
  y += 8;

  // Verification Badge
  const verdict = data.analysis.verificacao;
  const verdictText = `${verdictLabels[verdict.veredicto]} (${verdict.confianca}% de confiança)`;
  addText(verdictText, 12, true, verdict.veredicto === "confirmed" ? [34, 197, 94] : 
          verdict.veredicto === "misleading" ? [234, 179, 8] : 
          verdict.veredicto === "false" ? [239, 68, 68] : [107, 114, 128]);
  addText(verdict.explicacao, 10, false);
  y += 8;

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // Sections
  addSection("RESUMO", data.analysis.resumo);
  
  if (data.analysis.contexto) {
    addSection("CONTEXTO", data.analysis.contexto);
  }

  if (data.analysis.pontosPrincipais?.length > 0) {
    addText("PONTOS PRINCIPAIS", 12, true, [41, 98, 255]);
    data.analysis.pontosPrincipais.forEach((ponto, index) => {
      addText(`${index + 1}. ${ponto}`, 10, false);
    });
    y += 4;
  }

  if (data.analysis.analiseCritica) {
    addSection("ANÁLISE CRÍTICA", data.analysis.analiseCritica);
  }

  if (data.analysis.fontesRecomendadas?.length > 0) {
    addText("FONTES RECOMENDADAS", 12, true, [41, 98, 255]);
    data.analysis.fontesRecomendadas.forEach((fonte) => {
      addText(`• ${fonte}`, 10, false);
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Página ${i} de ${pageCount} | Verificador de Notícias`,
      pageWidth / 2,
      290,
      { align: "center" }
    );
  }

  // Generate filename and download
  const fileName = `analise-${data.newsData.source.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.pdf`;
  doc.save(fileName);
}

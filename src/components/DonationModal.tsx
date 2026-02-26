import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import pixQrCode from "@/assets/pix-qrcode.jpg";

const PIX_CODE =
  "00020126330014BR.GOV.BCB.PIX01113638483487152040000530398658 02BR5901N6001C62140510SOSCIDAD4O6304DF0C";

interface DonationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DonationModal({ open, onOpenChange }: DonationModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PIX_CODE.replace(/\s/g, ""));
    setCopied(true);
    toast.success("Código PIX copiado!");
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-background/95 backdrop-blur-xl border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <span className="text-2xl">💛</span>
            Ajude o Desenvolvedor
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            Este aplicativo tem custos para se manter ativo e gratuito para todos.
            Se ele te ajuda, considere fazer uma contribuição via PIX a partir de{" "}
            <strong className="text-foreground">R$ 20,00</strong>! 🙏
          </p>

          {/* QR Code */}
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <img
                src={pixQrCode}
                alt="QR Code PIX"
                className="w-48 h-48 object-contain"
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Escaneie o QR Code acima com seu app de banco para contribuir via PIX.
          </p>

          {/* Pix Copia-e-cola */}
          <div>
            <p className="text-sm font-semibold text-center mb-2">
              Pix Copia-e-cola:
            </p>
            <div
              className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border cursor-pointer hover:bg-muted transition-colors"
              onClick={handleCopy}
            >
              <code className="text-xs text-foreground/80 break-all flex-1 leading-relaxed">
                {PIX_CODE.replace(/\s/g, "")}
              </code>
              <Button variant="ghost" size="icon" className="shrink-0" onClick={handleCopy}>
                {copied ? (
                  <Check className="w-4 h-4 text-verde" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Hook to show donation modal on first visit (once per session) */
export function useDonationModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem("donation_shown");
    if (!shown) {
      const timer = setTimeout(() => {
        setOpen(true);
        sessionStorage.setItem("donation_shown", "1");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  return { open, setOpen };
}

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Camera, FileText, Image, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  accept?: string;
  maxSize?: number; // in MB
  onFileSelect: (file: File) => void;
  onClear?: () => void;
  file?: File | null;
  isLoading?: boolean;
  showCamera?: boolean;
}

const fileTypeIcons: Record<string, typeof FileText> = {
  "application/pdf": FileText,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": FileText,
  "image/jpeg": Image,
  "image/png": Image,
  "image/webp": Image,
};

export function FileUploader({
  accept = "image/*,application/pdf,.docx",
  maxSize = 20,
  onFileSelect,
  onClear,
  file,
  isLoading = false,
  showCamera = true,
}: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = useCallback(
    (selectedFile: File) => {
      setError(null);

      // Check file size
      if (selectedFile.size > maxSize * 1024 * 1024) {
        setError(`Arquivo muito grande. Máximo: ${maxSize}MB`);
        return;
      }

      onFileSelect(selectedFile);
    },
    [maxSize, onFileSelect]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        validateAndSetFile(e.dataTransfer.files[0]);
      }
    },
    [validateAndSetFile]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    setError(null);
    onClear?.();
  };

  const getFileIcon = () => {
    if (!file) return FileText;
    return fileTypeIcons[file.type] || FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  if (file) {
    const Icon = getFileIcon();
    return (
      <div className="bg-card rounded-xl border border-border shadow-card p-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg hero-gradient flex items-center justify-center shrink-0">
            <Icon className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatFileSize(file.size)}
            </p>
          </div>
          {!isLoading && (
            <Button variant="ghost" size="icon" onClick={handleClear}>
              <X className="w-4 h-4" />
            </Button>
          )}
          {isLoading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />

      {showCamera && (
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
          id="camera-capture"
        />
      )}

      <label
        htmlFor="file-upload"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center",
          "min-h-[200px] rounded-xl border-2 border-dashed",
          "cursor-pointer transition-all duration-200",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-secondary/30"
        )}
      >
        <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-4">
          <Upload className="w-7 h-7 text-muted-foreground" />
        </div>
        <p className="font-medium text-foreground mb-1">
          Clique ou arraste um arquivo
        </p>
        <p className="text-sm text-muted-foreground">
          PDF, Word ou imagem até {maxSize}MB
        </p>
      </label>

      {showCamera && (
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4" />
            Escolher arquivo
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera className="w-4 h-4" />
            Usar câmera
          </Button>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}
    </div>
  );
}

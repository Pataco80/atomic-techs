"use client";

import { Button } from "@/components/ui/button";
import { uploadImageAction } from "@/features/images/upload-image.action";
import { useFileUpload } from "@/hooks/use-file-upload";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { ImageIcon, Loader2, XIcon } from "lucide-react";
import { toast } from "sonner";

type ImageUploadFieldProps = {
  value?: string | null;
  onChange: (url: string | null) => void;
  className?: string;
};

/**
 * Controlled rectangular image field: drag/drop or click to upload to Vercel
 * Blob via {@link uploadImageAction}, then reports the resulting URL through
 * `onChange`. Mirrors the avatar uploader UX but for a 16:9 preview.
 */
export function ImageUploadField({
  value,
  onChange,
  className,
}: ImageUploadFieldProps) {
  const upload = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.set("files", file);
      return resolveActionResult(uploadImageAction({ formData }));
    },
    onSuccess: (url) => {
      onChange(url);
      toast.success("Image téléversée");
    },
    onError: (error) => toast.error(error.message),
  });

  const [
    { isDragging },
    {
      openFileDialog,
      getInputProps,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
    },
  ] = useFileUpload({
    accept: "image/*",
    maxSize: 2 * 1024 * 1024,
    onFilesAdded(addedFiles) {
      const firstFile = addedFiles[0];
      if (firstFile.file instanceof File) {
        upload.mutate(firstFile.file);
      }
    },
  });

  return (
    <div className={cn("relative inline-flex w-full max-w-sm", className)}>
      <button
        type="button"
        className="border-ios-separator hover:bg-ios-separator/30 data-[dragging=true]:bg-ios-separator/30 focus-visible:ring-primary relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-dashed transition-colors outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-60 has-[img]:border-solid"
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        disabled={upload.isPending}
        aria-label={value ? "Changer l'image" : "Téléverser une image"}
      >
        {upload.isPending ? (
          <Loader2 className="size-5 animate-spin opacity-60" />
        ) : value ? (
          <img src={value} alt="Aperçu" className="size-full object-cover" />
        ) : (
          <div
            className="text-muted-foreground flex flex-col items-center gap-1 text-xs"
            aria-hidden="true"
          >
            <ImageIcon className="size-5 opacity-60" />
            <span>Glisser ou cliquer</span>
          </div>
        )}
      </button>
      {value && !upload.isPending && (
        <Button
          type="button"
          onClick={() => onChange(null)}
          size="icon"
          className="border-background focus-visible:border-background absolute -top-1 -right-1 size-6 rounded-full border-2 shadow-none"
          aria-label="Retirer l'image"
        >
          <XIcon className="size-3.5" />
        </Button>
      )}
      <input
        {...getInputProps()}
        className="sr-only"
        tabIndex={-1}
        aria-label="Fichier image"
      />
    </div>
  );
}

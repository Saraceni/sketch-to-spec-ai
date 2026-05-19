"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { Dictionary, Locale } from "@/lib/dictionaries";
import type { SpecResult } from "@/lib/spec";

interface Props {
  file: File;
  dict: Dictionary;
  locale: Locale;
  onSpecGenerated: (result: SpecResult) => void;
  onBack: () => void;
}

const Details = ({ file, dict, locale, onSpecGenerated, onBack }: Props) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [details, setDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("description", details);
      formData.append("locale", locale);

      const response = await fetch("/api/generate-spec", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Generation failed");
      }

      onSpecGenerated(data);
    } catch (err) {
      toast.error("Generation failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-1 w-full flex-col items-center py-16 px-6 bg-white dark:bg-black gap-6">
      <div className="w-full max-w-sm">
        <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
      </div>
      {previewUrl && (
        <div className="w-full max-w-sm rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
          <img
            src={previewUrl}
            alt="Selected sketch"
            className="w-full h-72 object-contain"
          />
        </div>
      )}
      <div className="w-full max-w-sm flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {dict.details.fabricLabel}
        </label>
        <Textarea
          placeholder={dict.details.fabricPlaceholder}
          rows={5}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <Button
        size="lg"
        disabled={details.trim().length === 0 || isLoading}
        className="w-full max-w-sm"
        onClick={handleGenerate}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <Sparkles />
        )}
        {dict.details.generateButton}
      </Button>
    </main>
  );
};

export default Details;

"use client";

import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { toast } from "sonner";
import type { Dictionary } from "@/lib/dictionaries";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface Props {
  onUploadFile: (file: File) => void;
  dict: Dictionary;
}

const sketchExamples = [
  { id: 1, src: "/sketches/dress1.jpeg", label: "Dress sketch 1" },
  { id: 2, src: "/sketches/dress2.jpeg", label: "Dress sketch 2" },
  { id: 3, src: "/sketches/skirt1.jpeg", label: "Skirt sketch" },
  { id: 4, src: "/sketches/man1.jpeg", label: "Man sketch" },
];

const Start = ({ onUploadFile, dict }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error(dict.home.imageTooLargeTitle, {
        description: dict.home.imageTooLargeDescription,
      });
      e.target.value = "";
      return;
    }

    onUploadFile(file);
  };

  return (
    <main className="flex flex-1 w-full flex-col items-center py-16 bg-white dark:bg-black">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <Image
        className="dark:invert"
        src="/dress.svg"
        alt="SketchToSpec logo"
        width={100}
        height={100}
        priority
      />
      <div className="flex flex-col items-center text-center w-full">
        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          {dict.home.title}
        </h1>
        <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400 mt-2 px-2">
          {dict.home.subtitle}
        </p>
        <h2 className="text-2xl mt-6">{dict.home.examplesHeading}</h2>
        <div className="w-full overflow-x-auto pb-2 mt-2">
          <div className="flex gap-4 px-4 w-max mx-auto">
            {sketchExamples.map((sketch) => (
              <div
                key={sketch.id}
                className="flex-none w-40 h-52 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center overflow-hidden"
              >
                <Image
                  src={sketch.src}
                  alt={sketch.label}
                  width={180}
                  height={180}
                  className="object-contain dark:invert"
                />
              </div>
            ))}
          </div>
        </div>
        <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400 mt-4 px-2">
          {dict.home.uploadPrompt}
        </p>
        <Button
          className="mt-2"
          variant="outline"
          size="lg"
          onClick={() => inputRef.current?.click()}
        >
          <UploadIcon /> {dict.home.uploadButton}
        </Button>
      </div>
    </main>
  );
};

export default Start;

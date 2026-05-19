"use client";

import { useState } from "react";
import Start from "./Start";
import Details from "./Details";
import SpecResult from "./SpecResult";
import LanguageSwitcher from "./LanguageSwitcher";
import type { Dictionary, Locale } from "@/lib/dictionaries";
import type { SpecResult as SpecResultType } from "@/lib/spec";

interface Props {
  dict: Dictionary;
  locale: Locale;
}

const HomeClient = ({ dict, locale }: Props) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [specResult, setSpecResult] = useState<SpecResultType | null>(null);

  const handleReset = () => {
    setSelectedImage(null);
    setSpecResult(null);
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="fixed top-4 right-4 z-10">
        <LanguageSwitcher locale={locale} />
      </div>
      {!selectedImage && (
        <Start onUploadFile={setSelectedImage} dict={dict} />
      )}
      {selectedImage && !specResult && (
        <Details
          file={selectedImage}
          dict={dict}
          locale={locale}
          onSpecGenerated={setSpecResult}
          onBack={handleReset}
        />
      )}
      {selectedImage && specResult && (
        <SpecResult
          result={specResult}
          locale={locale}
          onBack={() => setSpecResult(null)}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default HomeClient;

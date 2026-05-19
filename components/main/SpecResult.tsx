"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, X } from "lucide-react";
import type { Locale } from "@/lib/dictionaries";
import type { SpecJson, SpecResult as SpecResultType } from "@/lib/spec";
import specEn from "@/app/specs/spec-en.json";
import specIt from "@/app/specs/spec-it.json";

interface Props {
  result: SpecResultType;
  locale: Locale;
  onBack: () => void;
  onReset: () => void;
}

const specByLocale: Record<Locale, SpecJson> = {
  en: specEn as SpecJson,
  it: specIt as SpecJson,
};

const SpecResult = ({ result, locale, onBack, onReset }: Props) => {
  const spec = specByLocale[locale];

  return (
    <main className="flex flex-1 w-full flex-col items-center py-16 px-6 bg-white dark:bg-black gap-4">
      <div className="w-full max-w-sm flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
      </div>

      {result.styleDescription && (
        <div className="w-full max-w-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 flex flex-col gap-1">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {spec.styleDescription.title}
          </span>
          <p className="text-sm text-zinc-900 dark:text-zinc-100 leading-relaxed">
            {String(result.styleDescription)}
          </p>
        </div>
      )}

      <div className="w-full max-w-sm divide-y divide-zinc-100 dark:divide-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {Object.entries(spec).filter(([key]) => key !== "styleDescription").map(([key, field]) => {
          const value = result[key];
          const isEmpty = value === "" || value === undefined || value === null;

          return (
            <div key={key} className="flex items-start gap-3 px-4 py-3 bg-white dark:bg-zinc-900">
              <span className="flex-1 text-sm font-medium text-zinc-700 dark:text-zinc-300 min-w-0">
                {field.title}
              </span>
              {field.isBoolean ? (
                <span className="flex-shrink-0 mt-0.5">
                  {value === true ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <X className="h-4 w-4 text-zinc-300 dark:text-zinc-600" />
                  )}
                </span>
              ) : (
                <span className={`text-sm text-right max-w-[55%] ${isEmpty ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-900 dark:text-zinc-100"}`}>
                  {isEmpty ? "—" : String(value)}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="lg"
        className="w-full max-w-sm mt-2"
        onClick={onReset}
      >
        New Sketch
      </Button>
    </main>
  );
};

export default SpecResult;

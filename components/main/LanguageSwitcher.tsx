"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/dictionaries";

interface Props {
  locale: Locale;
}

const LanguageSwitcher = ({ locale }: Props) => {
  const pathname = usePathname();
  const otherLocale: Locale = locale === "en" ? "it" : "en";
  const newPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  return (
    <Link
      href={newPath}
      className="text-sm font-medium px-3 py-1 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
    >
      {otherLocale.toUpperCase()}
    </Link>
  );
};

export default LanguageSwitcher;

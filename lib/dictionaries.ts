const dictionaries = {
  en: () => import("../dictionaries/en.json").then((m) => m.default),
  it: () => import("../dictionaries/it.json").then((m) => m.default),
};

export type Locale = keyof typeof dictionaries;
export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

export const locales: Locale[] = ["en", "it"];
export const defaultLocale: Locale = "en";

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();

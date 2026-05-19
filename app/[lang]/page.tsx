import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/dictionaries";
import HomeClient from "@/components/main/HomeClient";

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return <HomeClient dict={dict} locale={lang} />;
}

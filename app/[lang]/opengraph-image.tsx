import { ImageResponse } from "next/og";
import { getDictionary, hasLocale, defaultLocale } from "@/lib/dictionaries";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : defaultLocale;
  const dict = await getDictionary(locale);

  const geist = await fetch(
    "https://fonts.gstatic.com/s/geist/v1/gyBhhwUxId8gMEwcGFWNOITddY4.woff"
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          background: "#18181b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          gap: "28px",
          fontFamily: "Geist, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-2px",
          }}
        >
          {dict.home.title}
        </div>
        <div
          style={{
            fontSize: 34,
            color: "#a1a1aa",
            textAlign: "center",
            lineHeight: 1.4,
            maxWidth: "860px",
          }}
        >
          {dict.home.subtitle}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Geist", data: geist, weight: 700 }],
    }
  );
}

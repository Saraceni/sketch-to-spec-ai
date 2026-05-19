import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { SpecJson } from "@/lib/spec";

function buildJsonSchema(spec: SpecJson) {
  const properties: Record<string, object> = {};

  for (const [key, field] of Object.entries(spec)) {
    const example =
      (field as Record<string, unknown>)["example"] ??
      (field as Record<string, unknown>)["example:"];
    const descriptionWithExample = [
      field.description,
      example ? `Example: ${example}` : null,
    ]
      .filter(Boolean)
      .join(". ");

    if (field.isBoolean) {
      properties[key] = { type: "boolean", description: descriptionWithExample };
    } else {
      properties[key] = { type: "string", description: descriptionWithExample };
    }
  }

  return {
    type: "object",
    properties,
    required: Object.keys(spec),
    additionalProperties: false,
  };
}

export async function POST(request: NextRequest) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File | null;
    const description = formData.get("description") as string;
    const locale = formData.get("locale") as string;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const specEn = (await import("@/app/specs/spec-en.json")).default as SpecJson;
    const schema = buildJsonSchema(specEn);

    const arrayBuffer = await image.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = image.type || "image/jpeg";

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            `You are a fashion technical specification expert. Analyze the garment sketch image and the designer's description to fill in a complete technical specification sheet. Be precise and use professional fashion industry terminology. For boolean fields, return true only if the feature is clearly present or implied. For text fields, be concise but technically accurate. All text field values must be written in ${locale === "it" ? "Italian" : "English"}.`,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64}`,
                detail: "high",
              },
            },
            {
              type: "text",
              text: description
                ? `Additional details from the designer: ${description}`
                : "Please analyse the garment sketch and fill in the technical specification.",
            },
          ],
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "garment_spec",
          schema,
          strict: true,
        },
      },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return NextResponse.json({ error: "Empty response from AI" }, { status: 500 });
    }

    return NextResponse.json(JSON.parse(content));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

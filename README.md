# SketchToSpec AI

Upload a photo of a fashion sketch and let AI generate a complete technical specification sheet — ready to hand off to a manufacturer.

## What it does

1. **Upload** a sketch (JPG/PNG/etc, max 5 MB)
2. **Describe** optional fabric details, colours, or construction notes
3. **Generate** — GPT-4o analyses the image and fills in a structured spec sheet
4. **Review** the result, with fields laid out in a readable format

Supported languages: English (`/en`) and Italian (`/it`), with localised UI and AI output.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| AI | OpenAI GPT-4o (vision + structured JSON output) |
| i18n | File-based dictionaries under `dictionaries/` |

## Getting started

### Prerequisites

- Node.js 18+
- pnpm
- An [OpenAI API key](https://platform.openai.com/api-keys)

### Setup

```bash
pnpm install
```

Create a `.env.local` file at the project root:

```env
OPENAI_API_KEY=sk-...
```

### Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/en` automatically.

## Project structure

```
app/
  [lang]/
    page.tsx              # Locale-aware entry point
    opengraph-image.tsx   # Localised social preview image
  api/generate-spec/
    route.ts              # POST — calls GPT-4o, returns structured spec
  specs/
    spec-en.json          # Spec field definitions (schema for AI output)
components/
  main/                   # Page-level components (Start, Details, SpecResult)
  ui/                     # shadcn/ui primitives
dictionaries/
  en.json                 # English strings
  it.json                 # Italian strings
lib/
  dictionaries.ts         # Locale loader + type exports
  spec.ts                 # Spec result types
```

## Adding a language

1. Add a new JSON file to `dictionaries/` (e.g. `fr.json`) mirroring the shape of `en.json`
2. Register it in `lib/dictionaries.ts`
3. The route `app/[lang]/` and the OG image generation will pick it up automatically

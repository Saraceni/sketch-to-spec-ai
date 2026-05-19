export type SpecEntry = {
  title: string;
  description: string;
  isBoolean?: boolean;
  example?: string;
};

export type SpecJson = Record<string, SpecEntry>;

export type SpecResult = Record<string, string | boolean>;

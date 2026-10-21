export type Locale = "en" | "ta";

export interface TranslationParams {
  [key: string]: string | number;
}

export type TranslationTree = {
  [key: string]: string | TranslationTree;
};

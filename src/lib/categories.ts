import type { CategoryKey } from "./types";

export const CATEGORY_ORDER: CategoryKey[] = [
  "before_service",
  "nameplate",
  "during_service",
  "after_service",
  "sparepart",
];

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  before_service: "Before Service",
  nameplate: "Nameplate",
  during_service: "During Service",
  after_service: "After Service",
  sparepart: "Sparepart",
};

export function categoryLabel(category: CategoryKey): string {
  return CATEGORY_LABELS[category] ?? category;
}

export function isCategoryKey(value: string): value is CategoryKey {
  return (CATEGORY_ORDER as string[]).includes(value);
}

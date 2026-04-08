import { Column } from "@/components/layout/admin/UserTabel";

type ColumnValueType = "string" | "number" | "boolean" | "date" | "unknown";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generateColumns<T extends Record<string, any>>(
  data: T[],
  options?: {
    exclude?: (keyof T)[];
    labels?: Partial<Record<keyof T, string>>;
  },
): Column<T>[] {
  if (!data.length) return [];

  const sample = data[0];

  return (Object.keys(sample) as (keyof T)[])
    .filter((key) => !options?.exclude?.includes(key))
    .map((key) => {
      const value = sample[key];
      const isDate = (val: unknown): val is Date =>
        typeof val === "object" && val !== null && val instanceof Date;

      const type: ColumnValueType = isDate(value)
        ? "date"
        : typeof value === "boolean"
          ? "boolean"
          : typeof value === "number"
            ? "number"
            : typeof value === "string"
              ? "string"
              : "unknown";

      return {
        key,
        label: options?.labels?.[key] ?? String(key).toUpperCase(),
        sortable: type === "string" || type === "number",

        
      };
    });
}

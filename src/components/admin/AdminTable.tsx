import type { ReactNode } from "react";
import { EmptyState } from "../ui/States";

export interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

export function AdminTable<T extends { id: string }>({ rows, columns, empty }: { rows: T[]; columns: Column<T>[]; empty: ReactNode }) {
  if (rows.length === 0) return <EmptyState title="Nothing here yet">{empty}</EmptyState>;
  return (
    <div className="overflow-x-auto border border-line bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-line bg-paper">
          <tr>
            {columns.map((c) => (
              <th key={c.header} scope="col" className={`label px-4 py-3 font-medium text-muted ${c.className ?? ""}`}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-paper">
              {columns.map((c) => (
                <td key={c.header} className={`px-4 py-3 align-top ${c.className ?? ""}`}>
                  {c.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatusPill({ value }: { value: string }) {
  const tone =
    value === "published" || value === "won" || value === "replied"
      ? "bg-ink text-lime"
      : value === "new"
        ? "bg-lime text-ink"
        : value === "draft" || value === "archived" || value === "lost"
          ? "border border-line-strong text-muted"
          : "border border-ink text-ink";
  return <span className={`label inline-block px-2 py-1 whitespace-nowrap ${tone}`}>{value.replace("_", " ")}</span>;
}

export function AdminPageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

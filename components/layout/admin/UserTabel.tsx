"use client";

import { DropdownMenuSubmenu } from "@/components/ui/DropdownMenuSub";
import { updateUserRole } from "@/lib/actions/admin-action";
import { PatientFormState } from "@/lib/actions/patientActions";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useMemo } from "react";

export type Column<T, K extends keyof T = keyof T> = {
  key: K;
  label: string;
  render?: (item: T[K]) => React.ReactNode;
  sortable?: boolean;
};

export type Action = {
  label: string;
  className?: string;
  actionFn: ({ id }: { id: string }) => Promise<PatientFormState>;
};

type Filter<T> = {
  label: string;
  value: string;
  filterFn: (item: T) => boolean;
};

type GenericAdminTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  title: string;
  pageSize?: number;
  filters?: Filter<T>[];
  actions?: Action[];
  rowKey?: keyof T;
};

export default function GenericAdminTable<T>({
  data,
  columns,
  title,
  pageSize = 5,
  filters = [],
  actions = [],
  rowKey,
}: GenericAdminTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  // 1️⃣ Filtering
  const searchedData = useMemo(() => {
    if (!search) return data;
    const lower = search.toLowerCase();
    return data.filter((item) =>
      columns.some((col) => {
        const val = item[col.key];
        return val != null && val.toString().toLowerCase().includes(lower);
      }),
    );
  }, [data, search, columns]);

  const filteredData = useMemo(() => {
    if (!activeFilter) return searchedData;
    const filterObj = filters.find((f) => f.value === activeFilter);
    if (!filterObj) return searchedData;
    return searchedData.filter(filterObj.filterFn);
  }, [searchedData, activeFilter, filters]);

  // 2️⃣ Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA == null) return 1;
      if (valB == null) return -1;
      if (typeof valA === "string" && typeof valB === "string") {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === "number" && typeof valB === "number") {
        return sortAsc ? valA - valB : valB - valA;
      }
      return 0;
    });
  }, [filteredData, sortKey, sortAsc]);

  // 3️⃣ Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden mt-6">
      {/* Header */}
      <div className="p-6 border-b border-border flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="border border-border px-3 py-1 rounded"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          {filters.length > 0 && (
            <select
              className="border border-border px-3 py-1 rounded"
              value={activeFilter ?? ""}
              onChange={(e) => setActiveFilter(e.target.value || null)}
            >
              <option value="">All</option>
              {filters.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key as string}
                  className={`px-6 py-3 font-medium select-none ${col.key === "id" && "hidden"} ${
                    col.sortable ? "cursor-pointer" : ""
                  }`}
                  onClick={() => col.sortable && handleSort(col.key)}
                  aria-sort={
                    sortKey === col.key
                      ? sortAsc
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                >
                  {col.label}{" "}
                  {col.sortable && sortKey === col.key
                    ? sortAsc
                      ? "▲"
                      : "▼"
                    : col.sortable
                      ? "⇅"
                      : ""}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.length ? (
              paginatedData.map((item) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const key = rowKey ? item[rowKey] : (item as any).id;
                
                
                return (
                  <tr
                    key={key as string}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    {columns.map((col) => {
                      const value = item[col.key];

                      return (
                        <td
                          key={col.key as string}
                          className={`px-6 py-4 ${col.key === "id" && "hidden"}`}
                        >
                          {col.render
                            ? col.render(value)
                            : item[col.key] != null
                              ? String(item[col.key])
                              : null}
                        </td>
                      );
                    })}
                    {actions.length > 0 && (
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        {actions.map((act) => {
                          if (act.label.toLocaleLowerCase() === "edite") {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const role = (item as any).role
                            return (
                              <DropdownMenuSubmenu
                                labels={[
                                  { label: "admin", key: "admin" },
                                  { label: "assistant", key: "assistant" },
                                  { label: "dentist", key: "dentist" },
                                  {
                                    label: "receptionist",
                                    key: "receptionist",
                                  },
                                ]}
                                value={role}
                                mainTile={act.label}
                                key={act.label}
                                panel_position={"Set as"}
                                userId={key}
                                method={updateUserRole}
                              />
                            );
                          } else
                            return (
                              <button
                                key={act.label}
                                className={
                                  act.className ??
                                  "text-xs px-3 py-1 rounded border border-border hover:bg-accent hover:text-white transition-colors"
                                }
                                onClick={() => {
                                  act.actionFn({ id: key });
                                }}
                              >
                                {act.label}
                              </button>
                            );
                        })}
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  className="px-6 py-4"
                  colSpan={columns.length + (actions.length ? 1 : 0)}
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 flex justify-end gap-2">
        <button
          className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:text-primary cursor-pointer"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          <ChevronLeft size={14} />
        </button>
        <span className="px-3 py-1">{page}</span>
        <button
          className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:text-primary cursor-pointer "
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((p) => p + 1)}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

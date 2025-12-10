import { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

// Define types
export type Column<T> = {
  key: keyof T | "actions" | string;
  header: string;
  render?: (item: T) => React.ReactNode;
};

type FilterOption = {
  key: string;
  label: string;
  options: { value: string; label: string }[];
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  onRowClick?: (item: T) => void;
  searchable?: boolean;
  searchTerm?: string;
  searchPlaceholder?: string;
  onSearchChange?: (term: string) => void;
  exportable?: boolean;
  filterable?: boolean;
  filterOptions?: FilterOption[];
  onFilterChange?: (filters: Record<string, string | null>) => void; // ✅ new
  filters?: Record<string, string | null>;
  paginate?: boolean;
  currentPage?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  loading?: boolean;
};

function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  searchable = true,
  searchTerm = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  filterable = true,
  filterOptions = [],
  onFilterChange,
  filters: externalFilters,
  paginate = true,
  pageSize = 10,
  currentPage = 1,
  totalItems = data.length,
  onPageChange,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });
  // const [filters, setFilters] = useState<Record<string, string | null>>({});
  const [internalFilters, setInternalFilters] = useState<
    Record<string, string | null>
  >({});
  const filters = externalFilters ?? internalFilters;

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value === "" ? null : value,
    };

    if (onFilterChange) {
      onFilterChange(newFilters); // ✅ notify parent
    } else {
      setInternalFilters(newFilters); // ✅ fallback internal
    }

    onPageChange?.(1); // reset to first page
  };

  // Sorting
  const sortedData = useMemo(() => {
    const sortableData = [...data];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof T];
        const bValue = b[sortConfig.key as keyof T];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  // Sorting handler
  const requestSort = (key: keyof T) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filtering
  const filteredData = useMemo(() => {
    return sortedData.filter((item) => {
      // Search
      if (searchTerm) {
        const searchMatch = columns.some((column) => {
          const value = item[column.key as keyof T];
          return (
            value &&
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
        if (!searchMatch) return false;
      }

      // Filters
      for (const key in filters) {
        if (filters[key] && item[key as keyof T] !== filters[key]) {
          return false;
        }
      }

      return true;
    });
  }, [sortedData, searchTerm, filters, columns]);

  // --- NEW: determine data source and paginate appropriately ---
  const usingServerSearch = Boolean(onSearchChange); // parent handles search => server-side
  const sourceData = usingServerSearch ? data : filteredData;

  const current = Math.max(1, Number(currentPage || 1));
  const size = Number(pageSize || 10);
  const start = (current - 1) * size;
  const end = start + size;

  const paginatedData =
    paginate && !usingServerSearch ? sourceData.slice(start, end) : sourceData;
  // --- END NEW ---

  // Pagination
  const totalPages =
    totalItems && pageSize ? Math.ceil(totalItems / pageSize) : 1;

  // Pagination links
  const getPageLinks = (): number[] => {
    const pages: number[] = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="space-y-4">
      {/* Search and filters */}
      <div className="flex flex-wrap gap-4 justify-between">
        {searchable && (
          <div className="relative w-full sm:w-64 flex items-center gap-20">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-10"
              value={searchTerm || ""}
              onChange={(e) => {
                onSearchChange?.(e.target.value);
                onPageChange?.(1);
              }}
            />
          </div>
        )}

        {filterOptions.length > 0 && (
          <div className="flex flex-wrap gap-2 outline-none">
            {filterOptions.map((filter) => (
              <select
                key={filter.key}
                className="px-3 py-2 border rounded-md text-sm"
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                value={filters[filter.key] || ""}
              >
                <option value="">{filter.label}: All</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-md overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[800px] w-full table-auto text-sm">
            <thead>
              <tr className="bg-white/80 backdrop-blur-md">
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={`whitespace-nowrap px-4 py-3 text-left align-middle font-medium text-sm text-muted-foreground ${column.key !== "actions" ? "cursor-pointer" : ""}`}
                    onClick={() => {
                      if (column.key !== "actions" && typeof column.key !== "string") {
                        requestSort(column.key as keyof T);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="whitespace-nowrap">{column.header}</span>
                      {sortConfig.key === column.key &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        ))}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, rowIndex) => (
                  <tr
                    key={keyExtractor(item)}
                    onClick={() => onRowClick?.(item)}
                    className={`group ${onRowClick ? "cursor-pointer" : ""} hover:bg-gray-50 focus-within:bg-gray-50 ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    {columns.map((column) => (
                      <td
                        key={`${keyExtractor(item)}-${String(column.key)}`}
                        className="px-4 py-3 align-middle border-b max-w-[220px]"
                      >
                        <div className="flex items-center">
                          <span className="block truncate" title={String(column.render ? (column.render(item) as any) ?? "" : (item[column.key as keyof T] ?? ""))}>
                            {column.render
                              ? column.render(item)
                              : item[column.key as keyof T] !== undefined
                                ? String(item[column.key as keyof T])
                                : ""}
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-10 text-sm text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7z" />
                      </svg>
                      <div>No data found</div>
                      <div className="text-xs text-muted-foreground/70">Try changing filters or search</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {paginate && totalPages >= 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  currentPage > 1 && onPageChange?.(currentPage - 1)
                }
                className={
                  currentPage <= 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {getPageLinks().map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => onPageChange?.(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  currentPage < totalPages && onPageChange?.(currentPage + 1)
                }
                className={
                  currentPage >= totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

export default DataTable;

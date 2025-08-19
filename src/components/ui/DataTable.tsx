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
type Column<T> = {
  key: keyof T | "actions";
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
  exportable?: boolean;
  filterable?: boolean;
  filterOptions?: FilterOption[];
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
  filterable = true,
  filterOptions = [],
  paginate = true,
  pageSize = 10,
  currentPage = 1,      // <-- add default
  totalItems = data.length, // <-- fallback if not provided
  onPageChange,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  // const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });
  const [filters, setFilters] = useState<Record<string, string | null>>({});

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
  const requestSort = (key: keyof T | "actions") => {
    if (key === "actions") return;
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

  // Pagination
  // const paginatedData = useMemo(() => {
  //   if (!paginate) return filteredData;
  //   const startIndex = (currentPage - 1) * pageSize;
  //   return filteredData.slice(startIndex, startIndex + pageSize);
  // }, [filteredData, currentPage, pageSize, paginate]);

  // const totalPages = Math.ceil(filteredData.length / pageSize);
  const totalPages = totalItems && pageSize ? Math.ceil(totalItems / pageSize) : 1;

  // Filter change
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? null : value,
    }));
    onPageChange?.(1);
  };

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
        {filterable && (
          <div className="relative w-full sm:w-64 flex items-center gap-20">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
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
      <div className="border rounded-md overflow-hidden overflow-x-sroll">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className={column.key !== "actions" ? "cursor-pointer" : ""}
                  onClick={() => {
                    if (column.key !== "actions") {
                      requestSort(column.key);
                    }
                  }}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {sortConfig.key === column.key &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((item) => (
                <TableRow
                  key={keyExtractor(item)}
                  onClick={() => onRowClick?.(item)}
                  className={
                    onRowClick ? "cursor-pointer hover:bg-gray-100" : ""
                  }
                >
                  {columns.map((column) => (
                    <TableCell
                      key={`${keyExtractor(item)}-${String(column.key)}`}
                    >
                      {column.render
                        ? column.render(item)
                        : item[column.key as keyof T] !== undefined
                          ? String(item[column.key as keyof T])
                          : ""}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8"
                >
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {paginate && totalPages >= 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              {/* <PaginationPrevious
                onClick={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
                className={
                  currentPage <= 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              /> */}
              <PaginationPrevious
                onClick={() => currentPage > 1 && onPageChange?.(currentPage - 1)}
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
              {/* <PaginationNext
                onClick={() =>
                  currentPage < totalPages && setCurrentPage(currentPage + 1)
                }
                className={
                  currentPage >= totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              /> */}
              <PaginationNext
                onClick={() => currentPage < totalPages && onPageChange?.(currentPage + 1)}
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

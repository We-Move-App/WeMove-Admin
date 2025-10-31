import React from "react";

const PaginationComponent = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return null;

  // Only show 3 pages at a time
  const maxVisible = 3;
  const startPage = Math.floor((currentPage - 1) / maxVisible) * maxVisible + 1;
  const endPage = Math.min(startPage + maxVisible - 1, totalPages);

  return (
    <div className="flex justify-center mt-4 mb-6 space-x-2">
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
      >
        Prev
      </button>

      {/* Page Numbers (only 3 shown) */}
      {Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
      ).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 border rounded ${
            currentPage === page
              ? "bg-green-900 text-white border-green-900"
              : "hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationComponent;

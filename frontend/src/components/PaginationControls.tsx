import React from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}) => {
  const handlePrevious = () => {
    if (hasPreviousPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      {/* Previous button */}
      <button
        onClick={handlePrevious}
        disabled={!hasPreviousPage}
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          hasPreviousPage
            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        Previous
      </button>

      {/* First page if not visible */}
      {getPageNumbers()[0] > 1 && (
        <>
          <button
            onClick={() => handlePageClick(1)}
            className="px-3 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            1
          </button>
          {getPageNumbers()[0] > 2 && (
            <span className="px-2 py-2 text-gray-500">...</span>
          )}
        </>
      )}

      {/* Page numbers */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            page === currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Last page if not visible */}
      {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
        <>
          {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
            <span className="px-2 py-2 text-gray-500">...</span>
          )}
          <button
            onClick={() => handlePageClick(totalPages)}
            className="px-3 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next button */}
      <button
        onClick={handleNext}
        disabled={!hasNextPage}
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          hasNextPage
            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        Next
      </button>

      {/* Page info */}
      <span className="text-sm text-gray-600 ml-4">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};

export default PaginationControls;
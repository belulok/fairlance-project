'use client';

import React from 'react';

interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  totalProjects: number;
  onPageChange: (page: number) => void;
}

export default function SimplePagination({ 
  currentPage, 
  totalPages, 
  totalProjects, 
  onPageChange 
}: SimplePaginationProps) {
  
  const handlePrevious = () => {
    console.log('🚀 SimplePagination: Previous clicked');
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    console.log('🚀 SimplePagination: Next clicked');
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    console.log('🚀 SimplePagination: Page clicked:', page);
    onPageChange(page);
  };

  if (totalPages <= 1) return null;

  return (
    <div
      className="flex justify-center items-center gap-4 mb-8 p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg"
      style={{
        position: 'relative',
        zIndex: 9999,
        pointerEvents: 'auto'
      }}
    >
      {/* Previous Button */}
      <button
        type="button"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`px-4 py-2 text-sm font-medium rounded-md border transition-all duration-200 ${
          currentPage === 1
            ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
            : 'bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground cursor-pointer shadow-sm'
        }`}
        style={{
          position: 'relative',
          zIndex: 10000,
          pointerEvents: 'auto'
        }}
      >
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
          if (pageNum > totalPages) return null;
          
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => handlePageClick(pageNum)}
              className={`min-w-[40px] px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-all duration-200 shadow-sm ${
                currentPage === pageNum
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-background text-foreground border border-border hover:bg-accent hover:text-accent-foreground'
              }`}
              style={{
                position: 'relative',
                zIndex: 10000,
                pointerEvents: 'auto'
              }}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 text-sm font-medium rounded-md border transition-all duration-200 ${
          currentPage === totalPages
            ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
            : 'bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground cursor-pointer shadow-sm'
        }`}
        style={{
          position: 'relative',
          zIndex: 10000,
          pointerEvents: 'auto'
        }}
      >
        Next
      </button>

      {/* Page Info */}
      <div className="text-sm text-muted-foreground ml-4">
        Page {currentPage} of {totalPages} ({totalProjects} total)
      </div>
    </div>
  );
}

import { useMemo } from 'react';

/**
 * Custom hook for section virtualization in the About page.
 * This hook optimizes performance by determining which sections should be rendered
 * based on the current section and a buffer size. It only renders the current section
 * and a specified number of adjacent sections (buffer), while keeping other sections
 * unmounted to reduce memory usage and improve performance.
 *
 * For example, with bufferSize = 1 and currentSection = 2:
 * - Only sections 1, 2, and 3 will be rendered
 * - All other sections will be unmounted
 *
 * @param currentSection - The index of the currently active section
 * @param totalSections - The total number of sections in the page
 * @param bufferSize - Number of sections to render before and after the current section (default: 1)
 * @returns Object containing:
 *   - visibleSections: Array of section indices that should be rendered
 *   - isSectionVisible: Function to check if a specific section should be rendered
 */
interface UseVirtualizationProps {
  currentSection: number;
  totalSections: number;
  bufferSize?: number;
}

export const useVirtualization = ({
  currentSection,
  totalSections,
  bufferSize = 1,
}: UseVirtualizationProps) => {
  const visibleSections = useMemo(() => {
    const start = Math.max(0, currentSection - bufferSize);
    const end = Math.min(totalSections - 1, currentSection + bufferSize);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentSection, totalSections, bufferSize]);

  return {
    visibleSections,
    isSectionVisible: (index: number) => visibleSections.includes(index),
  };
};

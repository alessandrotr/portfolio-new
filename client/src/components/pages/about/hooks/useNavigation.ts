import { useCallback, useState } from 'react';
import store from '../../../../appStore';

/**
 * Custom hook for managing navigation in the About page.
 * Handles all user interactions for navigating between sections including:
 * - Mouse wheel scrolling
 * - Touch swipe gestures
 * - Button clicks
 * - Direct section changes
 *
 * The hook maintains the current section state and provides methods to:
 * - Navigate between sections
 * - Handle wheel events for vertical/horizontal scrolling
 * - Process touch events for swipe navigation
 * - Control navigation through up/down buttons
 *
 * @param props - Hook props containing:
 *   - totalSections: Total number of sections in the page
 *   - initialSection: Starting section index (defaults to 0)
 * @returns Object containing:
 *   - currentSection: Current active section index
 *   - setCurrentSection: Function to directly set the current section
 *   - handleSectionChange: Function to change sections
 *   - handleWheel: Function to handle mouse wheel events
 *   - handleTouchStart: Function to handle touch start events
 *   - handleTouchMove: Function to handle touch move events
 *   - handleUpClick: Function to navigate to previous section
 *   - handleDownClick: Function to navigate to next section
 */
interface UseNavigationProps {
  totalSections: number;
  initialSection?: number;
}

export const useNavigation = ({
  totalSections,
  initialSection = 0,
}: UseNavigationProps) => {
  const [currentSection, setCurrentSection] = useState(initialSection);

  const handleSectionChange = useCallback((index: number) => {
    setCurrentSection(index);
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (delta > 0 && currentSection < totalSections - 1) {
        setCurrentSection((prev) => prev + 1);
      } else if (delta < 0 && currentSection > 0) {
        setCurrentSection((prev) => prev - 1);
      }
    },
    [currentSection, totalSections]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const touch = e.touches[0];
      store.touchStartY = touch.clientY;
      store.touchStartX = touch.clientX;
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (store.touchStartY === null || store.touchStartX === null) return;

      const touch = e.touches[0];
      const deltaY = store.touchStartY - touch.clientY;
      const deltaX = store.touchStartX - touch.clientX;
      const threshold = 50;

      const handleNavigation = (delta: number) => {
        if (delta > 0 && currentSection < totalSections - 1) {
          setCurrentSection((prev) => prev + 1);
        } else if (delta < 0 && currentSection > 0) {
          setCurrentSection((prev) => prev - 1);
        }
        store.touchStartX = null;
        store.touchStartY = null;
      };

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > threshold) {
          handleNavigation(deltaX);
        }
      } else {
        if (Math.abs(deltaY) > threshold) {
          handleNavigation(deltaY);
        }
      }
    },
    [currentSection, totalSections]
  );

  const handleUpClick = useCallback(() => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
    }
  }, [currentSection]);

  const handleDownClick = useCallback(() => {
    if (currentSection < totalSections - 1) {
      setCurrentSection((prev) => prev + 1);
    }
  }, [currentSection, totalSections]);

  return {
    currentSection,
    setCurrentSection,
    handleSectionChange,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleUpClick,
    handleDownClick,
  };
};

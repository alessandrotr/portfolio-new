import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Section } from '../types';

/**
 * Custom hook for synchronizing the URL with the current section in the About page.
 * Manages URL updates to reflect the current section and handles navigation.
 *
 * The hook:
 * - Updates the URL when the current section changes
 * - Maintains URL state during navigation
 * - Handles language-specific routing
 * - Prevents unnecessary URL updates using a ref
 *
 * @param props - Hook props containing:
 *   - currentSection: Index of the current section
 *   - sections: Array of section data
 *   - sectionId: Current section ID from URL (optional)
 *   - navigate: React Router navigation function
 *   - currentLanguage: Current language code
 *   - isUrlUpdateRef: Ref to track URL update state
 */
interface UseUrlSyncProps {
  currentSection: number;
  sections: Section[];
  sectionId?: string;
  navigate: ReturnType<typeof useNavigate>;
  currentLanguage: string;
  isUrlUpdateRef: React.MutableRefObject<boolean>;
}

export const useUrlSync = ({
  currentSection,
  sections,
  sectionId,
  navigate,
  currentLanguage,
  isUrlUpdateRef,
}: UseUrlSyncProps): void => {
  useEffect(() => {
    const currentSectionId = sections[currentSection]?.id;
    if (currentSectionId && (!sectionId || currentSectionId !== sectionId)) {
      isUrlUpdateRef.current = true;
      navigate(`/${currentLanguage}/about/${currentSectionId}`, {
        replace: true,
      });
    }
    return () => {
      isUrlUpdateRef.current = false;
    };
  }, [
    currentSection,
    sections,
    navigate,
    sectionId,
    currentLanguage,
    isUrlUpdateRef,
  ]);
};

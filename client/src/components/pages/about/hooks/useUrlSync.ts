import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Section } from '../types';

interface UseUrlSyncProps {
  currentSection: number;
  sections: Section[];
  sectionId?: string;
  navigate: ReturnType<typeof useNavigate>;
  currentLanguage: string;
  isUrlUpdateRef: React.MutableRefObject<boolean>;
}

/**
 * Custom hook to synchronize URL with current section
 *
 * @param props - Hook props containing navigation and section data
 */
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

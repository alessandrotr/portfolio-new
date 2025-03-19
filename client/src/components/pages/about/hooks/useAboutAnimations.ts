import { useSpring, useSprings } from '@react-spring/web';
import { ANIMATION_CONFIG } from '../constants';
import { Section } from '../types';
import { useMemo } from 'react';

/**
 * Custom hook for managing animations in the About page.
 * Handles all animation-related logic including:
 * - Container fade-in and slide-up animations
 * - Section transitions with horizontal sliding
 * - Loading state animations
 *
 * Uses react-spring for smooth, performant animations with:
 * - Configurable animation settings from ANIMATION_CONFIG
 * - Section-specific spring animations
 * - Container-level entrance animations
 *
 * @param props - Hook props containing:
 *   - isLoading: Boolean indicating if content is loading
 *   - currentSection: Index of the currently active section
 *   - sections: Array of section data
 * @returns Object containing:
 *   - containerSpring: Spring animation for the main container
 *   - sectionSprings: Array of spring animations for each section
 */
interface UseAboutAnimationsProps {
  isLoading: boolean;
  currentSection: number;
  sections: Section[];
}

export const useAboutAnimations = ({
  isLoading,
  currentSection,
  sections,
}: UseAboutAnimationsProps) => {
  const containerSpring = useSpring({
    from: {
      opacity: 0,
      y: '-500px',
    },
    to: {
      opacity: isLoading ? 0 : 1,
      y: isLoading ? '-500px' : '0px',
    },
    config: ANIMATION_CONFIG.gentle,
  });

  const sectionSprings = useSprings(
    sections.length,
    useMemo(
      () =>
        Array.from({ length: sections.length }, (_, index) => ({
          opacity: currentSection === index ? 1 : 0,
          transform: `translateX(${(index - currentSection) * 100}vw)`,
          config: ANIMATION_CONFIG.gentle,
        })),
      [sections.length, currentSection]
    )
  );

  return {
    containerSpring,
    sectionSprings,
  };
};

import { useSpring, useSprings } from '@react-spring/web';
import { ANIMATION_CONFIG } from '../constants';
import { Section } from '../types';

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
    sections.map((_, index) => ({
      opacity: currentSection === index ? 1 : 0,
      transform: `translateX(${(index - currentSection) * 100}vw)`,
      config: ANIMATION_CONFIG.gentle,
    }))
  );

  return {
    containerSpring,
    sectionSprings,
  };
};

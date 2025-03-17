import { ReactNode } from 'react';
import { SpringValue } from '@react-spring/web';

export type SectionId = 'who' | 'what' | 'live' | 'from' | 'hobbies';

export interface Section {
  id: SectionId;
  title: string;
  content: ReactNode;
  sceneId?: 'berlin' | 'naples';
}

export interface AboutSectionProps {
  title: string;
  content: string | ReactNode;
  scene?: ReactNode;
  style: {
    opacity: SpringValue<number>;
    transform: SpringValue<string>;
  };
}

export interface NavigationChevronsProps {
  canGoUp: boolean;
  canGoDown: boolean;
  onUpClick: () => void;
  onDownClick: () => void;
  prevSectionName?: string;
  nextSectionName?: string;
}

export interface AboutSectionNavProps {
  sections: Section[];
  currentSection: number;
  onSectionChange: (index: number) => void;
}

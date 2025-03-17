import { SectionId } from './types';

export const SECTION_IDS: readonly SectionId[] = [
  'who',
  'what',
  'live',
  'from',
  'hobbies',
] as const;

export const TOUCH_THRESHOLD = 50;
export const CHEVRON_SIZE = {
  width: 12,
  height: 12,
};

export const ANIMATION_CONFIG = {
  default: {
    tension: 300,
    friction: 20,
  },
  gentle: {
    tension: 170,
    friction: 26,
  },
} as const;

export const LAYOUT = {
  navigation: {
    top: '1.5vw',
  },
  section: {
    maxWidth: '30vw',
    titleSize: '4vw',
    contentSize: '1.25vw',
    titleMarginBottom: '1vw',
  },
  chevrons: {
    horizontalOffset: '8vw',
  },
} as const;

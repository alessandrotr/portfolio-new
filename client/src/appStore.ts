import { proxy } from 'valtio';
import tailwindColors from './tailwindColors';

// Get the saved color from localStorage or use default
const getSavedColor = () => {
  const savedColor = localStorage.getItem('selectedColor');
  return (
    savedColor ||
    (typeof tailwindColors.items === 'string'
      ? tailwindColors.items
      : tailwindColors.items?.['500'] || '#5fd9f9')
  );
};

// Get saved theme from localStorage or use default
const getSavedTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  return savedTheme || 'dark';
};

// Get saved volume from localStorage or use default
const getSavedVolume = () => {
  const savedVolume = localStorage.getItem('volume');
  return savedVolume ? parseFloat(savedVolume) : 0;
};

const store = proxy({
  isLoading: true,
  projectActive: '',
  changingProject: false,
  settingsBarExpanded: false,
  contactFormExpanded: false,
  theme: getSavedTheme(),
  volume: getSavedVolume(),
  selectedColor: getSavedColor(),
  availableColors: ['#5fd9f9', '#ff6b6b', '#ffbb33', '#48c774', '#a29bfe'],
  touchStartY: null as number | null,
  touchStartX: null as number | null,
  activeScene: null as 'berlin' | 'naples' | null,
  changeColor: () => {
    const currentIndex = store.availableColors.indexOf(store.selectedColor);
    const nextIndex = (currentIndex + 1) % store.availableColors.length;
    store.selectedColor = store.availableColors[nextIndex];
    localStorage.setItem('selectedColor', store.selectedColor);
  },
  setTheme: (theme: 'light' | 'dark') => {
    store.theme = theme;
    localStorage.setItem('theme', theme);
  },
  setVolume: (volume: number) => {
    store.volume = volume;
    localStorage.setItem('volume', volume.toString());
  },
});

export default store;

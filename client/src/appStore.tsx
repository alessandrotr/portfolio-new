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

export const storeModel = {
  isLoading: true,
  projectActive: 'ENRX',
  changingProject: false,
  settingsBarExpanded: false,
  contactFormExpanded: false,
  theme: 'dark',
  volume: 0,
  selectedColor: getSavedColor(),
  availableColors: ['#5fd9f9', '#ff6b6b', '#ffbb33', '#48c774', '#a29bfe'], // List of colors
  pageActive: 'HomePage',
  changeColor: () => {
    const currentIndex = store.availableColors.indexOf(store.selectedColor);
    const nextIndex = (currentIndex + 1) % store.availableColors.length;
    store.selectedColor = store.availableColors[nextIndex];
    localStorage.setItem('selectedColor', store.selectedColor);
  },
};

export const store = proxy(storeModel);

export default store;

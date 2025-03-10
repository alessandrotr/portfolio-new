import { useSnapshot } from 'valtio';
import store from '../../../appStore';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export default function ItemsColorSwitcher() {
  const snap = useSnapshot(store);
  const { t } = useTranslation();

  const handleColorChange = (color: string) => {
    store.selectedColor = color;
    localStorage.setItem('selectedColor', color);
    toast.success(`${t('settingsBar.colors.colorChanged')} ${color}`, {
      icon: '🎨',
      style: {
        border: `3px solid ${color}`,
        fontSize: '0.9vw',
      },
    });
  };

  return (
    <div className="space-y-[0.3vw]">
      <span className="text-[0.75vw] text-gray-500 dark:text-gray-400 transition-colors duration-300">
        {t('settingsBar.languages.changeColorText')}
      </span>
      <div className="flex gap-2">
        {snap.availableColors.map((color, index) => (
          <div
            key={index}
            onClick={() => handleColorChange(color)}
            className={`w-[1.5vw] h-[1.5vw] rounded-full transition-all duration-300 
            ${
              snap.selectedColor === color
                ? 'ring-2 ring-bgLight'
                : 'transition-transform transform hover:scale-110 cursor-pointer'
            }`}
            style={{
              backgroundColor: color,
            }}
          />
        ))}
      </div>
    </div>
  );
}

import { useSpring, animated } from '@react-spring/web';
import useTheme from '../../../hooks/useTheme';
import store from '../../../appStore';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { SettingsSubtitle } from './SettingsBar';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const [props, api] = useSpring(() => ({
    x: theme === 'dark' ? -0.1 : 1.9,
    rotate: 0,
    bgColor: theme === 'dark' ? '#121211' : '#ffffff',
    boxShadow:
      theme === 'dark'
        ? '0px 0px 0px rgba(0,0,0,0)'
        : '0px 0px 15px rgb(255, 217, 0)',
    config: { mass: 1, tension: 100, friction: 20 },
  }));

  const handleToggle = () => {
    toggleTheme();
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    store.theme = newTheme;

    toast.success(
      `${t('settingsBar.theme.changed')} ${t(`settingsBar.theme.${newTheme}`)}`,
      {
        style: {
          fontSize: '0.9vw',
        },
        icon: newTheme === 'light' ? '☀️' : '🌙',
      }
    );

    api.start({
      x: newTheme === 'dark' ? -0.1 : 1.9,
      rotate: props.rotate.get() + -180,
      bgColor: newTheme === 'dark' ? '#121211' : 'rgb(198, 168, 0)',
      boxShadow:
        newTheme === 'dark'
          ? '0px 0px 0px rgba(0,0,0,0)'
          : '0px 0px 10px rgba(255, 215, 0, 0.8)',
    });
  };

  return (
    <div className="space-y-[0.3vw]">
      <SettingsSubtitle text={t('settingsBar.theme.changeThemeText')} />
      <div
        onClick={handleToggle}
        className="cursor-pointer flex items-center text-center text-[0.85vw] w-[4vw] h-[2vw] uppercase select-none bg-borderLightTransparent dark:bg-borderDarkTransparent rounded-full p-[2px]"
      >
        <animated.div
          style={{
            transform: props.x.to(
              (x) => `translateX(${x}vw) rotate(${props.rotate.get()}deg)`
            ),
            backgroundColor: props.bgColor,
            boxShadow: props.boxShadow,
          }}
          className="w-[2vw] h-[2vw] flex items-center justify-center rounded-full relative overflow-hidden"
        >
          {theme === 'dark' && (
            <div className="w-[1.4vw] h-[1.4vw] bg-white rounded-full absolute"></div> // Base moon shape
          )}
          {theme === 'dark' && (
            <div className="w-[1.2vw] h-[1.3vw] bg-bgDark rounded-full absolute right-0"></div> // Overlay for half-moon effect
          )}
        </animated.div>
      </div>
    </div>
  );
}

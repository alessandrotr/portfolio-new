import { useState } from 'react';
import { useSpring, animated, config as springConfig } from '@react-spring/web';
import { useSnapshot } from 'valtio';
import store from '../../appStore';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedLetter from './AnimatedLetter';

const Copyright = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const { t } = useTranslation();
  const text = t('copyright');
  const snap = useSnapshot(store);
  const { currentLanguage } = useLanguage();

  const handleMouseMove = (event: React.MouseEvent) => {
    setMouseX(event.clientX);
    setMouseY(event.clientY);
  };

  const { opacity: buttonOpacity } = useSpring({
    opacity: snap.isLoading ? 0 : 1,
    config: { ...springConfig.molasses, duration: 800 },
    delay: 400,
  });

  return (
    <div className="absolute left-[1.5vw] bottom-[1vw] flex items-center gap-4">
      <div
        className="flex flex-wrap text-center text-[1vw] uppercase whitespace-pre-line select-none pointer-events-none"
        onMouseMove={handleMouseMove}
      >
        {text.split('\n').map((line, lineIndex) => (
          <div key={lineIndex} className="w-full flex">
            {line.split('').map((char, charIndex) => (
              <AnimatedLetter
                key={`${lineIndex}-${charIndex}`}
                char={char}
                lineIndex={lineIndex}
                charIndex={charIndex}
                setHoveredIndex={setHoveredIndex}
                hoveredIndex={hoveredIndex}
                mouseX={mouseX}
                mouseY={mouseY}
              />
            ))}
          </div>
        ))}
      </div>
      <animated.div style={{ opacity: buttonOpacity }}>
        <Link
          to={`/${currentLanguage}/privacy-policy`}
          className="text-[1vw] uppercase text-textDark dark:text-textLight hover:opacity-80 transition-opacity select-none"
        >
          {t('privacyPolicy.buttonOpenDialogText')}
        </Link>
      </animated.div>
    </div>
  );
};

export default Copyright;

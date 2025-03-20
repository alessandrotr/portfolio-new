import { useState } from 'react';
import { useSpring, animated, config as springConfig } from '@react-spring/web';
import { useSnapshot } from 'valtio';
import store from '../../../appStore';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { NavigationLetter } from './NavigationLetter';

const PrivacyPolicyLink = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const { t } = useTranslation();
  const snap = useSnapshot(store);
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMouseMove = (event: React.MouseEvent) => {
    setMouseX(event.clientX);
    setMouseY(event.clientY);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const { opacity: buttonOpacity } = useSpring({
    opacity: snap.isLoading ? 0 : 1,
    config: { ...springConfig.molasses, duration: 800 },
    delay: 400,
  });

  return (
    <animated.div style={{ opacity: buttonOpacity }}>
      <h3
        className={`text-[1vw] uppercase ${
          !location.pathname.includes('/privacy-policy') ? 'cursor-pointer' : ''
        }`}
        onClick={() =>
          !location.pathname.includes('/privacy-policy') &&
          navigate(`/${currentLanguage}/privacy-policy`)
        }
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {t('privacyPolicy.buttonOpenDialogText')
          .split('')
          .map((char, charIndex) => (
            <NavigationLetter
              key={`privacy-${charIndex}`}
              char={char}
              lineIndex={0}
              charIndex={charIndex + 400}
              mouseX={mouseX}
              mouseY={mouseY}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
              isSelected={location.pathname.includes('/privacy-policy')}
            />
          ))}
      </h3>
    </animated.div>
  );
};

export default PrivacyPolicyLink;

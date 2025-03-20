import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NavigationLetter } from './NavigationLetter';

const Navigation = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();

  const handleMouseMove = (event: React.MouseEvent) => {
    setMouseX(event.clientX);
    setMouseY(event.clientY);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const navigationItems = [
    {
      path: 'projects',
      text: t('navigation.projects'),
      charIndexOffset: 100,
    },
    {
      path: 'about',
      text: t('navigation.about'),
      charIndexOffset: 200,
    },
    {
      path: 'contact',
      text: t('navigation.contact'),
      charIndexOffset: 300,
    },
  ];

  return (
    <div
      className="fixed top-[1.6vw] right-[7vw] flex gap-[1.75vw] z-[20] pointer-events-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {navigationItems.map(({ path, text, charIndexOffset }) => (
        <h3
          key={path}
          className={`text-[1.1vw] uppercase ${
            location.pathname.includes(`/${path}`)
              ? 'cursor-default'
              : 'cursor-pointer'
          }`}
          onClick={() => navigate(`/${currentLanguage}/${path}`)}
        >
          {text.split('').map((char, charIndex) => (
            <NavigationLetter
              key={`${path}-${charIndex}`}
              char={char}
              lineIndex={0}
              charIndex={charIndex + charIndexOffset}
              mouseX={mouseX}
              mouseY={mouseY}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
              isSelected={location.pathname.includes(`/${path}`)}
            />
          ))}
        </h3>
      ))}
    </div>
  );
};

export default Navigation;

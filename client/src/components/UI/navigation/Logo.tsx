import { useState } from 'react';
import { useSnapshot } from 'valtio';
import store from '../../../appStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import AnimatedLetter from '../common/ui-utils/AnimatedLetter';

const text = `ALESSANDRO TRAIOLA`;

const Logo = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLanguage } = useLanguage();

  const handleMouseMove = (event: React.MouseEvent) => {
    setMouseX(event.clientX);
    setMouseY(event.clientY);
  };

  const handleClick = () => {
    if (location.pathname === `/${currentLanguage}`) return;

    setIsClicked(true);
    navigate(`/${currentLanguage}`);
    setTimeout(() => {
      setIsClicked(false);
    }, 1000);
  };

  const snap = useSnapshot(store);

  return (
    <div
      className={`absolute left-[1.5vw] top-[1vw] flex flex-col text-center text-[4vw] xl:text-[1.5vw] uppercase whitespace-pre-line select-none z-[50] ${
        location.pathname !== `/${currentLanguage}` ? 'cursor-pointer' : ''
      }`}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {text.split('\n').map((line, lineIndex) => (
        <h3
          key={lineIndex}
          className={`w-fit flex text-textDark dark:text-textLight ${
            location.pathname !== `/${currentLanguage}` ? 'cursor-pointer' : ''
          }`}
        >
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
              isClicked={isClicked}
            />
          ))}
        </h3>
      ))}
      <p
        className={`text-[2.32vw] xl:text-[0.87vw] text-textDark dark:text-textLight select-none uppercase transition-opacity duration-750 dark:transition-colors dark:duration-[1s] ${
          snap.isLoading ? 'opacity-0' : 'opacity-1'
        }`}
      >
        Frontend Developer based in berlin
      </p>
    </div>
  );
};

export default Logo;

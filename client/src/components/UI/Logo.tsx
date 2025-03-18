import { useState } from 'react';
import { useSnapshot } from 'valtio';
import store from '../../appStore';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedLetter from './AnimatedLetter';

const text = `ALESSANDRO TRAIOLA`;

const Logo = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();

  const handleMouseMove = (event: React.MouseEvent) => {
    setMouseX(event.clientX);
    setMouseY(event.clientY);
  };

  const handleClick = () => {
    navigate(`/${currentLanguage}`);
  };

  const snap = useSnapshot(store);

  return (
    <div
      className="absolute left-[1.5vw] top-[1vw] flex flex-col text-center text-[4vw] xl:text-[1.5vw] uppercase whitespace-pre-line select-none cursor-pointer z-[50]"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {text.split('\n').map((line, lineIndex) => (
        <h3
          key={lineIndex}
          className="w-fit flex cursor-pointer text-textDark dark:text-textLight"
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

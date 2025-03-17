import { useState, useEffect, useRef } from 'react';
import { useSpring, animated, config as springConfig } from '@react-spring/web';
import { useSnapshot } from 'valtio';
import store from '../../appStore';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

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
                text={text}
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

interface AnimatedLetterProps {
  char: string;
  lineIndex: number;
  charIndex: number;
  setHoveredIndex: (index: number | null) => void;
  hoveredIndex: number | null;
  mouseX: number;
  mouseY: number;
  text: string;
}

const AnimatedLetter = ({
  char,
  lineIndex,
  charIndex,
  setHoveredIndex,
  hoveredIndex,
  mouseX,
  mouseY,
  text,
}: AnimatedLetterProps) => {
  const [hovered, setHovered] = useState(false);
  const snap = useSnapshot(store);

  const letterRef = useRef<HTMLDivElement | null>(null);

  const [letterPosition, setLetterPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (letterRef.current) {
      const rect = letterRef.current.getBoundingClientRect();
      setLetterPosition({ x: rect.left, y: rect.top });
    }
  }, [char, lineIndex, charIndex]);

  const mouseDeltaX = mouseX - letterPosition.x;
  const mouseDeltaY = mouseY - letterPosition.y;

  const { opacity } = useSpring({
    opacity: snap.isLoading ? 0 : 1,
    config: { ...springConfig.molasses, duration: 800 },
    delay:
      !hovered || snap.isLoading
        ? (lineIndex * text.replace(/\n/g, '').length + charIndex) * 50
        : 0,
  });

  const { yOffset, xOffset } = useSpring({
    from: { yOffset: 0, xOffset: 0 },
    to: {
      yOffset:
        hovered || hoveredIndex === lineIndex * text.length + charIndex
          ? -mouseDeltaY / 15
          : 0,
      xOffset:
        hovered || hoveredIndex === lineIndex * text.length + charIndex
          ? -mouseDeltaX / 15
          : 0,
    },
    config: springConfig.wobbly,
  });

  const colorSpring = useSpring({
    from: { textShadow: '0px 0px 0px rgba(0,0,0,0)' },
    to: {
      textShadow:
        hovered || hoveredIndex === lineIndex * text.length + charIndex
          ? '-2px 10px 10px rgba(0,0,0,0.2)'
          : '0px 0px 0px rgba(0,0,0,0)',
    },
    config: springConfig.stiff,
  });

  const transformStyle = yOffset.to(
    (y) => `translateY(${y}px) translateX(${xOffset.get()}px)`
  );

  const handleMouseEnter = () => {
    setHovered(true);
    setHoveredIndex(lineIndex * text.length + charIndex);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setHoveredIndex(null);
  };

  const renderChar = char === ' ' ? '\u00A0' : char;

  return (
    <animated.h4
      className="pointer-events-auto relative text-textDark dark:text-textLight dark:transition-colors dark:duration-[1s]"
      style={{
        opacity,
        transform: transformStyle,
        textShadow: colorSpring.textShadow,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={letterRef}
    >
      {renderChar}
    </animated.h4>
  );
};

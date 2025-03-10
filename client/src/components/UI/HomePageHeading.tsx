import { useState, useEffect, useRef } from 'react';
import { useSpring, animated, config as springConfig } from '@react-spring/web';
import { useSnapshot } from 'valtio';
import store from '../../appStore';

const text = `CODE, COFFEE,\nBERLIN VIBES`;

const HomePageHeading = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const handleMouseMove = (event: React.MouseEvent) => {
    setMouseX(event.clientX);
    setMouseY(event.clientY);
  };

  return (
    <div
      className="absolute left-[2rem] bottom-[13.5vh] flex flex-wrap text-center text-[6.5vw] uppercase whitespace-pre-line select-none pointer-events-none"
      onMouseMove={handleMouseMove}
    >
      {text.split('\n').map((line, lineIndex) => (
        <div key={lineIndex} className="w-full flex leading-[7vw]">
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
  );
};

export default HomePageHeading;

interface AnimatedLetterProps {
  char: string;
  lineIndex: number;
  charIndex: number;
  setHoveredIndex: (index: number | null) => void;
  hoveredIndex: number | null;
  mouseX: number;
  mouseY: number;
}

const AnimatedLetter = ({
  char,
  lineIndex,
  charIndex,
  setHoveredIndex,
  hoveredIndex,
  mouseX,
  mouseY,
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
    opacity: snap.isLoading || snap.pageActive === 'Projects' ? 0 : 1,
    config: { ...springConfig.default, duration: 800 },
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
    from: { color: '#eeeeee', textShadow: '0px 0px 0px rgba(0,0,0,0)' },
    to: {
      color:
        hovered || hoveredIndex === lineIndex * text.length + charIndex
          ? '#ffffff'
          : '#eeeeee',
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
      className="pointer-events-auto relative"
      style={{
        opacity,
        transform: char === ',' ? 'none' : transformStyle, // No movement for commas
        color: char === ',' ? '#eeeeee' : colorSpring.color, // No color change for commas
        textShadow: char === ',' ? 'none' : colorSpring.textShadow, // No shadow change for commas
      }}
      onMouseEnter={char === ',' ? undefined : handleMouseEnter}
      onMouseLeave={char === ',' ? undefined : handleMouseLeave}
      ref={letterRef}
    >
      {renderChar}
    </animated.h4>
  );
};

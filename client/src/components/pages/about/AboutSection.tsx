import { animated } from '@react-spring/web';
import { LAYOUT } from './constants';
import { AboutSectionProps } from './types';
import AnimatedLetter from '../../UI/AnimatedLetter';
import { useState, useCallback } from 'react';

const AboutSection = ({
  title,
  content,
  scene,
  style,
  isActive,
}: AboutSectionProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMouseX(e.clientX);
    setMouseY(e.clientY);
  }, []);

  return (
    <animated.div
      style={style}
      className="w-fit h-fit absolute top-0 bottom-0 left-0 right-0 m-auto pointer-events-none"
      role="tabpanel"
      aria-label={title}
      onMouseMove={handleMouseMove}
    >
      <div
        className="text-textDark dark:text-textLight text-center"
        style={{ maxWidth: LAYOUT.section.maxWidth }}
      >
        <h2
          className="uppercase mb-[1vw] flex justify-center items-center"
          style={{
            fontSize: LAYOUT.section.titleSize,
            marginBottom: LAYOUT.section.titleMarginBottom,
          }}
        >
          {title.split('').map((char, index) => (
            <AnimatedLetter
              key={index}
              char={char}
              lineIndex={0}
              charIndex={index}
              setHoveredIndex={setHoveredIndex}
              hoveredIndex={hoveredIndex}
              mouseX={mouseX}
              mouseY={mouseY}
              delay={50}
              isActive={isActive}
            />
          ))}
        </h2>
        <div
          className="space-y-4"
          style={{ fontSize: LAYOUT.section.contentSize }}
        >
          {content}
        </div>
      </div>
      {scene && (
        <div className="w-full h-full">
          <div className="w-full h-full">{scene}</div>
        </div>
      )}
    </animated.div>
  );
};

export default AboutSection;

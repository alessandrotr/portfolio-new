import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AnimatedLetter from './AnimatedLetter';
import PrivacyPolicyLink from './PrivacyPolicyLink';

const Copyright = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const { t } = useTranslation();
  const text = t('copyright');

  const handleMouseMove = (event: React.MouseEvent) => {
    setMouseX(event.clientX);
    setMouseY(event.clientY);
  };

  return (
    <div className="absolute left-[1.5vw] bottom-[1vw] flex items-center gap-4">
      <div
        className="flex flex-wrap text-center text-[1vw] uppercase whitespace-pre-line select-none pointer-events-none"
        onMouseMove={handleMouseMove}
      >
        {text.split('\n').map((line, lineIndex) => (
          <h3
            key={lineIndex}
            className="w-full flex text-textDark dark:text-textLight"
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
      </div>
      <PrivacyPolicyLink />
    </div>
  );
};

export default Copyright;

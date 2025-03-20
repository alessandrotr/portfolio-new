import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useSnapshot } from 'valtio';
import store from '../../appStore';
import { useSpring, animated } from '@react-spring/web';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface NavigationLetterProps {
  char: string;
  lineIndex: number;
  charIndex: number;
  setHoveredIndex: (index: number | null) => void;
  hoveredIndex: number | null;
  mouseX: number;
  mouseY: number;
  delay?: number;
  isActive?: boolean;
  isSelected?: boolean;
}

export const NavigationLetter = ({
  char,
  lineIndex,
  charIndex,
  setHoveredIndex,
  hoveredIndex,
  mouseX,
  mouseY,
  delay = 50,
  isActive,
  isSelected = false,
}: NavigationLetterProps) => {
  const [hovered, setHovered] = useState(false);
  const snap = useSnapshot(store);
  const letterRef = useRef<HTMLSpanElement | null>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>();
  const lastHoveredRef = useRef(false);

  const updatePosition = useCallback(() => {
    if (letterRef.current) {
      const rect = letterRef.current.getBoundingClientRect();
      positionRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }
    rafRef.current = requestAnimationFrame(updatePosition);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(updatePosition);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updatePosition]);

  const mouseDeltaX = mouseX - positionRef.current.x;
  const mouseDeltaY = mouseY - positionRef.current.y;

  const distance = Math.sqrt(
    mouseDeltaX * mouseDeltaX + mouseDeltaY * mouseDeltaY
  );
  const maxDistance = 150;
  const normalizedDistance = Math.min(distance / maxDistance, 1);
  const effectStrength = Math.pow(1 - normalizedDistance, 2);

  const waveDelay = 50;

  const { opacity } = useSpring({
    opacity:
      isActive !== undefined ? (isActive ? 1 : 0) : snap.isLoading ? 0 : 1,
    config: { duration: 800 },
    delay: snap.isLoading ? (lineIndex * 100 + charIndex) * delay : 0,
  });

  const { transform } = useSpring({
    from: { transform: 'translate(0px, 0px) scale(1)' },
    to: {
      transform:
        hovered || hoveredIndex === lineIndex * 100 + charIndex
          ? `translate(${-mouseDeltaX * effectStrength * 0.15}px, ${
              -mouseDeltaY * effectStrength * 0.15
            }px) scale(${1 + effectStrength * 0.1})`
          : 'translate(0px, 0px) scale(1)',
    },
    config: {
      tension: 180,
      friction: 12,
      mass: 0.8,
    },
    delay: !hovered && lastHoveredRef.current ? waveDelay : 0,
    immediate: false,
  });

  const { textShadow } = useSpring({
    from: { textShadow: '0px 0px 0px rgba(0,0,0,0)' },
    to: {
      textShadow:
        hovered || hoveredIndex === lineIndex * 100 + charIndex
          ? `-2px 10px 10px rgba(0,0,0,${0.15 * effectStrength})`
          : '0px 0px 0px rgba(0,0,0,0)',
    },
    config: {
      tension: 200,
      friction: 15,
    },
    delay: !hovered && lastHoveredRef.current ? waveDelay : 0,
  });

  const { fillProgress } = useSpring({
    from: { fillProgress: 0 },
    to: {
      fillProgress:
        hovered || hoveredIndex === lineIndex * 100 + charIndex || isSelected
          ? 1
          : 0,
    },
    config: {
      mass: 1,
      tension: 280,
      friction: 30,
    },
    delay: !hovered ? waveDelay : 0,
  });

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    setHoveredIndex(charIndex);
    lastHoveredRef.current = true;
  }, [charIndex, setHoveredIndex]);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    lastHoveredRef.current = false;
  }, []);

  const renderChar = char === ' ' ? '\u00A0' : char;

  return (
    <animated.span
      className="relative text-textDark dark:text-textLight dark:transition-colors dark:duration-[1s] select-none"
      style={{
        opacity,
        transform: char === ',' ? 'none' : transform,
        textShadow: char === ',' ? 'none' : textShadow,
        position: 'relative',
        display: 'inline-block',
      }}
      onMouseEnter={char === ',' ? undefined : handleMouseEnter}
      onMouseLeave={char === ',' ? undefined : handleMouseLeave}
      ref={letterRef}
    >
      <span className="relative inline-block">
        <span className="relative" style={{ color: 'currentColor' }}>
          {renderChar}
        </span>
        {char !== ',' && (
          <animated.span
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              color: snap.selectedColor,
              clipPath: fillProgress.to((p) => `inset(${100 - p * 100}% 0 0)`),
              zIndex: 1,
            }}
          >
            {renderChar}
          </animated.span>
        )}
      </span>
    </animated.span>
  );
};

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

  const projectsText = t('navigation.projects');
  const aboutText = t('navigation.about');
  const contactText = t('navigation.contact');

  return (
    <div
      className="fixed top-[1.6vw] right-[7vw] flex gap-[1.75vw] z-[20] pointer-events-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <h3
        className="text-[1.1vw] uppercase cursor-pointer"
        onClick={() => navigate(`/${currentLanguage}/projects`)}
      >
        {projectsText.split('').map((char, charIndex) => (
          <NavigationLetter
            key={`projects-${charIndex}`}
            char={char}
            lineIndex={0}
            charIndex={charIndex + 100}
            mouseX={mouseX}
            mouseY={mouseY}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            isSelected={location.pathname.includes('/projects')}
          />
        ))}
      </h3>
      <h3
        className="text-[1.1vw] uppercase cursor-pointer"
        onClick={() => navigate(`/${currentLanguage}/about`)}
      >
        {aboutText.split('').map((char, charIndex) => (
          <NavigationLetter
            key={`about-${charIndex}`}
            char={char}
            lineIndex={0}
            charIndex={charIndex + 200}
            mouseX={mouseX}
            mouseY={mouseY}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            isSelected={location.pathname.includes('/about')}
          />
        ))}
      </h3>
      <h3
        className="text-[1.1vw] uppercase cursor-pointer"
        onClick={() => navigate(`/${currentLanguage}/contact`)}
      >
        {contactText.split('').map((char, charIndex) => (
          <NavigationLetter
            key={`contact-${charIndex}`}
            char={char}
            lineIndex={0}
            charIndex={charIndex + 300}
            mouseX={mouseX}
            mouseY={mouseY}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            isSelected={location.pathname.includes('/contact')}
          />
        ))}
      </h3>
    </div>
  );
};

export default Navigation;

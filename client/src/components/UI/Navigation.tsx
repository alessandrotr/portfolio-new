import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useSnapshot } from 'valtio';
import store from '../../appStore';
import { useSpring, animated } from '@react-spring/web';

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

const NavigationLetter = ({
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
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const snap = useSnapshot(store);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleRouteChange = () => {
      setSelectedIndex(null);
      setHoveredIndex(null);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/projects')) setSelectedIndex(0);
    else if (currentPath.includes('/about')) setSelectedIndex(1);
    else if (currentPath.includes('/contact')) setSelectedIndex(2);
    else setSelectedIndex(null);
  }, [window.location.pathname]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  return (
    <div
      className="fixed top-[1.5vw] right-[7vw] flex gap-[1.75vw] z-[20] pointer-events-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <h3
        onClick={() => {
          setSelectedIndex(0);
          setHoveredIndex(null);
          navigate(`/${currentLanguage}/projects`);
        }}
        onMouseLeave={handleMouseLeave}
        className="text-textDark dark:text-textLight transition-colors duration-300 text-[1.25vw] uppercase select-none tracking-[1px] cursor-pointer relative"
      >
        {'Projects'.split('').map((char, charIndex) => (
          <NavigationLetter
            key={charIndex}
            char={char}
            lineIndex={0}
            charIndex={charIndex + 100}
            setHoveredIndex={setHoveredIndex}
            hoveredIndex={hoveredIndex}
            mouseX={mousePosition.x}
            mouseY={mousePosition.y}
            delay={50}
            isActive={!snap.isLoading}
            isSelected={selectedIndex === 0}
          />
        ))}
      </h3>

      <h3
        onClick={() => {
          setSelectedIndex(1);
          setHoveredIndex(null);
          navigate(`/${currentLanguage}/about`);
        }}
        onMouseLeave={handleMouseLeave}
        className="text-textDark dark:text-textLight transition-colors duration-300 text-[1.25vw] uppercase select-none tracking-[1px] cursor-pointer relative"
      >
        {'About'.split('').map((char, charIndex) => (
          <NavigationLetter
            key={charIndex}
            char={char}
            lineIndex={0}
            charIndex={charIndex + 200}
            setHoveredIndex={setHoveredIndex}
            hoveredIndex={hoveredIndex}
            mouseX={mousePosition.x}
            mouseY={mousePosition.y}
            delay={50}
            isActive={!snap.isLoading}
            isSelected={selectedIndex === 1}
          />
        ))}
      </h3>

      <h3
        onClick={() => {
          setSelectedIndex(2);
          setHoveredIndex(null);
          navigate(`/${currentLanguage}/contact`);
        }}
        onMouseLeave={handleMouseLeave}
        className="text-textDark dark:text-textLight transition-colors duration-300 text-[1.25vw] uppercase select-none tracking-[1px] cursor-pointer relative"
      >
        {'Contact'.split('').map((char, charIndex) => (
          <NavigationLetter
            key={charIndex}
            char={char}
            lineIndex={0}
            charIndex={charIndex + 300}
            setHoveredIndex={setHoveredIndex}
            hoveredIndex={hoveredIndex}
            mouseX={mousePosition.x}
            mouseY={mousePosition.y}
            delay={50}
            isActive={!snap.isLoading}
            isSelected={selectedIndex === 2}
          />
        ))}
      </h3>
    </div>
  );
};

export default Navigation;

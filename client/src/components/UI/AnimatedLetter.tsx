import { useState, useEffect, useRef, useCallback } from 'react';
import { useSpring, animated, config as springConfig } from '@react-spring/web';
import { useSnapshot } from 'valtio';
import store from '../../appStore';

interface AnimatedLetterProps {
  char: string;
  lineIndex: number;
  charIndex: number;
  setHoveredIndex: (index: number | null) => void;
  hoveredIndex: number | null;
  mouseX: number;
  mouseY: number;
  delay?: number;
  className?: string;
  isActive?: boolean;
}

const AnimatedLetter = ({
  char,
  lineIndex,
  charIndex,
  setHoveredIndex,
  hoveredIndex,
  mouseX,
  mouseY,
  delay = 50,
  className = '',
  isActive,
}: AnimatedLetterProps) => {
  const [hovered, setHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const snap = useSnapshot(store);
  const letterRef = useRef<HTMLSpanElement | null>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>();
  const lastHoveredRef = useRef(false);

  // Check for touch device on mount
  useEffect(() => {
    const checkTouchDevice = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(hasTouch);
    };

    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

  // Update position using requestAnimationFrame for smooth updates
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
    if (!isTouchDevice) {
      rafRef.current = requestAnimationFrame(updatePosition);
    }
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updatePosition, isTouchDevice]);

  const mouseDeltaX = mouseX - positionRef.current.x;
  const mouseDeltaY = mouseY - positionRef.current.y;

  // Calculate distance for smoother falloff with exponential easing
  const distance = Math.sqrt(
    mouseDeltaX * mouseDeltaX + mouseDeltaY * mouseDeltaY
  );
  const maxDistance = 150;
  const normalizedDistance = Math.min(distance / maxDistance, 1);
  const effectStrength = Math.pow(1 - normalizedDistance, 2);

  // Calculate wave delay based on position
  const waveDelay = (lineIndex * 100 + charIndex) * 20;

  const { opacity } = useSpring({
    opacity:
      isActive !== undefined ? (isActive ? 1 : 0) : snap.isLoading ? 0 : 1,
    config: { ...springConfig.molasses, duration: 800 },
    delay:
      !hovered || (isActive !== undefined ? !isActive : snap.isLoading)
        ? (lineIndex * 100 + charIndex) * delay + (isActive ? 500 : 0)
        : 0,
  });

  const { transform } = useSpring({
    from: { transform: 'translate(0px, 0px) scale(1)' },
    to: {
      transform:
        !isTouchDevice &&
        (hovered || hoveredIndex === lineIndex * 100 + charIndex)
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
        !isTouchDevice &&
        (hovered || hoveredIndex === lineIndex * 100 + charIndex)
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
        !isTouchDevice &&
        (hovered || hoveredIndex === lineIndex * 100 + charIndex)
          ? 1
          : 0,
    },
    config: {
      mass: 1,
      tension: 280,
      friction: 60,
    },
    delay: !hovered && lastHoveredRef.current ? waveDelay : 0,
  });

  const handleMouseEnter = useCallback(() => {
    if (!isTouchDevice) {
      setHovered(true);
      setHoveredIndex(lineIndex * 100 + charIndex);
      lastHoveredRef.current = true;
    }
  }, [lineIndex, charIndex, setHoveredIndex, isTouchDevice]);

  const handleMouseLeave = useCallback(() => {
    if (!isTouchDevice) {
      setHovered(false);
      setHoveredIndex(null);
    }
  }, [setHoveredIndex, isTouchDevice]);

  const renderChar = char === ' ' ? '\u00A0' : char;

  return (
    <animated.span
      className={`pointer-events-auto relative text-textDark dark:text-textLight dark:transition-colors dark:duration-[1s] select-none ${className}`}
      style={{
        opacity,
        transform: char === ',' ? 'none' : transform,
        textShadow: char === ',' ? 'none' : textShadow,
        position: 'relative',
        display: 'inline-block',
      }}
      onMouseEnter={
        char === ',' || isTouchDevice ? undefined : handleMouseEnter
      }
      onMouseLeave={
        char === ',' || isTouchDevice ? undefined : handleMouseLeave
      }
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

export default AnimatedLetter;

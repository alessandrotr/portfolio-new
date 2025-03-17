import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { animated, useSpring } from '@react-spring/web';
import { useSnapshot } from 'valtio';
import store from '../../../appStore';
import { useState, useCallback, memo } from 'react';
import { Tooltip } from 'react-tooltip';
import { ANIMATION_CONFIG, CHEVRON_SIZE, LAYOUT } from './constants';
import { NavigationChevronsProps } from './types';

const NavigationChevrons: React.FC<NavigationChevronsProps> = memo(
  ({
    canGoUp: canGoPrev,
    canGoDown: canGoNext,
    onUpClick: onPrevClick,
    onDownClick: onNextClick,
    prevSectionName = '',
    nextSectionName = '',
  }) => {
    const snap = useSnapshot(store);
    const [hoveredPrev, setHoveredPrev] = useState(false);
    const [hoveredNext, setHoveredNext] = useState(false);

    const handlePrevEnter = useCallback(() => setHoveredPrev(true), []);
    const handlePrevLeave = useCallback(() => setHoveredPrev(false), []);
    const handleNextEnter = useCallback(() => setHoveredNext(true), []);
    const handleNextLeave = useCallback(() => setHoveredNext(false), []);

    const prevSpring = useSpring({
      opacity: canGoPrev ? 1 : 0,
      transform: `translateX(${canGoPrev ? '0%' : '-50%'})`,
      config: ANIMATION_CONFIG.default,
    });

    const nextSpring = useSpring({
      opacity: canGoNext ? 1 : 0,
      transform: `translateX(${canGoNext ? '0%' : '50%'})`,
      config: ANIMATION_CONFIG.default,
    });

    const commonButtonClasses = `
    w-${CHEVRON_SIZE.width} 
    h-${CHEVRON_SIZE.height} 
    rounded-full 
    bg-borderLightTransparent 
    dark:bg-borderDarkTransparent 
    backdrop-blur-sm 
    flex 
    items-center 
    justify-center 
    transition-colors 
    duration-300
    p-[1vw]
  `;

    const commonTooltipClasses = `
    bg-borderLightTransparent 
    dark:bg-borderDarkTransparent 
    backdrop-blur-sm 
    !text-textDark
    dark:!text-textLight 
    !px-3 
    !py-2 
    !rounded-lg 
    !text-[1vw] 
    uppercase
  `;

    return (
      <>
        <div
          className="fixed top-1/2 -translate-y-1/2 z-50 pointer-events-auto"
          style={{ left: LAYOUT.chevrons.horizontalOffset }}
        >
          <animated.button
            style={prevSpring}
            onClick={onPrevClick}
            onMouseEnter={handlePrevEnter}
            onMouseLeave={handlePrevLeave}
            className={`${commonButtonClasses} ${
              !canGoPrev && 'pointer-events-none'
            }`}
            aria-label={`Navigate to previous section${
              prevSectionName ? `: ${prevSectionName}` : ''
            }`}
            disabled={!canGoPrev}
            data-tooltip-id="prev-section-tooltip"
            data-tooltip-content={prevSectionName}
          >
            <HiChevronLeft
              className="w-[1.35vw] h-[1.35vw] transition-colors duration-300 text-textDark dark:text-textLight"
              style={{ color: hoveredPrev ? snap.selectedColor : undefined }}
            />
          </animated.button>
          <Tooltip
            id="prev-section-tooltip"
            place="right"
            className={commonTooltipClasses}
            style={{
              visibility: canGoPrev && prevSectionName ? 'visible' : 'hidden',
            }}
          />
        </div>

        <div
          className="fixed top-1/2 -translate-y-1/2 z-50 pointer-events-auto"
          style={{ right: LAYOUT.chevrons.horizontalOffset }}
        >
          <animated.button
            style={nextSpring}
            onClick={onNextClick}
            onMouseEnter={handleNextEnter}
            onMouseLeave={handleNextLeave}
            className={`${commonButtonClasses} ${
              !canGoNext && 'pointer-events-none'
            }`}
            aria-label={`Navigate to next section${
              nextSectionName ? `: ${nextSectionName}` : ''
            }`}
            disabled={!canGoNext}
            data-tooltip-id="next-section-tooltip"
            data-tooltip-content={nextSectionName}
          >
            <HiChevronRight
              className="w-[1.35vw] h-[1.35vw] transition-colors duration-300 text-textDark dark:text-textLight"
              style={{ color: hoveredNext ? snap.selectedColor : undefined }}
            />
          </animated.button>
          <Tooltip
            id="next-section-tooltip"
            place="left"
            className={commonTooltipClasses}
            style={{
              visibility: canGoNext && nextSectionName ? 'visible' : 'hidden',
            }}
          />
        </div>
      </>
    );
  }
);

NavigationChevrons.displayName = 'NavigationChevrons';

export default NavigationChevrons;

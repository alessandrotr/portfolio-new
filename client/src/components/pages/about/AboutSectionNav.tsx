import { useCallback, useRef, useEffect, useState } from 'react';
import { LAYOUT } from './constants';
import { AboutSectionNavProps } from './types';

const AboutSectionNav = ({
  sections,
  currentSection,
  onSectionChange,
}: AboutSectionNavProps) => {
  const [backgroundStyles, setBackgroundStyles] = useState({
    width: 0,
    left: 0,
  });
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const navRef = useRef<HTMLUListElement>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  const updateBackgroundPosition = useCallback(() => {
    const activeButton = buttonsRef.current[currentSection];
    const navElement = navRef.current;

    if (activeButton && navElement) {
      const buttonRect = activeButton.getBoundingClientRect();
      const navRect = navElement.getBoundingClientRect();

      setBackgroundStyles({
        width: buttonRect.width,
        left: buttonRect.left - navRect.left,
      });
    }
  }, [currentSection]);

  // Set up observers and event listeners to handle dynamic updates
  useEffect(() => {
    const navElement = navRef.current;

    if (navElement) {
      // Create ResizeObserver for the nav element
      observerRef.current = new ResizeObserver(() => {
        updateBackgroundPosition();
      });

      observerRef.current.observe(navElement);

      // Add window resize listener
      const handleResize = () => {
        updateBackgroundPosition();
      };
      window.addEventListener('resize', handleResize);

      // Add orientation change listener
      const handleOrientationChange = () => {
        // Small delay to ensure layout is updated
        setTimeout(updateBackgroundPosition, 100);
      };
      window.addEventListener('orientationchange', handleOrientationChange);

      // Initial position update
      updateBackgroundPosition();

      // Update position after a short delay to ensure proper layout
      const timeoutId = setTimeout(updateBackgroundPosition, 100);

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
        window.removeEventListener('resize', handleResize);
        window.removeEventListener(
          'orientationchange',
          handleOrientationChange
        );
        clearTimeout(timeoutId);
      };
    }
  }, [updateBackgroundPosition]);

  // Update position when section changes or sections array changes
  useEffect(() => {
    updateBackgroundPosition();
  }, [currentSection, sections, updateBackgroundPosition]);

  const handleSectionClick = useCallback(
    (index: number) => {
      onSectionChange(index);
    },
    [onSectionChange]
  );

  return (
    <nav
      className="fixed w-full left-0 right-0 pointer-events-auto"
      style={{ top: LAYOUT.navigation.top }}
      role="tablist"
      aria-label="About sections navigation"
    >
      <ul
        ref={navRef}
        className="flex gap-4 justify-center items-center relative"
      >
        <div
          className="absolute h-full bg-borderLightTransparent dark:bg-borderDarkTransparent rounded-lg transform scale-y-110 transition-all duration-300 ease-in-out"
          style={{
            width: `${backgroundStyles.width}px`,
            left: `${backgroundStyles.left}px`,
          }}
          aria-hidden="true"
        />
        {sections.map((section, index) => (
          <li key={section.id} className="relative">
            <button
              ref={(el) => (buttonsRef.current[index] = el)}
              onClick={() => handleSectionClick(index)}
              className={`relative px-4 py-2 text-[1vw] uppercase transition-all duration-300 select-none
                ${
                  currentSection === index
                    ? 'text-textDark dark:text-textLight'
                    : 'text-textDark/50 dark:text-textLight/50 hover:text-textDark dark:hover:text-textLight'
                }
              `}
              role="tab"
              aria-selected={currentSection === index}
              aria-controls={`section-${section.id}`}
            >
              <span className="relative z-10">{section.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AboutSectionNav;

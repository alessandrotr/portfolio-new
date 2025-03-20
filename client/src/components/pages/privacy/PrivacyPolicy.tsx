import { useTranslation } from 'react-i18next';
import { animated, useSpring } from '@react-spring/web';
import { useSnapshot } from 'valtio';
import store from '../../../appStore';
import { createPortal } from 'react-dom';
import AnimatedLetter from '../../UI/common/ui-utils/AnimatedLetter';
import { useState, useEffect } from 'react';

interface ContentSection {
  type: 'title' | 'paragraph' | 'list';
  content: string | string[];
}

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const snap = useSnapshot(store);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  const [springs] = useSpring(() => ({
    from: { opacity: 0, y: 1000 },
    to: { opacity: 1, y: 0 },
    config: { tension: 300, friction: 30 },
  }));

  // Add mouse move handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Trigger animation on mount
  useEffect(() => {
    setIsActive(true);
    return () => setIsActive(false);
  }, []);

  const renderContent = (section: ContentSection | string, index: number) => {
    // Handle string format (old format)
    if (typeof section === 'string') {
      if (section.startsWith('•')) {
        return (
          <li key={index} className="list-disc pl-6 mb-2">
            {section.substring(1).trim()}
          </li>
        );
      }
      // Check if it's a title (no bullet points and shorter text)
      if (section.length < 50 && !section.includes('.')) {
        return (
          <h3 key={index} className="text-[1vw] uppercase mb-4 mt-8 first:mt-0">
            {section}
          </h3>
        );
      }
      return (
        <p key={index} className="whitespace-pre-wrap mb-4 text-[1vw]">
          {section}
        </p>
      );
    }

    // Handle ContentSection format (new format)
    switch (section.type) {
      case 'title':
        return (
          <h3
            key={index}
            className="text-[1.5vw] uppercase mb-4 mt-8 first:mt-0"
          >
            {section.content as string}
          </h3>
        );
      case 'list':
        return (
          <ul
            key={index}
            className="list-disc pl-6 mb-4 space-y-2 dark:text-gray-400 text-gray-600"
          >
            {(section.content as string[]).map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        );
      case 'paragraph':
      default:
        return (
          <p
            key={index}
            className="whitespace-pre-wrap mb-4 text-[1vw] dark:text-gray-400 text-gray-600"
          >
            {section.content as string}
          </p>
        );
    }
  };

  const content = t('privacyPolicy.content', {
    returnObjects: true,
  }) as (ContentSection | string)[];

  const contentPortal = (
    <animated.div
      style={{
        ...springs,
        position: 'fixed',
        bottom: 0,
        top: 0,
        margin: 'auto',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '65%',
        maxWidth: '1150px',
        height: '75vh',
      }}
      className="z-[4] drop-shadow rounded-[25px] border-2 border-borderLightTransparent dark:border-borderDarkTransparent p-[15px]"
    >
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 0 4px 4px 0;
          }
          .dark .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: ${snap.selectedColor}80;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${snap.selectedColor}B3;
            cursor: grab;
            opacity: 0.8;
          }
        `}
      </style>
      <div className="relative w-full h-full">
        <div className="w-full h-full overflow-hidden">
          <div className="w-full h-full rounded-[20px] bg-bgLightTransparent dark:bg-bgDarkTransparent">
            <div className="w-full h-full overflow-y-auto custom-scrollbar">
              <div className="px-[2.5vw] pr-[4vw] pt-[1vw]">
                <h2 className="text-textDark dark:text-textLight transition-colors duration-300 text-[3.5vw] uppercase select-none mb-6">
                  {t('privacyPolicy.title')
                    .split('')
                    .map((char, index) => (
                      <AnimatedLetter
                        key={index}
                        char={char}
                        lineIndex={0}
                        charIndex={index}
                        setHoveredIndex={setHoveredIndex}
                        hoveredIndex={hoveredIndex}
                        mouseX={mousePosition.x}
                        mouseY={mousePosition.y}
                        delay={50}
                        isActive={isActive}
                      />
                    ))}
                </h2>
                <div className="space-y-4 text-[1vw] text-textDark dark:text-textLight pb-[2.5vw]">
                  {content.map((section, index) =>
                    renderContent(section, index)
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  );

  return createPortal(contentPortal, document.body);
};

export default PrivacyPolicy;

import { useEffect, useMemo, useRef } from 'react';
import { useSnapshot } from 'valtio';
import store from '../../../appStore';
import { animated } from '@react-spring/web';
import AboutSectionNav from './AboutSectionNav';
import AboutSection from './AboutSection';
import NavigationChevrons from './NavigationChevrons';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useNavigation } from './hooks/useNavigation';
import { useAboutAnimations } from './hooks/useAboutAnimations';
import { useUrlSync } from './hooks/useUrlSync';
import { useSceneManagement } from './hooks/useSceneManagement';
import { useSections } from './hooks/useSections';

const AboutPage = () => {
  const snap = useSnapshot(store);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { sectionId } = useParams<{ sectionId?: string }>();
  const isUrlUpdateRef = useRef(false);
  const { currentLanguage } = useLanguage();

  // Custom hooks for managing different aspects of the page
  const sections = useSections({ t });
  const initialSectionIndex = useMemo(() => {
    if (!sectionId) return 0;
    const index = sections.findIndex((section) => section.id === sectionId);
    if (index === -1) {
      if (!isUrlUpdateRef.current) {
        isUrlUpdateRef.current = true;
        navigate('/about/who', { replace: true });
      }
      return 0;
    }
    return index;
  }, [sectionId, sections, navigate]);

  const {
    currentSection,
    handleSectionChange,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleUpClick,
    handleDownClick,
    setCurrentSection,
  } = useNavigation({
    totalSections: sections.length,
    initialSection: initialSectionIndex,
  });

  useUrlSync({
    currentSection,
    sections,
    sectionId,
    navigate,
    currentLanguage,
    isUrlUpdateRef,
  });

  // Section synchronization
  useEffect(() => {
    if (!isUrlUpdateRef.current && initialSectionIndex !== currentSection) {
      setCurrentSection(initialSectionIndex);
    }
    isUrlUpdateRef.current = false;
  }, [initialSectionIndex, currentSection, setCurrentSection]);

  // Animations
  const { containerSpring, sectionSprings } = useAboutAnimations({
    isLoading: snap.isLoading,
    currentSection,
    sections,
  });

  // Scene management
  const currentSceneId = useMemo(
    () =>
      sections[currentSection]?.sceneId as
        | 'who'
        | 'berlin'
        | 'naples'
        | 'what'
        | 'hobbies'
        | null,
    [sections, currentSection]
  );

  useSceneManagement(currentSceneId);

  return (
    <div
      id="about-container"
      className="w-full h-full flex flex-col items-center justify-center fixed top-0 left-0 overflow-hidden xl:pointer-events-none"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      role="region"
      aria-label="About page sections"
    >
      <NavigationChevrons
        canGoUp={currentSection > 0}
        canGoDown={currentSection < sections.length - 1}
        onUpClick={handleUpClick}
        onDownClick={handleDownClick}
        prevSectionName={
          currentSection > 0 ? sections[currentSection - 1].title : ''
        }
        nextSectionName={
          currentSection < sections.length - 1
            ? sections[currentSection + 1].title
            : ''
        }
      />
      <animated.div
        style={{
          transform: containerSpring.y.to((y) => `translateY(${y})`),
          opacity: containerSpring.opacity,
        }}
        className="w-full h-full relative flex flex-col items-center justify-center"
      >
        <AboutSectionNav
          sections={sections}
          currentSection={currentSection}
          onSectionChange={handleSectionChange}
        />

        {sections.map((section, index) => (
          <AboutSection
            key={section.id}
            title={section.title}
            content={section.content}
            style={sectionSprings[index]}
          />
        ))}
      </animated.div>
    </div>
  );
};

export default AboutPage;

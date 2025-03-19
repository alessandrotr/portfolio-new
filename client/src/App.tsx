import ProjectsPage from './components/pages/projects/ProjectsPage';
import ContactPage from './components/pages/contact/ContactPage';
import AboutPage from './components/pages/about/AboutPage';
import 'react-tooltip/dist/react-tooltip.css';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';
import Logo from './components/UI/Logo';
import Copyright from './components/UI/Copyright';
import BackgroundThemeSwitch from './components/3d/background/BackgroundThemeSwitch';
import SettingsBar from './components/UI/Settings/SettingsBar';
import useTheme from './hooks/useTheme';
import { Toaster } from 'react-hot-toast';
import PrivacyPolicy from './components/pages/privacy/PrivacyPolicy';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import HomePage from './components/pages/home/HomePage';
import store from './appStore';
import LoadingScreen from './components/UI/LoadingScreen';
import { LanguageProvider } from './contexts/LanguageContext';
import { CANVAS_CONFIG } from './config/canvas';
import { TOASTER_CONFIG } from './config/toaster';
import {
  SUPPORTED_LANGUAGES,
  getDefaultLanguage,
  type SupportedLanguage,
} from './config/languages';
import './styles/toaster.css';
import DotSphere from './components/3d/background/DotSphere';
import OrbitCameraControls from './components/3d/controls/OrbitCameraControls';

const App: React.FC = () => {
  useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      store.isLoading = false;
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Handle mobile viewport height
  useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();

    const handleResize = () => {
      setViewportHeight();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const renderRoutes = (lang: SupportedLanguage) => (
    <>
      <Route path={`/${lang}`} element={<HomePage />} />
      <Route path={`/${lang}/projects`} element={<ProjectsPage />} />
      <Route path={`/${lang}/contact`} element={<ContactPage />} />
      <Route path={`/${lang}/about`} element={<AboutPage />} />
      <Route path={`/${lang}/about/:sectionId`} element={<AboutPage />} />
      <Route path={`/${lang}/privacy-policy`} element={<PrivacyPolicy />} />
    </>
  );

  return (
    <Router>
      <LanguageProvider>
        <div className="relative w-full h-screen overflow-hidden">
          <Toaster {...TOASTER_CONFIG} />

          <Canvas {...CANVAS_CONFIG}>
            <Suspense fallback={''}>
              <DotSphere />
              <BackgroundThemeSwitch />
              <OrbitCameraControls />
            </Suspense>
          </Canvas>

          <LoadingScreen />
          <Logo />
          <Copyright />
          <SettingsBar />
          <Routes>
            <Route
              path="/"
              element={<Navigate to={`/${getDefaultLanguage()}`} replace />}
            />

            {SUPPORTED_LANGUAGES.map(renderRoutes)}

            <Route
              path="*"
              element={<Navigate to={`/${getDefaultLanguage()}`} replace />}
            />
          </Routes>
        </div>
      </LanguageProvider>
    </Router>
  );
};

export default App;

// import HomePage from './components/pages/home/HomePage';
import ProjectsPage from './components/pages/projects/ProjectsPage';
import ContactPage from './components/pages/contact/ContactPage';
import AboutPage from './components/pages/about/AboutPage';
import 'react-tooltip/dist/react-tooltip.css';
import { Canvas } from '@react-three/fiber';
import DotGridBackground from './components/3d/background/DotGridBackground';
// import SignUp from './SignUp';
import * as THREE from 'three';
import { Suspense, useEffect } from 'react';
import Lights from './components/3d/lights/Lights';
// import HomePageHeading from './components/UI/HomePageHeading';
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

const App = () => {
  useTheme();

  useEffect(() => {
    setTimeout(() => {
      store.isLoading = false;
    }, 2000);
  }, []);

  // Get user's preferred language or default to 'en'
  const getDefaultLanguage = () => {
    const browserLang = navigator.language.split('-')[0];
    return ['en', 'it', 'de'].includes(browserLang) ? browserLang : 'en';
  };

  return (
    <Router>
      <LanguageProvider>
        <div className="relative w-full h-full">
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-text)',
                border: '1px solid var(--toast-border)',
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '0.9vw',
              },
              success: {
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <style>
            {`
              :root {
                --toast-bg: rgba(255, 255, 255, 0.9);
                --toast-text: #1a1a1a;
                --toast-border: rgba(0, 0, 0, 0.2);
              }
              
              .dark {
                --toast-bg: rgba(22, 22, 22, 0.9);
                --toast-text: #ffffff;
                --toast-border: rgba(255, 255, 255, 0.1);
              }
            `}
          </style>
          <Canvas
            style={{
              height: '100vh',
              width: '100vw',
            }}
            className="bg-bgLight dark:bg-bgDark"
            camera={{
              position: [0, 0, 15],
            }}
            gl={{
              alpha: true,
              antialias: true,
              powerPreference: 'high-performance',
              outputColorSpace: THREE.SRGBColorSpace,
              toneMapping: THREE.NoToneMapping,
            }}
            id="canvas"
            flat
          >
            <Suspense fallback={''}>
              <DotGridBackground />
              <BackgroundThemeSwitch />
              <Lights />
            </Suspense>
          </Canvas>
          <LoadingScreen />
          <Logo />
          <Copyright />
          <SettingsBar />
          {/* <SignUp /> */}
          <Routes>
            {/* Redirect root to preferred language */}
            <Route
              path="/"
              element={<Navigate to={`/${getDefaultLanguage()}`} replace />}
            />

            {/* English routes */}
            <Route path="/en" element={<HomePage />} />
            <Route path="/en/projects" element={<ProjectsPage />} />
            <Route path="/en/contact" element={<ContactPage />} />
            <Route path="/en/about" element={<AboutPage />} />
            <Route path="/en/about/:sectionId" element={<AboutPage />} />
            <Route path="/en/privacy-policy" element={<PrivacyPolicy />} />

            {/* Italian routes */}
            <Route path="/it" element={<HomePage />} />
            <Route path="/it/projects" element={<ProjectsPage />} />
            <Route path="/it/contact" element={<ContactPage />} />
            <Route path="/it/about" element={<AboutPage />} />
            <Route path="/it/about/:sectionId" element={<AboutPage />} />
            <Route path="/it/privacy-policy" element={<PrivacyPolicy />} />

            {/* German routes */}
            <Route path="/de" element={<HomePage />} />
            <Route path="/de/projects" element={<ProjectsPage />} />
            <Route path="/de/contact" element={<ContactPage />} />
            <Route path="/de/about" element={<AboutPage />} />
            <Route path="/de/about/:sectionId" element={<AboutPage />} />
            <Route path="/de/privacy-policy" element={<PrivacyPolicy />} />

            {/* Redirect any unknown routes to preferred language */}
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

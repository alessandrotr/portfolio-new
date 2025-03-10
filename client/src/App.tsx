import LoadingScreen from './components/UI/LoadingScreen';
// import HomePage from './components/pages/home/HomePage';
import ProjectsPage from './components/pages/projects/ProjectsPage';
import 'react-tooltip/dist/react-tooltip.css';
import { Canvas } from '@react-three/fiber';
import DotGridBackground from './components/3d/DotGridBackground';
// import SignUp from './SignUp';
import * as THREE from 'three';
import { Suspense } from 'react';
import Lights from './components/3d/Lights';
import ContactForm from './components/UI/ContactForm';
// import HomePageHeading from './components/UI/HomePageHeading';
import Logo from './components/UI/Logo';
import Copyright from './components/UI/Copyright';
import BackgroundThemeSwitch from './components/3d/BackgroundThemeSwitch';
import SettingsBar from './components/UI/Settings/SettingsBar';
import useTheme from './hooks/useTheme';
import { Toaster } from 'react-hot-toast';
import PrivacyPolicy from './components/pages/privacy/PrivacyPolicy';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/home/HomePage';

const App = () => {
  useTheme();

  return (
    <Router>
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
              fontSize: '14px',
              fontWeight: '500',
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
              --toast-border: rgba(0, 0, 0, 0.1);
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
            {/* <OrbitCameraControls /> */}
          </Suspense>
        </Canvas>
        <Logo />
        <Copyright />
        {/* <HomePageHeading /> */}
        <LoadingScreen />
        {/* <HomePage /> */}
        <ContactForm />
        <SettingsBar />
        {/* <SignUp /> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

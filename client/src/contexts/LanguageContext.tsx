import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import i18n from '../i18n';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);

    // Update URL to reflect language change while maintaining the current path
    const currentPath = location.pathname;
    const pathParts = currentPath.split('/').filter(Boolean);
    const newPath =
      pathParts.length > 1
        ? `/${lang}/${pathParts.slice(1).join('/')}`
        : `/${lang}`;

    navigate(newPath);
  };

  useEffect(() => {
    // Extract language from URL path
    const pathLang = location.pathname.split('/')[1];
    if (['en', 'it', 'de'].includes(pathLang) && pathLang !== currentLanguage) {
      changeLanguage(pathLang);
    }
  }, [location.pathname]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();

  const navigateWithLanguage = (path: string) => {
    navigate(`/${currentLanguage}${path}`);
  };

  return (
    <div
      className={`pointer-events-none w-full h-full flex flex-col items-start fixed top-0 left-0 p-4 lg:p-8 border-box`}
    >
      <div className=" mt-[200px] flex gap-4 mt-8 pointer-events-auto">
        <button
          onClick={() => navigateWithLanguage('/projects')}
          className="px-6 py-3 bg-white text-primaryDark rounded-full hover:bg-gray-100 transition-colors"
        >
          View Projects
        </button>
        <button
          onClick={() => navigateWithLanguage('/about')}
          className="px-6 py-3 bg-white text-primaryDark rounded-full hover:bg-gray-100 transition-colors"
        >
          About Me
        </button>
        <button
          onClick={() => navigateWithLanguage('/contact')}
          className="px-6 py-3 bg-white text-primaryDark rounded-full hover:bg-gray-100 transition-colors"
        >
          Contact Me
        </button>
      </div>
    </div>
  );
};

export default HomePage;

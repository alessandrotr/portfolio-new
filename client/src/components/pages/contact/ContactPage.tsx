import ContactForm from '../../UI/ContactForm';
import { animated, useSpring } from '@react-spring/web';
import { useNavigate } from 'react-router-dom';
import CloseButton from '../../UI/ui-utils/CloseButton';
import { useSnapshot } from 'valtio';
import { createPortal } from 'react-dom';
import store from '../../../appStore';
import { useLanguage } from '../../../contexts/LanguageContext';

const ContactPage = () => {
  const navigate = useNavigate();
  const snap = useSnapshot(store);
  const { currentLanguage } = useLanguage();

  const [springs, api] = useSpring(() => ({
    from: { opacity: 0, y: 1000 },
    to: { opacity: 1, y: 0 },
    config: { tension: 300, friction: 30 },
  }));

  const handleClose = () => {
    api.start({
      to: { opacity: 0, y: 1000 },
      config: { tension: 300, friction: 30 },
    });
    navigate(`/${currentLanguage}`);
  };

  const scrollbarStyles = `
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
  `;

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
        height: '85vh',
      }}
      className="z-[4] drop-shadow rounded-[25px] border-2 border-borderLightTransparent dark:border-borderDarkTransparent p-[15px] max-h-[82vh]"
    >
      <style>{scrollbarStyles}</style>
      <div className="relative w-full h-full">
        <div className="absolute top-4 right-8">
          <CloseButton handleClick={handleClose} />
        </div>
        <div className="w-full h-full overflow-hidden">
          <div className="w-full h-full rounded-[20px] bg-bgLightTransparent dark:bg-bgDarkTransparent">
            <div className="w-full h-full overflow-y-auto custom-scrollbar">
              <div className="px-[2.5vw] pr-[4vw] pt-[1vw] h-full flex items-center justify-center">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  );

  return createPortal(contentPortal, document.body);
};

export default ContactPage;

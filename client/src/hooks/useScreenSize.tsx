import { useState, useEffect } from 'react';

// Custom hook to detect screen size
export function useScreenSize() {
  const [screenSize, setScreenSize] = useState('desktop'); // Default to 'desktop'

  useEffect(() => {
    // Function to handle resizing
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 768) {
        setScreenSize('mobile'); // Mobile screen
      } else if (width >= 768 && width < 1024) {
        setScreenSize('tablet'); // Tablet screen
      } else {
        setScreenSize('desktop'); // Desktop screen
      }
    };

    // Add event listener to handle resize
    window.addEventListener('resize', handleResize);

    // Initial screen size detection
    handleResize();

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return screenSize;
}

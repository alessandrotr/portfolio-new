import { useState } from 'react';
import { MdClose } from 'react-icons/md';
import { useSnapshot } from 'valtio';
import store from '../../../../appStore';
import useSound from 'use-sound';
import popSfx from '/sounds/pop2.mp3';

interface CloseButtonProps {
  handleClick: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ handleClick }) => {
  const [closeButtonHovered, setCloseButtonHovered] = useState<boolean>(false);
  const snap = useSnapshot(store);
  const [play] = useSound(popSfx, {
    volume: snap.volume,
  });

  return (
    <div
      onClick={() => {
        handleClick();
        play();
      }}
      onPointerOver={() => setCloseButtonHovered(true)}
      onPointerOut={() => setCloseButtonHovered(false)}
      className="relative w-[3vw] h-[3vw] bg-transparent border-[0.15vw] border-borderLightTransparent dark:border-borderDarkTransparent rounded-full cursor-pointer z-[5]"
    >
      <span
        className={`absolute top-0 bottom-0 left-0 right-0 m-auto bg-borderLightTransparent dark:bg-borderDarkTransparent rounded-full transition-all flex items-center justify-center ${
          closeButtonHovered
            ? 'w-full h-full duration-500'
            : 'w-[1vw] h-[1vw] duration-300'
        }`}
      >
        <MdClose
          className={`text-black transition-all ${
            closeButtonHovered
              ? 'text-[1.5vw] opacity-1 rotate-x-0 duration-500'
              : 'text-[0vw] opacity-0 rotate-90 duration-300'
          }`}
          style={{ color: snap.selectedColor }}
        />
      </span>
    </div>
  );
};

export default CloseButton;

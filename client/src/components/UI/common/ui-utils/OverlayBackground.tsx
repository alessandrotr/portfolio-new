import { useSnapshot } from 'valtio';
import store from '../../../../appStore';
import popSfx from '/sounds/pop2.mp3';
import useSound from 'use-sound';

interface OverlayProps {
  expanded: boolean;
  setExpanded: () => void;
}

const Overlay = ({ expanded, setExpanded }: OverlayProps) => {
  const snap = useSnapshot(store);
  const [play] = useSound(popSfx, {
    volume: snap.volume,
  });

  return (
    <div
      onClick={() => {
        setExpanded();
        play();
      }}
      className={`fixed top-0 left-0 w-screen h-screen transition-all duration-1000 z-[15] ${
        expanded
          ? 'opacity-5 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      }`}
      style={{ backgroundColor: snap.selectedColor }}
    />
  );
};

export default Overlay;

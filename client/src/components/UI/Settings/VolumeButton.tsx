import { useSpring, animated, config as springConfig } from '@react-spring/web';
import { useSnapshot } from 'valtio';
import store from '../../../appStore';
import useSound from 'use-sound';
import mute from '/sounds/mute.mp3';
import unmute from '/sounds/unmute.mp3';
import tailwindColors from '../../../tailwindColors';

const VolumeButton = () => {
  const snap = useSnapshot(store);
  const [play] = useSound(mute, {
    volume: 0.25,
  });
  const [play2] = useSound(unmute, {
    volume: snap.volume,
  });

  const megaphoneSpring = useSpring({
    transform:
      snap.volume === 0
        ? 'translateX(5px) scale(1.1)'
        : 'translateX(0) scale(1)',
    config: { ...springConfig.gentle, duration: 200 },
  });

  const leftWaveSpring = useSpring({
    transform:
      snap.volume === 0
        ? 'scale(0.9) translateX(-1px)'
        : 'scale(1.0) translateX(0)',
    opacity: snap.volume === 0 ? 0 : 1,
    config: springConfig.gentle,
    delay: snap.volume === 0 ? 0 : 50, // Delay when unmuting
  });

  const rightWaveSpring = useSpring({
    transform:
      snap.volume === 0
        ? 'scale(0.9) translateX(-2px)'
        : 'scale(1.0) translateX(0)',
    opacity: snap.volume === 0 ? 0 : 1,
    config: springConfig.gentle,
    delay: snap.volume === 0 ? 50 : 0,
  });

  const handleMute = () => {
    if (snap.volume === 0) {
      play2();
    } else {
      play();
    }
    store.volume = snap.volume === 0 ? 1 : 0;
  };

  return (
    <button onClick={handleMute} className="w-fit">
      <animated.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="1.6vw"
        height="1.6vw"
        fill="none"
        stroke={`${
          snap.theme === 'dark'
            ? tailwindColors['bgLight']
            : tailwindColors['bgDark']
        }`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform ease-out"
        style={megaphoneSpring}
      >
        <animated.path
          d="M5 10v4c0 .6.4 1 1 1h3l4.2 4.2c.3.3.8.8 1.3.8V4c-.5 0-1 .5-1.3.8L9 9H6c-.6 0-1 .4-1 1z"
          fill="none"
          stroke={`${
            snap.theme === 'dark'
              ? tailwindColors['bgLight']
              : tailwindColors['bgDark']
          }`}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <animated.path
          style={leftWaveSpring}
          stroke={`${
            snap.theme === 'dark'
              ? tailwindColors['bgLight']
              : tailwindColors['bgDark']
          }`}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.5 8c2 2 2 6 0 8"
        />

        <animated.path
          style={rightWaveSpring}
          stroke={`${
            snap.theme === 'dark'
              ? tailwindColors['bgLight']
              : tailwindColors['bgDark']
          }`}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 6c3 3 3 9 0 12"
        />
      </animated.svg>
    </button>
  );
};

export default VolumeButton;

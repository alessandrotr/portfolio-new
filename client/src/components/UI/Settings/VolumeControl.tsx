import { useSnapshot } from 'valtio';
import store from '../../../appStore';
import useSound from 'use-sound';
import mute from '/sounds/mute.mp3';
import unmute from '/sounds/unmute.mp3';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const VolumeControl = () => {
  const { t } = useTranslation();
  const snap = useSnapshot(store);
  const [playMute] = useSound(mute, {
    volume: 0.25,
  });
  const [playUnmute] = useSound(unmute, {
    volume: snap.volume,
  });

  useEffect(() => {
    const savedVolume = localStorage.getItem('volume');
    if (savedVolume !== null) {
      store.volume = parseFloat(savedVolume);
    }
  }, []);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);

    if (newVolume === 0 && snap.volume !== 0) {
      playMute();
      toast.success(t('settingsBar.sound.volumeMuted'), {
        icon: '🔇',
        style: {
          fontSize: '0.9vw',
        },
      });
    } else if (newVolume > 0 && snap.volume === 0) {
      playUnmute();
      toast.success(t('settingsBar.sound.volumeActivated'), {
        icon: '🔊',
        style: {
          fontSize: '0.9vw',
        },
      });
    }

    store.volume = newVolume;
    localStorage.setItem('volume', newVolume.toString());
  };

  return (
    <div className="flex items-center gap-3">
      <input
        id="volume-slider"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={snap.volume}
        onChange={handleSliderChange}
        className="w-full h-[1vw] rounded-lg cursor-pointer transition-all"
        style={{
          accentColor: snap.selectedColor,
        }}
      />
      <span className="block text-sm text-textDark dark:text-textLight transition-colors duration-300">
        {Math.round(snap.volume * 100)}%
      </span>

      <style>
        {`
          #volume-slider::-webkit-slider-thumb {
            appearance: none;
            width: 1vw;
            height: 1vw;
            background: ${snap.selectedColor};
            border-radius: 50%;
            box-shadow: 0px 0px 3px rgba(0,0,0,0.5);
          }

          #volume-slider::-moz-range-thumb {
            width: 1vw;
            height: 1vw;
            background: ${snap.selectedColor};
            border-radius: 50%;
            box-shadow: 0px 0px 3px rgba(0,0,0,0.5);
          }
        `}
      </style>
    </div>
  );
};

export default VolumeControl;

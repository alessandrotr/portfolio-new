import { useSnapshot } from 'valtio';
import store from '../../../appStore';
import { HiCog } from 'react-icons/hi';
import Dialog from '../ui-utils/Dialog';
import ThemeSwitcher from './ThemeSwitcher';
import ItemsColorSwitcher from './ItemsColorSwitcher';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import VolumeButton from './VolumeButton';
import VolumeControl from './VolumeControl';

function SettingsBar() {
  const snap = useSnapshot(store);
  const { t } = useTranslation();
  return (
    <Dialog
      expanded={snap.settingsBarExpanded}
      handleCloseClick={() => (store.settingsBarExpanded = false)}
      handleOpenClick={() => (store.settingsBarExpanded = true)}
      buttonPositionRight="right-[1.5vw]"
      textDialogButton={<HiCog />}
      initialDialogWidthSize={3}
      dialogWidthSize={15}
      dialogHeightSize={22.5}
    >
      <div className="p-[1vw] flex flex-col gap-[1.25vw]">
        <div className="flex flex-col">
          <SettingTitle text={t('settingsBar.uiSettings.title')} />
          <div className="flex flex-col gap-[0.3vw]">
            <ThemeSwitcher />
            <ItemsColorSwitcher />
          </div>
        </div>

        <div className="flex flex-col">
          <SettingTitle text={t('settingsBar.languages.titleSwitcher')} />
          <LanguageSwitcher />
        </div>
        <div className="flex flex-col">
          <SettingTitle text={t('settingsBar.sound.titleSound')} />
          <span className="text-[0.75vw] text-gray-500 dark:text-gray-400 transition-colors duration-300">
            {t('settingsBar.sound.changeVolumeText')}
          </span>
          <div className="flex items-center gap-4 mt-1.5">
            <VolumeButton />
            <VolumeControl />
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default SettingsBar;

interface SettingTitleProps {
  text: string;
}

const SettingTitle: React.FC<SettingTitleProps> = ({ text }) => {
  return (
    <h2 className="text-textDark dark:text-textLight transition-colors duration-300 text-[1vw] uppercase select-none">
      {text}
    </h2>
  );
};

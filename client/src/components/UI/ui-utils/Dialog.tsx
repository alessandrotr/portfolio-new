import {
  useSpring,
  animated,
  useTransition,
  config as springConfig,
} from '@react-spring/web';
import { useEffect, useRef, useState } from 'react';
import { useSnapshot } from 'valtio';
import Overlay from './OverlayBackground';
import store from '../../../appStore';
import CloseButton from './CloseButton';
import { SetStateBoolean } from '../../../types';
import useSound from 'use-sound';
import popSfx from '../../../../public/sounds/pop.mp3';
import { useLocation } from 'react-router-dom';

interface DialogProps {
  expanded: boolean;
  handleCloseClick: () => void;
  handleOpenClick: () => void;
  textDialogButton: React.ReactNode;
  children: React.ReactNode;
  initialDialogWidthSize: number;
  dialogWidthSize: number;
  dialogHeightSize: number;
  buttonPositionRight: string;
}

const Dialog: React.FC<DialogProps> = ({
  expanded,
  handleCloseClick,
  textDialogButton,
  children,
  initialDialogWidthSize,
  dialogWidthSize,
  dialogHeightSize,
  buttonPositionRight,
  handleOpenClick,
}) => {
  const [isHeld, setIsHeld] = useState<boolean>(false);
  const [hovered, setHovered] = useState<boolean>(false);
  const snap = useSnapshot(store);
  const [play] = useSound(popSfx, {
    volume: snap.volume,
  });

  const handleDialogOpen = () => {
    if (!expanded) {
      if (!snap.contactFormExpanded && !snap.settingsBarExpanded) {
        handleOpenClick();
        play();
      }
    }
  };

  return (
    <>
      <Overlay expanded={expanded} setExpanded={handleCloseClick} />
      <div
        className={`absolute top-[1vw] ${buttonPositionRight} transition-opacity delay-400 duration-700 z-[20] ${
          expanded ? 'opacity-1' : 'opacity-0'
        }`}
      >
        <CloseButton handleClick={handleCloseClick} />
      </div>
      <DialogContainer
        expanded={expanded}
        setIsHeld={setIsHeld}
        isHeld={isHeld}
        setHovered={setHovered}
        initialDialogWidthSize={initialDialogWidthSize}
        dialogWidthSize={dialogWidthSize}
        dialogHeightSize={dialogHeightSize}
        buttonPositionRight={buttonPositionRight}
        handleOpenClick={handleDialogOpen}
        className={`z-[20]`}
      >
        <DialogButtonText
          expanded={expanded}
          hovered={hovered}
          textDialogButton={textDialogButton}
        />
        <DialogContentContainer expanded={expanded}>
          {children}
        </DialogContentContainer>
      </DialogContainer>
    </>
  );
};

export default Dialog;

interface DialogContainerProps {
  children: React.ReactNode;
  expanded: boolean;
  setIsHeld: SetStateBoolean;
  setHovered: SetStateBoolean;
  isHeld: boolean;
  initialDialogWidthSize: number;
  dialogWidthSize: number;
  dialogHeightSize: number;
  buttonPositionRight: string;
  handleOpenClick: () => void;
  className: string;
}

const DialogContainer: React.FC<DialogContainerProps> = ({
  children,
  expanded,
  setIsHeld,
  isHeld,
  setHovered,
  initialDialogWidthSize,
  dialogWidthSize,
  dialogHeightSize,
  buttonPositionRight,
  handleOpenClick,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const snap = useSnapshot(store);
  const location = useLocation();
  const isPrivacyPolicy = location.pathname === '/privacy-policy';

  const [, sphereApi] = useSpring(() => ({
    from: { height: 3, width: initialDialogWidthSize, top: -50 },
    to: {
      height: expanded ? dialogHeightSize : 3,
      width: expanded ? dialogWidthSize : initialDialogWidthSize,
      top: snap.isLoading ? -50 : 1,
    },
    onChange: ({ value }) => {
      if (ref.current) {
        ref.current.style.height = value.height + 'vw';
        ref.current.style.width = value.width + 'vw';
        ref.current.style.top = value.top + 'vw';
      }
    },
    config: { mass: 1, tension: 225, friction: 20 },
  }));

  useEffect(() => {
    if (snap.isLoading) {
      sphereApi.start({ top: -50 });
    } else if (expanded) {
      sphereApi.start({ top: 5.5 });
    } else {
      sphereApi.start({ top: 1 });
    }
  }, [snap.isLoading, sphereApi, expanded]);

  useEffect(() => {
    if (expanded) {
      setTimeout(() => {
        sphereApi.start({ height: dialogHeightSize, width: dialogWidthSize });
      }, 350);
    } else {
      sphereApi.start({ height: 3, width: initialDialogWidthSize });
    }
  }, [
    expanded,
    sphereApi,
    dialogWidthSize,
    dialogHeightSize,
    initialDialogWidthSize,
  ]);

  const handleMouseDown = () => setIsHeld(true);
  const handleMouseUp = () => setIsHeld(false);

  return (
    <div
      ref={ref}
      onClick={() => {
        if (!expanded) handleOpenClick();
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => {
        setHovered(false);
        handleMouseUp();
      }}
      className={`hidden xl:flex drop-shadow h-[6.5vh] absolute ${buttonPositionRight} rounded-[25px]
        ${expanded ? 'cursor-default z-[20]' : 'cursor-pointer z-[0]'}
        ${
          expanded || isHeld
            ? 'border-2 border-borderLightTransparent dark:border-borderDarkTransparent p-[5px]'
            : ''
        } ${className}`}
      style={{
        transformOrigin: 'top',
        transition: 'padding 0.2s ease',
      }}
    >
      <div
        className={`group w-full h-full flex overflow-hidden transition-all items-center justify-center ${
          expanded ? 'rounded-[20px]' : 'rounded-[25px]'
        } ${
          isPrivacyPolicy && expanded
            ? 'bg-white dark:bg-black'
            : 'bg-borderLightTransparent dark:bg-borderDarkTransparent'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

interface DialogButtonTextProps {
  expanded: boolean;
  hovered: boolean;
  textDialogButton: React.ReactNode;
}

const DialogButtonText: React.FC<DialogButtonTextProps> = ({
  expanded,
  hovered,
  textDialogButton,
}) => {
  const textRef = useRef<HTMLHeadingElement>(null);
  const snap = useSnapshot(store);

  const [, textApi] = useSpring(() => ({
    from: { translateY: 0, opacity: 1 },
    to: { translateY: expanded ? -30 : 0, opacity: expanded ? 0 : 1 },
    onChange: ({ value }) => {
      if (textRef.current) {
        textRef.current.style.transform = `translateY(${value.translateY}px)`;
        textRef.current.style.opacity = value.opacity;
      }
    },
    config: { mass: 1, tension: 225, friction: 20 },
  }));

  useEffect(() => {
    if (expanded) {
      textApi.start({ translateY: -30, opacity: 0 });
    } else {
      setTimeout(() => {
        textApi.start({ translateY: 0, opacity: 1 });
      }, 500);
    }
  }, [expanded, textApi]);

  return (
    <h4
      ref={textRef}
      className={`flex items-center gap-2 text-textDark dark:text-textLight transition-colors duration-300 text-[1.1vw] uppercase select-none tracking-[1px]`}
      style={{ color: hovered ? snap.selectedColor : '' }}
    >
      {textDialogButton}
    </h4>
  );
};

interface DialogContentContainerProps {
  expanded: boolean;
  children: React.ReactNode;
}

const DialogContentContainer: React.FC<DialogContentContainerProps> = ({
  expanded,
  children,
}) => {
  const transitions = useTransition(expanded, {
    from: { opacity: 0, translateY: '-25px' },
    enter: { opacity: 1, translateY: '0px' },
    leave: { opacity: 0, translateY: '-25px' },
    delay: expanded ? 750 : 0,
    config: springConfig.gentle,
  });

  return transitions((styles, item) =>
    item ? (
      <animated.div
        key="form"
        style={styles}
        className={`w-full absolute left-0 top-0 ${
          expanded ? 'flex' : 'hidden'
        }`}
      >
        {children}
      </animated.div>
    ) : null
  );
};

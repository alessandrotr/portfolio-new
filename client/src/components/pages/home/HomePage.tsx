import { ReactNode, useEffect } from 'react';
// import Navigator from '../../UI/Navigator';
import { useSnapshot } from 'valtio';
import store from '../../../appStore';
import { GrLinkedinOption, GrCertificate } from 'react-icons/gr';
import { MdAlternateEmail } from 'react-icons/md';
import { Tooltip } from 'react-tooltip';
import {
  useSpring,
  animated,
  config as springConfig,
  SpringValue,
} from '@react-spring/web';

const HomePage = () => {
  const snap = useSnapshot(store);
  useEffect(() => {
    if (snap.pageActive === 'HomePage') {
      setTimeout(() => {
        store.projectActive = 'ENRX';
      }, 500);
    }
  }, [snap.pageActive]);

  const springAnimation = useSpring({
    from: {
      opacity: 0,
      y: '-500px',
      x: '-1500px',
      y2: '500px',
    },
    to: {
      opacity: snap.isLoading || snap.pageActive !== 'HomePage' ? 0 : 1,
      y: snap.isLoading || snap.pageActive !== 'HomePage' ? '-500px' : '0px',
      x: snap.isLoading || snap.pageActive !== 'HomePage' ? '-1500px' : '0px',
      y2: snap.isLoading || snap.pageActive !== 'HomePage' ? '500px' : '0px',
    },
    config: springConfig.default,
  });

  return (
    <div
      className={`${
        snap.pageActive === 'HomePage' ? '' : 'pointer-events-none'
      } pointer-events-none w-full h-full flex flex-col items-start fixed top-0 left-0 p-4 lg:p-8 border-box`}
    >
      {/* <NameAndJob y={springAnimation.y} opacity={springAnimation.opacity} /> */}
      {/* <Navigator
        opacity={springAnimation.opacity}
        linkToPage="Projects"
        pageActiveName="Projects"
      /> */}
      {/* <CoolSentence x={springAnimation.x} opacity={springAnimation.opacity} /> */}
      {/* <Links y2={springAnimation.y2} opacity={springAnimation.opacity} /> */}
    </div>
  );
};

export default HomePage;

const NameAndJob = ({
  y,
  opacity,
}: {
  y: SpringValue<string>;
  opacity: SpringValue<number>;
}) => {
  return (
    <animated.div
      style={{
        translateY: y,
        opacity: opacity,
      }}
      className={`flex flex-col`}
    >
      <h1 className="text-[22px] lg:text-[30px] uppercase xl:text-4xl select-none">
        Alessandro Traiola
      </h1>
      <p className="text-[13px] lg:text-[21px] text-gray-300 select-none uppercase">
        Frontend Developer based in berlin
      </p>
    </animated.div>
  );
};

const CoolSentence = ({
  x,
  opacity,
}: {
  x: SpringValue<string>;
  opacity: SpringValue<number>;
}) => {
  return (
    <>
      <animated.div
        style={{
          translateX: x,
          opacity: opacity,
        }}
        className={`flex flex-col items-start select-none uppercase text-[50px] -space-y-[25px] lg:text-[130px] lg:-space-y-[70px] `}
      >
        <h3 className="">Code, Coffee,</h3>
        <h3 className="">Berlin Vibes</h3>
      </animated.div>
      <h3 className="uppercase cursor-pointer pointer-events-auto text-2xl bg-white text-items p-4 px-8 rounded-full text-center">
        Let's connect
      </h3>
    </>
  );
};

const Links = ({
  y2,
  opacity,
}: {
  y2: SpringValue<string>;
  opacity: SpringValue<number>;
}) => {
  return (
    <>
      <animated.div
        style={{
          translateY: y2,
          opacity: opacity,
        }}
        className={`flex gap-8 xl:gap-12`}
      >
        <Link
          tooltipId="email"
          tooltipContent="Email me"
          href="mailto:alessandrotraiola@gmail.com"
        >
          <MdAlternateEmail />
        </Link>
        <Link
          tooltipId="linkedin"
          tooltipContent="My Linkedin profile"
          href="https://www.linkedin.com/in/alessandro-traiola/"
        >
          <GrLinkedinOption />
        </Link>

        <Link
          tooltipId="cv"
          tooltipContent="View my CV"
          href="/AlessandroTraiola_CV2024.pdf"
        >
          <GrCertificate />
        </Link>
      </animated.div>
      <Tooltip className="hidden xl:block" id="email" />
      <Tooltip className="hidden xl:block" id="linkedin" />
      <Tooltip className="hidden xl:block" id="cv" />
    </>
  );
};

interface LinkProps {
  children: ReactNode;
  tooltipId: string;
  tooltipContent: string;
  href: string;
}

const Link: React.FC<LinkProps> = ({
  children,
  tooltipId,
  tooltipContent,
  href,
}) => {
  return (
    <a
      data-tooltip-id={tooltipId}
      data-tooltip-content={tooltipContent}
      data-tooltip-place="top"
      href={href}
      target="_blank"
      className="p-4 rounded-full bg-secondaryDark hover:bg-white text-items hover:text-primaryDark drop-shadow-xl text-xl xl:text-3xl"
    >
      {children}
    </a>
  );
};

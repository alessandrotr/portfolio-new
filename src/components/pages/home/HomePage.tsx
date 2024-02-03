import { ReactNode, useEffect } from "react";
import Navigator from "../../UI/Navigator";
import { useSnapshot } from "valtio";
import store from "../../../appStore";
import { GrLinkedinOption, GrCertificate } from "react-icons/gr";
import { MdAlternateEmail } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import {
  useSpring,
  animated,
  config as springConfig,
  SpringValue,
} from "@react-spring/web";

const HomePage = () => {
  const snap = useSnapshot(store);
  useEffect(() => {
    if (snap.pageActive === "HomePage") {
      setTimeout(() => {
        store.projectActive = "ENRX";
      }, 500);
    }
  }, [snap.pageActive]);

  const springAnimation = useSpring({
    from: {
      opacity: 0,
      y: "-500px",
      y2: "500px",
    },
    to: {
      opacity: snap.isLoading || snap.pageActive !== "HomePage" ? 0 : 1,
      y: snap.isLoading || snap.pageActive !== "HomePage" ? "-500px" : "0px",
      y2: snap.isLoading || snap.pageActive !== "HomePage" ? "500px" : "0px",
    },
    config: springConfig.default,
  });

  return (
    <div
      className={`${
        snap.pageActive === "HomePage" ? "z-[1001]" : "pointer-events-none"
      }  w-full h-full flex flex-col items-center justify-between fixed top-0 left-0 py-12 border-box`}
    >
      <NameAndJob y={springAnimation.y} opacity={springAnimation.opacity} />
      <Navigator
        opacity={springAnimation.opacity}
        linkToPage="Projects"
        pageActiveName="Projects"
      />
      <Links y2={springAnimation.y2} opacity={springAnimation.opacity} />
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
      className={`flex flex-col items-center`}
    >
      <h1 className="uppercase xl:text-2xl select-none">Alessandro Traiola</h1>
      <p className="xl:text-lg text-gray-400 select-none font-semibold">
        Frontend Developer based in Berlin
      </p>
    </animated.div>
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
      className="text-items hover:text-itemsHover text-xl xl:text-3xl"
    >
      {children}
    </a>
  );
};

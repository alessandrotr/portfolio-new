import { ReactNode, useEffect } from "react";
import Navigator from "../../UI/Navigator";
import { useSnapshot } from "valtio";
import store from "../../../appStore";
import { GrLinkedinOption, GrCertificate } from "react-icons/gr";
import { MdAlternateEmail } from "react-icons/md";
import { Tooltip } from "react-tooltip";

const HomePage = () => {
  const snap = useSnapshot(store);
  useEffect(() => {
    if (snap.pageActive === "HomePage") {
      setTimeout(() => {
        store.projectActive = "ENRX";
      }, 500);
    }
  }, [snap.pageActive]);

  return (
    <div
      className={`${
        snap.pageActive === "HomePage" ? "z-[1001]" : "pointer-events-none"
      }  w-full h-full flex flex-col items-center justify-between fixed top-0 left-0 py-12 border-box`}
    >
      <NameAndJob loading={snap.isLoading || snap.pageActive !== "HomePage"} />
      <div
        className={`${
          snap.isLoading || snap.pageActive !== "HomePage"
            ? "opacity-0 "
            : "opacity-1"
        } transition-opacity duration-500 flex flex-col items-center gap-4 xl:gap-6`}
      >
        <h2 className="uppercase xl:text-2xl select-none">
          New Website coming soon
        </h2>
        <Navigator
          linkToPage="Projects"
          pageActiveName="Projects"
          prevText="While you wait, take a look at some of my"
        />
      </div>
      <Links loading={snap.isLoading || snap.pageActive !== "HomePage"} />
    </div>
  );
};

export default HomePage;

const NameAndJob = ({ loading }: { loading: boolean }) => {
  return (
    <div
      className={`${
        loading ? "opacity-0 -translate-y-[500px]" : "opacity-1 translate-y-0"
      } transition-all duration-500 flex flex-col items-center`}
    >
      <h1 className="uppercase xl:text-2xl select-none">Alessandro Traiola</h1>
      <p className="xl:text-lg text-gray-400 select-none">Frontend Developer</p>
    </div>
  );
};

const Links = ({ loading }: { loading: boolean }) => {
  return (
    <>
      <div
        className={`${
          loading ? "opacity-0 translate-y-[500px]" : "opacity-1 translate-y-0"
        } transition-all duration-500 flex gap-8 xl:gap-12`}
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
      </div>
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

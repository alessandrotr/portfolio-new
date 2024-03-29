import { useSnapshot } from "valtio";
import store from "../../../appStore";
import { ProjectsData } from "../../../data/ProjectsData";
import { useEffect, useState } from "react";
import { MdLink } from "react-icons/md";
import { useSpring, animated } from "@react-spring/web";

type ProjectType = {
  id: number;
  title: string;
  type: string;
  description: string;
  keyFeatures?: {
    title: string;
    text: string;
  }[];
  myRole?: string;
  href?: string;
  gifImage?: string;
  videoSrc?: string;
  videoSrc2?: string;
  technologies?: string[];
  date?: string;
};

const ProjectPage = ({ pageIsShowing }: { pageIsShowing: boolean }) => {
  const snap = useSnapshot(store);
  const [project, setProject] = useState<ProjectType | null>(null);

  useEffect(() => {
    const foundProject = ProjectsData.find(
      (p) => p.title === snap.projectActive
    );

    if (foundProject) {
      setProject(null);
      setTimeout(() => {
        setProject(foundProject);
      }, 1000);
    } else {
      setProject(null);
    }
  }, [snap.projectActive]);

  const springProps = useSpring({
    opacity: snap.changingProject || !pageIsShowing ? 0 : 1,
  });

  return (
    <div
      className={`${pageIsShowing ? "opacity-1" : "opacity-0"} ${
        !project ? "flex justify-center items-center h-screen" : ""
      } transition-opacity duration-500 xl:w-[calc(100vw)] w-full pt-20 pb-4 xl:py-12`}
    >
      <div className="xl:max-w-[780px] w-full mx-auto flex justify-center">
        {snap.pageActive === "Projects" &&
          (project ? (
            <animated.div style={springProps}>
              <div className="flex flex-col gap-12 p-4 xl:p-0">
                <div className="flex flex-col xl:flex-row items-start justify-between gap-12">
                  <div className="flex flex-col gap-6 xl:gap-10">
                    <ProjectDate date={project.date} />
                    <ProjectTitle title={project.title} type={project.type} />
                    <ProjectLink href={project.href} />
                  </div>
                  <ProjectGif gifImage={project.gifImage} />
                </div>

                <div className="flex flex-col gap-12">
                  <ProjectDescription description={project.description} />
                  <ProjectVideo
                    videoSrc={project.videoSrc}
                    videoSrc2={project.videoSrc2}
                  />
                  <ProjectKeyFeatures keyFeatures={project.keyFeatures} />
                  <ProjectMyRole myRole={project.myRole} />
                  <ProjectTechnologies technologies={project.technologies} />
                </div>
              </div>
            </animated.div>
          ) : null)}
      </div>
    </div>
  );
};

export default ProjectPage;

const ProjectTitle = ({ title, type }: { title: string; type: string }) => {
  return (
    <div className="flex flex-col gap-4 select-none">
      <h2 className="xl:text-xl leading-tight uppercase text-gray-400">
        {type}
      </h2>
      <h2
        className={`text-3xl xl:text-6xl leading-tight uppercase ${
          title === "Leistungszentrum" ? "break-all" : ""
        }`}
      >
        {title}
      </h2>
    </div>
  );
};

const ProjectLink = ({ href }: { href?: string }) => {
  return (
    href && (
      <a
        className="uppercase flex items-center gap-2 w-fit text-items hover:text-itemsHover hover:bg-white hover:text-primaryDark select-none p-2 px-3 rounded-md bg-secondaryDark"
        href={href}
        target="_blank"
      >
        <MdLink className="text-xl" />
        <h4 className="text-xs">Try it</h4>
      </a>
    )
  );
};

const ProjectDescription = ({ description }: { description: string }) => {
  return <SectionText text={description} />;
};

const ProjectGif = ({ gifImage }: { gifImage?: string }) => {
  return (
    gifImage && (
      <img
        src={gifImage}
        className="xl:min-w-[400px] xl:max-w-[400px] rounded-md select-none pointer-events-none"
        alt="Gif"
      />
    )
  );
};

const ProjectKeyFeatures = ({
  keyFeatures,
}: {
  keyFeatures?: {
    title: string;
    text: string;
  }[];
}) => {
  return (
    keyFeatures && (
      <div className="flex flex-col gap-4 xl:gap-6">
        <SectionHeading text="Key Features" />
        <div className="flex flex-col gap-6">
          {keyFeatures.map((feature, i) => (
            <ul className="list-disc" key={`${feature.title}_${i}`}>
              <li className="flex flex-col gap-2">
                <h4 className="text-sm uppercase text-gray-400">
                  {feature.title}
                </h4>
                <SectionText text={feature.text} />
              </li>
            </ul>
          ))}
        </div>
      </div>
    )
  );
};

const ProjectTechnologies = ({ technologies }: { technologies?: string[] }) => {
  return (
    technologies && (
      <div className="flex flex-col gap-4 xl:gap-6">
        <SectionHeading text="Some of the technologies used" />
        <div className="flex flex-wrap gap-2 items-center">
          {technologies.map((technology, i) => (
            <p
              key={`${technology}_${i}`}
              className="text-lg text-gray-400 bg-gray-800 py-2 px-3 rounded-md whitespace-nowrap select-none"
            >
              {technology}
            </p>
          ))}
          <SectionText text={"and more..."} />
        </div>
      </div>
    )
  );
};

const ProjectMyRole = ({ myRole }: { myRole?: string }) => {
  return (
    myRole && (
      <div className="flex flex-col gap-4 xl:gap-6">
        <SectionHeading text="My role in the project" />
        <SectionText text={myRole} />
      </div>
    )
  );
};

const ProjectVideo = ({
  videoSrc,
  videoSrc2,
}: {
  videoSrc?: string;
  videoSrc2?: string;
}) => {
  return (
    videoSrc && (
      <div className="gap-4 xl:gap-6 w-full flex flex-col  justify-center">
        <SectionHeading text="Short demonstration" />
        <video src={videoSrc} controls muted className="rounded-t-md" />
        {videoSrc2 && (
          <video src={videoSrc2} controls muted className="rounded-t-md" />
        )}
      </div>
    )
  );
};

const ProjectDate = ({ date }: { date?: string }) => {
  return date && <h4 className="text-xs">{date}</h4>;
};

const SectionHeading = ({ text }: { text?: string }) => {
  return <h2 className="uppercase text-xl select-none">{text}</h2>;
};

const SectionText = ({ text }: { text?: string }) => {
  return (
    <p
      className="text-lg text-gray-400"
      dangerouslySetInnerHTML={{ __html: text ? text : "" }}
    />
  );
};

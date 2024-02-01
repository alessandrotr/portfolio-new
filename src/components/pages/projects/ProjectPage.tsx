import { useSnapshot } from "valtio";
import store from "../../../appStore";
import { ProjectsData } from "../../../data/ProjectsData";
import { useEffect, useState } from "react";
import { MdLink } from "react-icons/md";
import { useSpring, animated } from "@react-spring/web";

type ProjectType = {
  id: number;
  description: string;
  title: string;
  type: string;
  href?: string;
  gifImage?: string;
  videoSrc?: string;
  videoSrc2?: string;
  technologies?: string[];
  myRole?: string;
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
      }, 500);
    } else {
      setProject(null);
    }
  }, [snap.projectActive]);

  const springProps = useSpring({
    opacity: pageIsShowing ? 1 : 0,
    transform: pageIsShowing ? "translateY(0)" : "translateY(40px)",
  });

  return (
    <div
      className={`${pageIsShowing ? "opacity-1" : "opacity-0"} ${
        !project ? "flex justify-center items-center h-screen" : ""
      } transition-opacity duration-500 xl:w-[calc(100vw-350px)] xl:ml-[350px] w-full pt-20 pb-4 xl:py-12`}
    >
      <div className="xl:max-w-[1000px] w-full mx-auto flex justify-center">
        {project ? (
          <animated.div style={springProps}>
            <div className="flex flex-col gap-12 p-4 xl:p-0">
              <animated.div style={springProps}>
                <div className="flex flex-col xl:flex-row items-start justify-between gap-12">
                  <animated.div style={springProps}>
                    <div className="flex flex-col gap-4">
                      <ProjectDate date={project.date} />
                      <ProjectTitle title={project.title} type={project.type} />
                      <ProjectLink href={project.href} />
                      <ProjectDescription description={project.description} />
                    </div>
                  </animated.div>
                  <animated.div style={springProps}>
                    <ProjectGif gifImage={project.gifImage} />
                  </animated.div>
                </div>
              </animated.div>
              <ProjectMyRole myRole={project.myRole} />
              <ProjectTechnologies technologies={project.technologies} />
              <ProjectVideo
                videoSrc={project.videoSrc}
                videoSrc2={project.videoSrc2}
              />
            </div>
          </animated.div>
        ) : (
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-items"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        )}
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
      <h2 className="text-3xl xl:text-6xl leading-tight">{title}</h2>
    </div>
  );
};

const ProjectLink = ({ href }: { href?: string }) => {
  return (
    href && (
      <a
        className="flex items-center gap-2 w-fit text-items hover:text-itemsHover select-none"
        href={href}
        target="_blank"
      >
        <MdLink className="text-xl" /> Try it yourself
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
  return date && <h4 className="text-white text-xs">{date}</h4>;
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

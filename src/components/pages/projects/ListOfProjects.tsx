import { useState } from "react";
import store from "../../../appStore";
import { ProjectsData } from "../../../data/ProjectsData";
import { useSnapshot } from "valtio";
import { MdMenu, MdClose } from "react-icons/md";

const ListOfProjects = ({ pageIsShowing }: { pageIsShowing: boolean }) => {
  const [showList, setShowList] = useState(false);

  const handleShowListOfProjects = () => {
    setShowList(!showList);
  };
  return (
    <>
      <MenuButton
        showList={showList}
        handleShowListOfProjects={handleShowListOfProjects}
        pageIsShowing={pageIsShowing}
      />
      <div
        className={`${
          showList ? "left-0" : "-left-[900px] md:-left-[1500px]"
        } ${
          pageIsShowing
            ? "opacity-1 translate-x-0"
            : "opacity-0 -translate-x-[500px]"
        } duration-500 xl:left-8 pt-28 xl:pt-0 top-0 xl:top-32 gap-4 w-full h-screen xl:h-auto xl:w-[350px] min-w-[350px] xl:max-w-[350px] flex flex-col fixed transition-all z-20 bg-primaryDark xl:bg-transparent`}
      >
        {ProjectsData.map((project, i) => (
          <ProjectItem
            handleShowListOfProjects={handleShowListOfProjects}
            key={project.id}
            project={project}
            number={i}
          />
        ))}
      </div>
    </>
  );
};

export default ListOfProjects;

interface ProjectItemProps {
  project: {
    id: number;
    title: string;
  };
  number: number;
  handleShowListOfProjects: () => void;
}

const ProjectItem: React.FC<ProjectItemProps> = ({
  project,
  number,
  handleShowListOfProjects,
}) => {
  const snap = useSnapshot(store);
  return (
    <div
      className={`${
        snap.projectActive === project.title
          ? "bg-white text-primaryDark drop-shadow-xl"
          : "hover:bg-white bg-secondaryDark text-items hover:text-primaryDark cursor-pointer"
      } flex items-center gap-4 p-4 select-none xl:rounded-md transition-colors duration-250 font-semibold uppercase`}
      onClick={() => {
        store.projectActive = project.title;
        handleShowListOfProjects();
        store.changingProject = true;
      }}
    >
      <h3>{"0" + (number + 1) + "."}</h3>
      <h3>{project.title}</h3>
    </div>
  );
};

interface MenuButtonProps {
  handleShowListOfProjects: () => void;
  showList: boolean;
  pageIsShowing: boolean;
}

const MenuButton: React.FC<MenuButtonProps> = ({
  handleShowListOfProjects,
  showList,
  pageIsShowing,
}) => {
  return (
    <div
      className={`${
        pageIsShowing ? "opacity-1" : "opacity-0"
      } transition-opacity duration-500 xl:hidden rounded-full p-2 px-3 hover:bg-white bg-secondaryDark text-items hover:text-primaryDark drop-shadow-xl cursor-pointer fixed top-4 right-4 z-20 text-3xl z-50 flex items-center gap-2`}
      onClick={handleShowListOfProjects}
    >
      <h4 className="text-sm uppercase">Other Projects</h4>
      {showList ? <MdClose /> : <MdMenu />}
    </div>
  );
};

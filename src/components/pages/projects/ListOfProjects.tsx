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
        className={`${showList ? "left-0" : "-left-[1500px]"} ${
          pageIsShowing
            ? "opacity-1 translate-x-0"
            : "opacity-0 -translate-x-[500px]"
        } duration-500 xl:left-4 pt-20 xl:pt-0 top-0 xl:top-32 gap-4 w-full h-screen xl:h-auto xl:w-[350px] min-w-[350px] xl:max-w-[350px] flex flex-col fixed transition-all z-20 bg-primaryDark xl:bg-transparent`}
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
          ? "bg-gray-900"
          : "hover:bg-gray-900 bg-gray-800"
      } flex items-center gap-2 cursor-pointer p-4 select-none rounded-md`}
      onClick={() => {
        store.projectActive = project.title;
        handleShowListOfProjects();
      }}
    >
      <h3>{"0" + (number + 1) + "."}</h3>
      <p>{project.title}</p>
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
      } transition-opacity duration-500 xl:hidden rounded-full p-2 bg-gray-900 cursor-pointer fixed top-4 right-4 z-20 text-3xl z-50 flex items-center gap-2`}
      onClick={handleShowListOfProjects}
    >
      <h4 className="text-sm uppercase">Other Projects</h4>
      {showList ? <MdClose /> : <MdMenu />}
    </div>
  );
};

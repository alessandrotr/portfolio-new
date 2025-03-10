import { useSnapshot } from "valtio";
import store from "../../../appStore";
import BackButton from "../../UI/BackButton";
import ListOfProjects from "./ListOfProjects";
import ProjectPage from "./ProjectPage";

const ProjectsPage = () => {
  const snap = useSnapshot(store);
  return (
    <div
      className={`${
        snap.pageActive === "Projects"
          ? "z-[1001] overflow-auto"
          : "pointer-events-none"
      } lex z-[1001] flex-col w-full h-full fixed top-0 left-0 sidebar`}
    >
      <BackButton
        onClickHandler={() => (store.pageActive = "HomePage")}
        pageIsShowing={snap.pageActive === "Projects"}
      />
      <ListOfProjects pageIsShowing={snap.pageActive === "Projects"} />
      <ProjectPage pageIsShowing={snap.pageActive === "Projects"} />
    </div>
  );
};

export default ProjectsPage;

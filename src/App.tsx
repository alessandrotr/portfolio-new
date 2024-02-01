import LoadingScreen from "./components/UI/LoadingScreen";
import HomePage from "./components/pages/home/HomePage";
import ProjectsPage from "./components/pages/projects/ProjectsPage";
import LogoSmall from "/Logo-small-blue-new.webp";
import "react-tooltip/dist/react-tooltip.css";

function App() {
  return (
    <>
      <LoadingScreen />
      <BackgroundWithLogoAndOverlay />
      <HomePage />
      <ProjectsPage />
    </>
  );
}

export default App;

const BackgroundWithLogoAndOverlay = () => {
  return (
    <div
      className="flex w-full h-screen fixed top-0 left-0 z-[0] bg-center bg-no-repeat bg-contain xl:bg-[length:500px_300px]"
      style={{
        backgroundImage: `url(${LogoSmall})`,
      }}
    >
      <div className="fixed top-0 left-0 w-full h-full bg-[rgba(32,35,42,0.97)]" />
    </div>
  );
};

import LoadingScreen from "./components/UI/LoadingScreen";
import HomePage from "./components/pages/home/HomePage";
import ProjectsPage from "./components/pages/projects/ProjectsPage";
import "react-tooltip/dist/react-tooltip.css";
import { Canvas } from "@react-three/fiber";
import LogoModel from "./components/3d/LogoModel";

function App() {
  return (
    <>
      <Canvas
        style={{
          height: "100vh",
          width: "100vw",
        }}
        camera={{
          position: [0, 0, 15],
        }}
        id="canvas"
        flat
      >
        <LogoModel />
        <ambientLight intensity={0.085} />
        <pointLight
          distance={50}
          position={[0, 0, 10]}
          intensity={10}
          color={"#5fd9f9"}
        />
      </Canvas>
      <LoadingScreen />
      <HomePage />
      <ProjectsPage />
    </>
  );
}

export default App;

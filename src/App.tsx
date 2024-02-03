import LoadingScreen from "./components/UI/LoadingScreen";
import HomePage from "./components/pages/home/HomePage";
import ProjectsPage from "./components/pages/projects/ProjectsPage";
import "react-tooltip/dist/react-tooltip.css";
import { Canvas } from "@react-three/fiber";
import LogoModel from "./components/3d/LogoModel";
import { Stars } from "@react-three/drei";
import Lights from "./components/3d/Lights";

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
        <Lights />
        <Stars
          radius={100}
          depth={50}
          count={250}
          factor={4}
          saturation={0}
          fade
          speed={2}
        />
      </Canvas>
      <LoadingScreen />
      <HomePage />
      <ProjectsPage />
    </>
  );
}

export default App;

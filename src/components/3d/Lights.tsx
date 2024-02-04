import { useSnapshot } from "valtio";
import store from "../../appStore";

const Lights = () => {
  const snap = useSnapshot(store);

  return (
    <>
      <ambientLight intensity={0.085} />
      {snap.changingProject && (
        <pointLight
          castShadow
          distance={50}
          position={[0, 0, 10]}
          intensity={15}
          color={"#5fd9f9"}
        />
      )}

      {snap.pageActive === "HomePage" && (
        <pointLight
          castShadow
          distance={50}
          position={[0, 0, 10]}
          intensity={15}
          color={"#5fd9f9"}
        />
      )}

      {snap.pageActive === "Projects" && (
        <pointLight
          castShadow
          distance={50}
          position={[0, 0, 20]}
          intensity={15}
          color={"#5fd9f9"}
        />
      )}
    </>
  );
};

export default Lights;

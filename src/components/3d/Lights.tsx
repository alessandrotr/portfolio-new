import { useSnapshot } from "valtio";
import store from "../../appStore";

const Lights = () => {
  const snap = useSnapshot(store);

  return (
    <>
      <ambientLight intensity={0.085} />
      <pointLight
        castShadow
        distance={50}
        position={[0, 0, 10]}
        intensity={
          snap.pageActive === "HomePage" || snap.changingProject ? 15 : 2
        }
        color={"#5fd9f9"}
      />
    </>
  );
};

export default Lights;

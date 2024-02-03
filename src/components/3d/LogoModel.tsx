import {
  AccumulativeShadows,
  Float,
  RandomizedLight,
  Sparkles,
  useGLTF,
} from "@react-three/drei";
import { useEffect, useRef } from "react";
import { degToRad } from "three/src/math/MathUtils.js";
import { useSnapshot } from "valtio";
import store from "../../appStore";
import { useSpring, config as springConfig } from "@react-spring/three";
import { Group } from "three";

const LogoModel = () => {
  const { scene } = useGLTF("./models/logo.glb", "./draco/gltf/");
  const ref = useRef<Group>(null);
  const snap = useSnapshot(store);

  useEffect(() => {
    if (snap.changingProject) {
      setTimeout(() => {
        store.changingProject = false;
      }, 1000);
    }
  }, [snap.changingProject]);

  useSpring({
    from: {
      z: snap.isLoading ? -45 : 0,
    },
    to: {
      z: 0,
    },
    onChange: ({ value }) => {
      const { z } = value;
      if (ref.current) {
        ref.current.position.z = z;
      }
    },
    config: springConfig.molasses,
  });

  return (
    <group ref={ref} position={[-3, 2.5, 0]}>
      <Float
        speed={2} // Animation speed, defaults to 1
        rotationIntensity={2} // XYZ rotation intensity, defaults to 1
        floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange, defaults to 1
        floatingRange={[-0.1, 0.1]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
      >
        <primitive object={scene} scale={45} rotation={[degToRad(90), 0, 0]} />
      </Float>
      <AccumulativeShadows temporal frames={100} scale={10}>
        <RandomizedLight amount={8} position={[0, 0, -10]} />
      </AccumulativeShadows>
      {snap.pageActive === "HomePage" || snap.changingProject ? (
        <Sparkles
          position={[3, -2, 1]}
          count={25}
          scale={3.5}
          size={8}
          speed={2.5}
        />
      ) : null}
    </group>
  );
};

export default LogoModel;

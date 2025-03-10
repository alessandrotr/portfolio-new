import { useState } from 'react';
import { useSpring, a } from '@react-spring/three';
import { useSnapshot } from 'valtio';
import store from '../../appStore';
import * as THREE from 'three';

const BackgroundThemeSwitch = () => {
  const [expanded, setExpanded] = useState(false);
  const snap = useSnapshot(store);

  const { scale, opacity } = useSpring({
    scale: snap.theme === 'dark' ? 30 : 0,
    opacity: snap.theme === 'dark' ? 0 : 1,
    config: { mass: 2, tension: 150, friction: 30 },
  });

  return (
    <a.mesh
      position={[0, 0, 0]}
      scale={scale.to((s) => [s, s, s])}
      onClick={() => setExpanded(!expanded)}
      renderOrder={-1}
    >
      <sphereGeometry args={[0.5, 32, 32]} />
      <a.meshStandardMaterial
        color={new THREE.Color(`${snap.selectedColor}`)}
        depthWrite={true}
        opacity={opacity} // Bind opacity to animated value
        transparent
      />
    </a.mesh>
  );
};

export default BackgroundThemeSwitch;

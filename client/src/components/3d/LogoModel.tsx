import { useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { degToRad } from 'three/src/math/MathUtils.js';
import { useSnapshot } from 'valtio';
import store from '../../appStore';
import { useSpring, config as springConfig } from '@react-spring/three';
import { Group } from 'three';
import { useThree } from '@react-three/fiber';
import {
  EffectComposer,
  Outline,
  Select,
  Selection,
} from '@react-three/postprocessing';

const LogoModel = () => {
  const { scene } = useGLTF('./models/logo.glb', './draco/gltf/');
  const ref = useRef<Group>(null);
  const snap = useSnapshot(store);
  const { size } = useThree(); // Get viewport size for normalization

  useSpring({
    from: {
      x: 3.5,
      y: snap.isLoading ? -10 : -0.5,
      z: 0,
    },
    to: {
      x: 3.5,
      y: -0.5,
      z: 0,
    },
    onChange: ({ value }) => {
      const { x, y, z } = value;
      if (ref.current) {
        ref.current.position.x = x;
        ref.current.position.y = y;
        ref.current.position.z = z;
      }
    },
    config: springConfig.slow,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!ref.current) return;

      // Normalize mouse position to range [-1, 1]
      const x = (event.clientX / size.width) * 2 - 1;
      const y = (event.clientY / size.height) * 2 - 1;

      // Apply subtle rotation based on mouse position
      const rotationIntensity = 0.05; // Lower value for subtle effect
      ref.current.rotation.x = -y * rotationIntensity;
      ref.current.rotation.y = x * rotationIntensity;
    };

    // Add event listener to track mouse movement globally
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      // Clean up event listener on unmount
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [size]);

  return (
    <group ref={ref} position={[3.5, -0.5, 0]}>
      <Selection>
        <EffectComposer autoClear={false}>
          <Outline
            xRay
            edgeStrength={1.5}
            pulseSpeed={0.3}
            visibleEdgeColor={0x5fd9f9}
            hiddenEdgeColor={0x000000}
          />
        </EffectComposer>
        <Select enabled>
          <primitive
            onClick={() => {
              console.log('yo');
            }}
            object={scene}
            scale={70}
            rotation={[degToRad(90), 0, degToRad(30)]}
          />
        </Select>
      </Selection>
    </group>
  );
};

export default LogoModel;

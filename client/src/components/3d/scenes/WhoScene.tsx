import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import store from '../../../appStore';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { WaveShaderMaterial } from '../shaders/WaveShaderMaterial';

interface User3DProps {
  scale?: number;
  position?: [number, number, number];
  visible?: boolean;
}

const User3D = ({
  scale = 1,
  position = [0, 0, 0],
  visible = false,
}: User3DProps) => {
  const snap = useSnapshot(store);
  const userRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  // Create a single shared material instance
  const material = useMemo(() => {
    return new WaveShaderMaterial();
  }, []);

  // Update color when it changes in the store
  useEffect(() => {
    material.color = new THREE.Color(snap.selectedColor);
  }, [snap.selectedColor, material]);

  // Handle active state animation
  useEffect(() => {
    if (snap.activeScene === 'who') {
      material.startAnimation(1.5); // Start exploding animation
    } else {
      material.resetAnimation(); // Reset to normal state
    }
  }, [snap.activeScene, material]);

  // Animation frame update
  useFrame((state) => {
    material.time = state.clock.getElapsedTime();
    // Add waving animation to right arm
    if (rightArmRef.current && rightArmRef.current.children[1]) {
      const t = state.clock.getElapsedTime();
      // Create a natural waving motion pivoting from the elbow
      const forearm = rightArmRef.current.children[1];
      // Asymmetric wave: more movement away from head (positive values), less towards
      const wave = Math.sin(t * 3);
      forearm.rotation.z = wave * (wave > 0 ? 0.35 : 0.15);
      forearm.rotation.y = Math.sin(t * 3) * 0.1;
      // Adjust position to maintain connection at the elbow
      forearm.position.set(
        Math.sin(forearm.rotation.z) * 0.2, // X offset
        -0.4 + (1 - Math.cos(forearm.rotation.z)) * 0.2, // Y offset
        0
      );
    }
  });

  return (
    <group ref={userRef} scale={scale} position={position} visible={visible}>
      {/* Head */}
      <points position={[0, 2, 0]}>
        <sphereGeometry args={[0.3, 64, 64]} />
        <primitive object={material} />
      </points>

      {/* Neck */}
      <points position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 0.3, 64, 32]} />
        <primitive object={material} />
      </points>

      {/* Body */}
      <points position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 1.2, 64, 64]} />
        <primitive object={material} />
      </points>

      {/* Left Arm */}
      <group position={[-0.35, 1.175, 0]} rotation={[0, 0, -Math.PI / 4]}>
        {/* Upper arm - static */}
        <points>
          <cylinderGeometry args={[0.12, 0.1, 0.4, 64, 32]} />
          <primitive object={material} />
        </points>
        {/* Forearm - static */}
        <group position={[0, -0.4, 0]}>
          <points>
            <cylinderGeometry args={[0.1, 0.08, 0.4, 64, 32]} />
            <primitive object={material} />
          </points>
        </group>
      </group>

      {/* Right Arm */}
      <group
        ref={rightArmRef}
        position={[0.4, 1.5, 0]}
        rotation={[0, 0, -Math.PI / -1.3]}
      >
        {/* Upper arm - static */}
        <points>
          <cylinderGeometry args={[0.12, 0.1, 0.4, 64, 32]} />
          <primitive object={material} />
        </points>
        {/* Forearm - animated */}
        <group position={[0, -0.4, 0]}>
          <points>
            <cylinderGeometry args={[0.1, 0.08, 0.4, 64, 32]} />
            <primitive object={material} />
          </points>
        </group>
      </group>

      {/* Left Leg */}
      <group position={[-0.2, 0, 0]}>
        <points>
          <cylinderGeometry args={[0.08, 0.1, 1, 64, 32]} />
          <primitive object={material} />
        </points>
      </group>

      {/* Right Leg */}
      <group position={[0.2, 0, 0]}>
        <points>
          <cylinderGeometry args={[0.08, 0.1, 1, 64, 32]} />
          <primitive object={material} />
        </points>
      </group>
    </group>
  );
};

const WhoScene = ({ visible = false }) => {
  return (
    <group visible={visible}>
      <User3D position={[0, -1, -5]} scale={2.5} visible={visible} />
    </group>
  );
};

export default WhoScene;

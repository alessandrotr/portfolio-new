import { useRef, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import store from '../../../appStore';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import MonumentPopup from './MonumentPopup';
import { WaveShaderMaterial } from '../shaders/WaveShaderMaterial';

interface CastelDellOvoProps {
  scale?: number;
  position?: [number, number, number];
  isHovered?: boolean;
  visible?: boolean;
}

export default function CastelDellOvo({
  scale = 0.15,
  position = [0, 0, 0],
  isHovered = false,
  visible = false,
}: CastelDellOvoProps) {
  const snap = useSnapshot(store);
  const castleRef = useRef<THREE.Group>(null);
  const [showPopup, setShowPopup] = useState(false);

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
    if (snap.activeScene === 'naples') {
      material.startAnimation(1.5); // Start exploding animation
    } else {
      material.resetAnimation(); // Reset to normal state
    }
  }, [snap.activeScene, material]);

  // Simplified animation frame
  useFrame((state) => {
    material.time = state.clock.getElapsedTime();
  });

  // Update hover state
  useEffect(() => {
    material.hovered = isHovered;
  }, [isHovered, material]);

  return (
    <group ref={castleRef} scale={scale} position={position}>
      {/* Hit area for popup */}
      {visible && (
        <mesh
          position={[0, 2, 0]}
          onPointerEnter={() => setShowPopup(true)}
          onPointerLeave={() => setShowPopup(false)}
          renderOrder={1}
        >
          <boxGeometry args={[7, 4, 2]} />
          <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} />
        </mesh>
      )}

      <MonumentPopup
        position={[0.5, 6, 0]}
        title="Castel dell'Ovo"
        description="The oldest standing fortification in Naples, dating back to the 12th century"
        showPopup={showPopup}
        visible={visible}
      />

      {/* Lighting */}
      <pointLight
        position={[2, 5, 2]}
        intensity={1}
        color={isHovered ? snap.selectedColor : '#ffffff'}
      />
      <pointLight
        position={[-2, 3, -2]}
        intensity={0.5}
        color={isHovered ? snap.selectedColor : '#ffffff'}
      />

      {/* Base platform and sea rock */}
      <points position={[0, -0.5, 0]}>
        <boxGeometry args={[8, 1, 3, 64, 32, 32]} />
        <primitive object={material} />
      </points>

      {/* Main castle body */}
      <points position={[0, 1, 0]}>
        <boxGeometry args={[7, 2.5, 2.5, 64, 32, 32]} />
        <primitive object={material} />
      </points>

      {/* Corner towers */}
      {[
        [-3.2, 0, 1] as [number, number, number],
        [2.8, -0.2, 0.8] as [number, number, number],
      ].map((pos, i) => (
        <group key={i} position={pos}>
          <points position={[0, 2.5, 0]}>
            <cylinderGeometry args={[0.8, 0.8, 4, 32, 32]} />
            <primitive object={material} />
          </points>
          {/* Tower tops */}
          <points position={[0, 4.5, 0]}>
            <cylinderGeometry args={[1, 0.8, 0.5, 32, 16]} />
            <primitive object={material} />
          </points>
        </group>
      ))}

      {/* Central tower */}
      <group position={[-0.3, -0.1, 1]}>
        <points position={[0, 2.5, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 4, 32, 32]} />
          <primitive object={material} />
        </points>
        {/* Tower top */}
        <points position={[0, 4.5, 0]}>
          <cylinderGeometry args={[1.1, 0.9, 0.5, 32, 16]} />
          <primitive object={material} />
        </points>
      </group>

      {/* Battlements */}
      <points position={[0, 2.8, 0]}>
        <boxGeometry args={[7.2, 0.4, 2.7, 64, 8, 32]} />
        <primitive object={material} />
      </points>

      {/* Windows and details */}
      {[-2, 0, 2].map((x, i) => (
        <group key={i} position={[x, 1.5, 1.3]}>
          <points>
            <boxGeometry args={[0.6, 1, 0.1, 16, 16, 8]} />
            <primitive object={material} />
          </points>
        </group>
      ))}
    </group>
  );
}

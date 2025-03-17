import { useRef, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import store from '../../../appStore';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import MonumentPopup from './MonumentPopup';
import { WaveShaderMaterial } from '../shaders/WaveShaderMaterial';

interface FernsehturmProps {
  scale?: number;
  position?: [number, number, number];
  visible?: boolean;
  isHovered?: boolean;
}

export default function Fernsehturm({
  scale = 0.15,
  position = [0, 0, 0],
  visible = false,
  isHovered = false,
}: FernsehturmProps) {
  const snap = useSnapshot(store);
  const towerRef = useRef<THREE.Group>(null);
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
    if (snap.activeScene === 'berlin') {
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
    <group ref={towerRef} scale={scale} position={position}>
      {/* Hit area for popup */}
      {visible && (
        <mesh
          position={[0, 5, 0]}
          onPointerEnter={() => setShowPopup(true)}
          onPointerLeave={() => setShowPopup(false)}
          renderOrder={1}
        >
          <boxGeometry args={[2, 10, 2]} />
          <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} />
        </mesh>
      )}

      <MonumentPopup
        position={[0, 9, 0]}
        title="Fernsehturm"
        description="Berlin's iconic TV Tower, a symbol of the city's skyline"
        showPopup={showPopup}
        visible={visible}
      />

      {/* Base */}
      <points position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 1.2, 0.5, 64, 32]} />
        <primitive object={material} />
      </points>

      {/* Main tower shaft */}
      <points position={[0, 3, 0]}>
        <cylinderGeometry args={[0.3, 0.8, 6, 64, 64]} />
        <primitive object={material} />
      </points>

      {/* Sphere section */}
      <points position={[0, 6.5, 0]}>
        <sphereGeometry args={[1.2, 128, 128]} />
        <primitive object={material} />
      </points>

      {/* Upper shaft */}
      <points position={[0, 8, 0]}>
        <cylinderGeometry args={[0.1, 0.2, 3, 64, 32]} />
        <primitive object={material} />
      </points>

      {/* Antenna */}
      <points position={[0, 9.5, 0]}>
        <cylinderGeometry args={[0.02, 0.1, 2, 32, 32]} />
        <primitive object={material} />
      </points>
    </group>
  );
}

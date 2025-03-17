import { useRef, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import store from '../../../appStore';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import MonumentPopup from './MonumentPopup';
import { WaveShaderMaterial } from '../shaders/WaveShaderMaterial';

interface BrandenburgGateProps {
  scale?: number;
  position?: [number, number, number];
  isHovered?: boolean;
  visible?: boolean;
}

export default function BrandenburgGate({
  scale = 0.15,
  position = [0, 0, 0],
  isHovered = false,
  visible = false,
}: BrandenburgGateProps) {
  const snap = useSnapshot(store);
  const gateRef = useRef<THREE.Group>(null);
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
    <group ref={gateRef} scale={scale} position={position}>
      {/* Hit area for popup */}
      {visible && (
        <mesh
          position={[0, 1.5, 0]}
          onPointerEnter={() => setShowPopup(true)}
          onPointerLeave={() => setShowPopup(false)}
          renderOrder={1}
        >
          <boxGeometry args={[5, 3, 2]} />
          <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} />
        </mesh>
      )}

      <MonumentPopup
        position={[0, 4.25, 0]}
        title="Brandenburg Gate"
        description="A neoclassical monument and symbol of German unity"
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

      {/* Base platform */}
      <points position={[0, -0.5, 0]}>
        <boxGeometry args={[5, 0.2, 2, 64, 16, 32]} />
        <primitive object={material} />
      </points>

      {/* Columns */}
      {[-2, -1.2, -0.4, 0.4, 1.2, 2].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          {/* Column base */}
          <points position={[0, -0.3, 0]}>
            <boxGeometry args={[0.3, 0.4, 0.3, 16, 16, 16]} />
            <primitive object={material} />
          </points>
          {/* Column shaft */}
          <points position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 2, 32, 32]} />
            <primitive object={material} />
          </points>
          {/* Column capital */}
          <points position={[0, 1.3, 0]}>
            <boxGeometry args={[0.4, 0.2, 0.4, 16, 16, 16]} />
            <primitive object={material} />
          </points>
        </group>
      ))}

      {/* Rest of the structure */}
      <points position={[0, 1.5, 0]}>
        <boxGeometry args={[5, 0.4, 0.6, 64, 16, 16]} />
        <primitive object={material} />
      </points>

      <points position={[0, 2, 0]}>
        <boxGeometry args={[4.5, 0.8, 0.5, 64, 32, 16]} />
        <primitive object={material} />
      </points>

      <points position={[0, 2.5, 0]}>
        <boxGeometry args={[1.5, 0.3, 0.4, 32, 16, 16]} />
        <primitive object={material} />
      </points>

      <group position={[0, 3, 0]} scale={[0.4, 0.4, 0.4]}>
        <points position={[0, 0, 0]}>
          <boxGeometry args={[1, 0.5, 0.8, 32, 16, 16]} />
          <primitive object={material} />
        </points>
        {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
          <group key={i} position={[x + 0.2, -0.5, 0.6]}>
            <points>
              <boxGeometry args={[0.3, 0.4, 0.6, 16, 16, 16]} />
              <primitive object={material} />
            </points>
            <points position={[0, 0.3, -0.2]}>
              <boxGeometry args={[0.2, 0.3, 0.2, 16, 16, 16]} />
              <primitive object={material} />
            </points>
          </group>
        ))}
        <points position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.15, 0.3, 1, 32, 32]} />
          <primitive object={material} />
        </points>
      </group>
    </group>
  );
}

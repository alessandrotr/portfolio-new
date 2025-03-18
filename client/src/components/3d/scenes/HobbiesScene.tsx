import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import store from '../../../appStore';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { useSpring } from '@react-spring/three';

interface Hobbies3DProps {
  scale?: number;
  position?: [number, number, number];
  visible?: boolean;
}

const Hobbies3D = ({
  scale = 1,
  position = [0, 0, 0],
  visible = false,
}: Hobbies3DProps) => {
  const snap = useSnapshot(store);
  const hobbiesRef = useRef<THREE.Group>(null);
  const animationProgressRef = useRef(0);

  // Animation spring for elements appearance
  const { progress } = useSpring({
    from: { progress: 0 },
    to: { progress: visible ? 1 : 0 },
    config: { mass: 1, tension: 80, friction: 30 },
    delay: 300,
  });

  // Create materials
  const baseMaterial = useMemo(() => {
    const material = new THREE.MeshBasicMaterial({
      color: snap.selectedColor,
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    return material;
  }, [snap.selectedColor]);

  // Update material color when it changes in the store
  useEffect(() => {
    baseMaterial.color = new THREE.Color(snap.selectedColor);
  }, [snap.selectedColor, baseMaterial]);

  // Animation frame update
  useFrame((state) => {
    const currentProgress = progress.get();
    animationProgressRef.current = currentProgress;

    // Rotate all hobby objects
    if (hobbiesRef.current) {
      const time = state.clock.getElapsedTime();

      // Rotate the entire group slowly
      hobbiesRef.current.rotation.y = time * 0.2;

      // Individual object animations
      hobbiesRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) {
          // Staggered floating animation
          const floatOffset = Math.sin(time * 2 + index) * 0.1;
          child.position.y += floatOffset * 0.01;

          // Update opacity based on progress
          const material = child.material as THREE.MeshBasicMaterial;
          const normalizedIndex =
            index / (hobbiesRef.current?.children.length || 1);
          const delay = normalizedIndex * 0.3;
          const staggeredProgress = Math.max(
            0,
            Math.min(1, (currentProgress - delay) / (1.0 - delay))
          );
          material.opacity = 0.1 + 0.2 * staggeredProgress;
        }
      });
    }
  });

  return (
    <group ref={hobbiesRef} scale={scale} position={position} visible={visible}>
      {/* Gaming Controller */}
      <mesh position={[-1.5, 1, 0]}>
        <boxGeometry args={[0.4, 0.2, 0.6]} />
        <primitive object={baseMaterial} />
      </mesh>

      {/* Book */}
      <mesh position={[1.5, 1, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.3, 0.4, 0.1]} />
        <primitive object={baseMaterial} />
      </mesh>

      {/* Camera */}
      <mesh position={[-1, -1, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.3, 32]} />
        <primitive object={baseMaterial} />
      </mesh>

      {/* Music Note */}
      <mesh position={[1, -1, 0]}>
        <torusGeometry args={[0.2, 0.05, 16, 32]} />
        <primitive object={baseMaterial} />
      </mesh>

      {/* Camera Lens */}
      <mesh position={[-1, -1, 0.15]}>
        <cylinderGeometry args={[0.1, 0.1, 0.1, 32]} />
        <primitive object={baseMaterial} />
      </mesh>

      {/* Controller Buttons */}
      <mesh position={[-1.5, 1, 0.3]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <primitive object={baseMaterial} />
      </mesh>
      <mesh position={[-1.5, 1, -0.3]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <primitive object={baseMaterial} />
      </mesh>

      {/* Book Pages */}
      <mesh position={[1.5, 1, 0.05]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.28, 0.38, 0.01]} />
        <primitive object={baseMaterial} />
      </mesh>
    </group>
  );
};

const HobbiesScene = ({ visible = false }) => {
  return (
    <group visible={visible}>
      <Hobbies3D position={[0, 0, -3]} scale={2} visible={visible} />
    </group>
  );
};

export default HobbiesScene;

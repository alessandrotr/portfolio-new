import { useRef, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import store from '../../../appStore';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import '../shaders/WaveShaderMaterial';
import MonumentPopup from './MonumentPopup';

interface VesuviusProps {
  scale?: number;
  position?: [number, number, number];
  visible?: boolean;
}

export default function Vesuvius({
  scale = 1,
  position = [0, 2, -5],
  visible = false,
}: VesuviusProps) {
  const snap = useSnapshot(store);
  const volcanoRef = useRef<THREE.Group>(null);
  const [showPopup, setShowPopup] = useState(false);
  const animationProgress = useRef(0);
  const isAnimating = useRef(false);

  // Create custom geometry for Vesuvius profile with base
  const vesuviusGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const points = [];
    const segments = 200;
    const baseWidth = 8;
    const baseHeight = 0;
    const baseThickness = 0;

    // Create the mountain profile points
    const profilePoints = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = (t - 0.5) * baseWidth;
      let y = 0;

      if (t < 0.35) {
        y = Math.pow(t * 2.8, 1.2) * 2;
      } else if (t < 0.65) {
        const peakT = (t - 0.35) / 0.3;
        y = 2 + Math.sin(peakT * Math.PI * 3) * 0.3;
      } else {
        y = Math.pow((1 - t) * 2.8, 1.2) * 2;
      }

      y += baseThickness;
      profilePoints.push(new THREE.Vector3(x, y, 0));
    }

    // Add the mountain profile
    points.push(...profilePoints);

    // Add vertical lines for the mountain part
    const mountainSegments = 40;
    for (let i = 0; i <= mountainSegments; i++) {
      const t = i / mountainSegments;
      const x = (t - 0.5) * baseWidth;

      const profileIndex = Math.floor(t * segments);
      const y = profilePoints[profileIndex].y;

      if (y > baseThickness) {
        points.push(new THREE.Vector3(x, y, 0));
        points.push(new THREE.Vector3(x, baseThickness, 0));
      }
    }

    // Add vertical lines for just the base part
    const baseSegments = 40;
    for (let i = 0; i <= baseSegments; i++) {
      const t = i / baseSegments;
      const x = (t - 0.5) * baseWidth;

      points.push(new THREE.Vector3(x, baseThickness, 0));
      points.push(new THREE.Vector3(x, baseHeight, 0));
    }

    // Add horizontal lines for the base
    points.push(new THREE.Vector3(-baseWidth / 2, baseHeight, 0));
    points.push(new THREE.Vector3(baseWidth / 2, baseHeight, 0));
    points.push(new THREE.Vector3(-baseWidth / 2, baseThickness, 0));
    points.push(new THREE.Vector3(baseWidth / 2, baseThickness, 0));

    geometry.setFromPoints(points);
    return geometry;
  }, []);

  // Create a single shared material instance with animation uniforms
  const material = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(snap.selectedColor) },
        uTime: { value: 0 },
        uProgress: { value: 0 },
      },
      vertexShader: `
        uniform float uProgress;
        uniform float uTime;
        
        varying vec2 vUv;
        
        void main() {
          vec3 pos = position;
          
          // Calculate animation based on x position
          float delay = (pos.x + 4.0) / 8.0; // Normalize x from [-4,4] to [0,1]
          float progress = smoothstep(delay * 0.9, delay * 0.9 + 0.1, uProgress);
          
          // Animate position
          pos.y *= progress;
          
          // Add subtle wave movement
          pos.y += sin(pos.x * 2.0 + uTime * 2.0) * 0.02 * progress;
          
          vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          
          gl_Position = projectedPosition;
          vUv = uv;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying vec2 vUv;
        
        void main() {
          gl_FragColor = vec4(uColor, 1.0);
        }
      `,
      transparent: true,
    });
    return mat;
  }, []);

  // Update material when color changes
  useEffect(() => {
    const newColor = new THREE.Color(snap.selectedColor);
    material.uniforms.uColor.value.copy(newColor);
  }, [snap.selectedColor, material]);

  // Handle active state animation
  useEffect(() => {
    if (snap.activeScene === 'naples') {
      animationProgress.current = 0;
      isAnimating.current = true;
      material.uniforms.uProgress.value = 0;
    }
  }, [snap.activeScene, material]);

  // Animate the shader and progress
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    material.uniforms.uTime.value = time;

    if (isAnimating.current) {
      animationProgress.current = Math.min(
        animationProgress.current + 0.005,
        1
      );
      material.uniforms.uProgress.value = animationProgress.current;

      if (animationProgress.current === 1) {
        isAnimating.current = false;
      }
    }
  });

  return (
    <group ref={volcanoRef} scale={scale} position={position}>
      {/* Hit area for popup */}
      {visible && (
        <mesh
          position={[0, 2, 0]}
          onPointerEnter={() => setShowPopup(true)}
          onPointerLeave={() => setShowPopup(false)}
          renderOrder={1}
        >
          <boxGeometry args={[6, 4, 2]} />
          <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} />
        </mesh>
      )}

      <MonumentPopup
        position={[0, 3.25, 0]}
        title="Mount Vesuvius"
        description="The iconic active volcano overlooking the Bay of Naples"
        showPopup={showPopup}
        visible={visible}
      />

      {/* Create depth effect with multiple parallel lines */}
      {[0.4, 0.3, 0.2, 0.1, 0].map((zOffset, index) => (
        <lineSegments key={index} position={[0, 0, -zOffset]}>
          <primitive object={vesuviusGeometry} />
          <primitive object={material} />
        </lineSegments>
      ))}
    </group>
  );
}

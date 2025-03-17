import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import store from '../../../appStore';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';

interface Computer3DProps {
  scale?: number;
  position?: [number, number, number];
  visible?: boolean;
}

const Computer3D = ({
  scale = 1,
  position = [0, 0, 0],
  visible = false,
}: Computer3DProps) => {
  const snap = useSnapshot(store);
  const computerRef = useRef<THREE.Group>(null);
  const logosRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.Group>(null);
  const animationProgressRef = useRef(0);

  // Animation spring for line extension
  const { progress } = useSpring({
    from: { progress: 0 },
    to: { progress: visible ? 1 : 0 },
    config: { mass: 1, tension: 80, friction: 30 },
    delay: 300,
  });

  // Create materials
  const monitorMaterial = useMemo(() => {
    const material = new THREE.MeshBasicMaterial({
      color: snap.selectedColor,
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    return material;
  }, [snap.selectedColor]);

  const screenMaterial = useMemo(() => {
    const material = new THREE.MeshBasicMaterial({
      color: snap.selectedColor,
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    return material;
  }, [snap.selectedColor]);

  // Create texture loader and load all tech logos
  const techLogos = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const loadTexture = (path: string) => {
      const texture = loader.load(path);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      return texture;
    };
    return {
      react: loadTexture('/images/tech-stack-logos/react-logo.png'),
      redux: loadTexture('/images/tech-stack-logos/redux-logo.png'),
      typescript: loadTexture('/images/tech-stack-logos/ts-logo.png'),
      javascript: loadTexture('/images/tech-stack-logos/js-logo.png'),
      html: loadTexture('/images/tech-stack-logos/html-logo.png'),
      css: loadTexture('/images/tech-stack-logos/css-logo.png'),
      node: loadTexture('/images/tech-stack-logos/nodejs-logo.png'),
      express: loadTexture('/images/tech-stack-logos/express-logo.png'),
      mongodb: loadTexture('/images/tech-stack-logos/mongodb-logo.png'),
      nextjs: loadTexture('/images/tech-stack-logos/nextjs-logo.png'),
      threejs: loadTexture('/images/tech-stack-logos/threejs-logo.png'),
    };
  }, []);

  // Update materials when color changes
  useEffect(() => {
    if (monitorMaterial && screenMaterial) {
      monitorMaterial.color = new THREE.Color(snap.selectedColor);
      screenMaterial.color = new THREE.Color(snap.selectedColor);
    }
  }, [snap.selectedColor, monitorMaterial, screenMaterial]);

  // Animation frame update
  useFrame(() => {
    const currentProgress = progress.get();
    animationProgressRef.current = currentProgress;

    // Update line progress uniforms
    if (linesRef.current) {
      linesRef.current.children.forEach((line) => {
        const lineObject = line as THREE.Line;
        if (lineObject.material && 'uniforms' in lineObject.material) {
          const material = lineObject.material as THREE.ShaderMaterial;
          material.uniforms.color.value = new THREE.Color(snap.selectedColor);
          material.uniforms.globalProgress.value = currentProgress;
        }
      });
    }

    // Update logo opacity with staggered delay
    if (logosRef.current) {
      logosRef.current.children.forEach((logo, index) => {
        if (logo instanceof THREE.Mesh) {
          const material = logo.material as THREE.MeshBasicMaterial;
          const normalizedIndex = index / (logoConfigs.length - 1);
          const delay = normalizedIndex * 0.5;
          const staggeredProgress = Math.max(
            0,
            Math.min(1, (currentProgress - delay) / (1.0 - delay))
          );
          material.opacity = staggeredProgress;
        }
      });
    }
  });

  // Create connection lines with animation
  const createConnectionLine = (
    start: THREE.Vector3,
    end: THREE.Vector3,
    index: number
  ) => {
    // Create fixed control points for the curve
    const midPoint = new THREE.Vector3(
      (start.x + end.x) / 2,
      (start.y + end.y) / 2,
      (start.z + end.z) / 2
    );

    const control1 = new THREE.Vector3(
      midPoint.x * 0.25,
      midPoint.y + Math.abs(end.y - start.y) * 0.2,
      midPoint.z
    );

    const control2 = new THREE.Vector3(
      midPoint.x + (end.x - midPoint.x) * 0.75,
      midPoint.y + Math.abs(end.y - start.y) * 0.2,
      midPoint.z
    );

    // Create the full curve
    const curve = new THREE.CubicBezierCurve3(start, control1, control2, end);

    // Create geometry with more points for smoother curves
    const curvePoints = curve.getPoints(75);
    const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);

    // Create a custom shader material that uses progress for line extension
    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(snap.selectedColor) },
        progress: { value: 0 },
        globalProgress: { value: 0 },
        index: { value: index },
        totalLines: { value: 9 },
      },
      vertexShader: `
        uniform float progress;
        uniform float globalProgress;
        uniform float index;
        uniform float totalLines;
        varying float vProgress;
        
        void main() {
          vProgress = position.y;
          vec3 pos = position;
          
          // Calculate staggered progress with shorter delays
          float normalizedIndex = index / totalLines;
          float delay = normalizedIndex * 0.5;
          float staggeredProgress = clamp((globalProgress - delay) / (1.0 - delay), 0.0, 1.0);
          
          // Smoother scaling with custom easing
          float p = staggeredProgress;
          float easeInOut = p < 0.5 
            ? 4.0 * p * p * p 
            : 1.0 - pow(-2.0 * p + 2.0, 3.0) / 2.0;
            
          // Scale position with smooth easing
          vec3 scaledPos = mix(vec3(0.0, 0.0, pos.z), pos, easeInOut);
          
          // Add slight wave effect
          float wave = sin(easeInOut * 3.14159) * (1.0 - easeInOut) * 0.1;
          scaledPos.x += wave * sign(pos.x);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(scaledPos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float globalProgress;
        uniform float index;
        uniform float totalLines;
        varying float vProgress;
        
        void main() {
          float normalizedIndex = index / totalLines;
          float delay = normalizedIndex * 0.5;
          float staggeredProgress = clamp((globalProgress - delay) / (1.0 - delay), 0.0, 1.0);
          gl_FragColor = vec4(color, 0.35 * staggeredProgress);
        }
      `,
      transparent: true,
    });

    return (
      <line>
        <primitive object={geometry} attach="geometry" />
        <primitive object={material} attach="material" />
      </line>
    );
  };

  // Define logo positions and maintain aspect ratios
  const logoConfigs = [
    {
      texture: techLogos.react,
      position: new THREE.Vector3(-2.0, 1.5, 0),
      baseScale: 0.4,
    }, // React (top left)
    {
      texture: techLogos.redux,
      position: new THREE.Vector3(2.0, 1.5, 0),
      baseScale: 0.3,
    }, // Redux (top right)
    {
      texture: techLogos.typescript,
      position: new THREE.Vector3(-2.2, 0.5, 0),
      baseScale: 0.4,
    }, // TypeScript (middle-high left)
    {
      texture: techLogos.javascript,
      position: new THREE.Vector3(2.2, 0.5, 0),
      baseScale: 0.3,
    }, // JavaScript (middle-high right)
    {
      texture: techLogos.html,
      position: new THREE.Vector3(-2.0, -0.5, 0),
      baseScale: 0.3,
    }, // HTML (middle-low left)
    {
      texture: techLogos.css,
      position: new THREE.Vector3(2.0, -0.5, 0),
      baseScale: 0.4,
    }, // CSS (middle-low right)
    {
      texture: techLogos.nextjs,
      position: new THREE.Vector3(-2.4, -2.0, 0),
      baseScale: 0.4,
    }, // Next.js (bottom far left)
    {
      texture: techLogos.node,
      position: new THREE.Vector3(-1.2, -2.0, 0),
      baseScale: 0.3,
    }, // Node (bottom center-left)
    {
      texture: techLogos.express,
      position: new THREE.Vector3(0, -2.0, 0),
      baseScale: 0.3,
    }, // Express (bottom center)
    {
      texture: techLogos.mongodb,
      position: new THREE.Vector3(1.2, -2.0, 0),
      baseScale: 0.8,
    }, // MongoDB (bottom center-right)
    {
      texture: techLogos.threejs,
      position: new THREE.Vector3(2.4, -2.0, 0),
      baseScale: 0.3,
    }, // Three.js (bottom far right)
  ];

  return (
    <group
      ref={computerRef}
      scale={scale}
      position={position}
      visible={visible}
    >
      {/* Monitor Frame - Commented out for now
      <group>
        {/* Main Frame */
      /*}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.8, 0.5, 0.03]} />
          <primitive object={monitorMaterial} attach="material" />
        </mesh>

        {/* Screen */
      /*}
        <mesh position={[0, 0.2, 0.02]}>
          <planeGeometry args={[0.75, 0.45]} />
          <primitive object={screenMaterial} attach="material" />
        </mesh>

        {/* Stand Neck - Modern Design */
      /*}
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[0.04, 0.3, 0.03]} />
          <primitive object={monitorMaterial} attach="material" />
        </mesh>

        {/* Stand Base - Modern Design */
      /*}
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[0.25, 0.05, 0.15]} />
          <primitive object={monitorMaterial} attach="material" />
        </mesh>
      </group>
      */}

      {/* Technology Logos */}
      <group ref={logosRef}>
        {logoConfigs.map((config, index) => {
          const texture = config.texture;
          const aspectRatio = texture.image
            ? texture.image.width / texture.image.height
            : 1;
          const width = config.baseScale;
          const height = config.baseScale / aspectRatio;

          return (
            <mesh key={index} position={config.position}>
              <planeGeometry args={[width, height]} />
              <meshBasicMaterial
                map={texture}
                transparent={true}
                side={THREE.DoubleSide}
                depthWrite={false}
                opacity={0}
              />
            </mesh>
          );
        })}
      </group>

      {/* Connection Lines */}
      <animated.group ref={linesRef}>
        {logoConfigs.map((config, index) =>
          createConnectionLine(
            new THREE.Vector3(0, 0, 0),
            config.position,
            index
          )
        )}
      </animated.group>
    </group>
  );
};

const WhatScene = ({ visible = false }) => {
  return (
    <group visible={visible}>
      <Computer3D position={[0, 1.25, -3]} scale={1.5} visible={visible} />
    </group>
  );
};

export default WhatScene;

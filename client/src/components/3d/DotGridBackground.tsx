import { useMemo, useRef, useEffect, useState } from 'react';
import { ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { shaderMaterial, useTrailTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useSnapshot } from 'valtio';
import store from '../../appStore';
import tailwindColors from '../../tailwindColors';

const DotMaterial = shaderMaterial(
  {
    time: 0,
    resolution: new THREE.Vector2(),
    dotColor: new THREE.Color(`${tailwindColors['items']}`),
    rippleDotColor: new THREE.Color('#ffffff'),
    bgColor: new THREE.Color(`${tailwindColors['bgDark']}`),
    mouseTrail: null,
    clickPosition: new THREE.Vector2(-1, -1),
    rippleTime: -1,
    rotation: 35,
    gridSize: 50,
    opacityFactor: 1.0,
    isMousePressed: 0.0,
    dotOpacity: 0.03,
  },
  /* glsl */ `
      void main() {
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `,
  /* glsl */ `
      uniform float time;
      uniform float rippleTime;
      uniform vec2 clickPosition;
      uniform vec2 resolution;
      uniform vec3 dotColor;
      uniform vec3 rippleDotColor;
      uniform vec3 bgColor;
      uniform sampler2D mouseTrail;
      uniform float rotation;
      uniform float gridSize;
      uniform float opacityFactor; // Uniform for opacity adjustment
      uniform float isMousePressed; 
      uniform float dotOpacity; 

      vec2 rotate(vec2 uv, float angle) {
          float s = sin(angle);
          float c = cos(angle);
          mat2 rotationMatrix = mat2(c, -s, s, c);
          return rotationMatrix * (uv - 0.5) + 0.5;
      }

      vec2 coverUv(vec2 uv) {
          vec2 s = resolution.xy / max(resolution.x, resolution.y);
          vec2 newUv = (uv - 0.5) * s + 0.5;
          return clamp(newUv, 0.0, 1.0);
      }

      float sdfCircle(vec2 p, float r) {
          return length(p - 0.5) - r;
      }

      void main() {
        vec2 screenUv = gl_FragCoord.xy / resolution;
        vec2 uv = coverUv(screenUv);

        vec2 rotatedUv = rotate(uv, rotation);

        // Create a grid
        vec2 gridUv = fract(rotatedUv * gridSize);
        vec2 gridUvCenterInScreenCoords = rotate((floor(rotatedUv * gridSize) + 0.5) / gridSize, -rotation);

        // Screen mask
        float screenMask = smoothstep(0.0, 0.4, 1.5 - uv.y); // 0 at the top, 1 at the bottom
        vec2 centerDisplace = vec2(0.6, 1.1);
        float circleMaskCenter = length(uv - centerDisplace);
        float circleMaskFromCenter = smoothstep(0.5, 1.0, circleMaskCenter);

        float combinedMask = screenMask * circleMaskFromCenter;
        float circleAnimatedMask = sin(time * 2.0 + circleMaskCenter * 10.0);

        // Ripple effect
        float ripple = 0.0; // Initialize ripple effect
        if (rippleTime >= 0.0) {
            float dist = length(uv - clickPosition); // Distance from the ripple's center
            float wave = sin(dist * 80.0 - rippleTime * 5.0) * exp(-dist * 10.0); 
            ripple = smoothstep(0.0, 0.1, 0.06 - dist) * wave; 
        }

        // Mouse trail effect
        float mouseInfluence = texture2D(mouseTrail, gridUvCenterInScreenCoords).r;

        // Create dots with animated scale, influenced by ripple effect
        float dotSize = min(pow(circleMaskCenter, 3.0) * 0.5, 0.3);

        // Ripple size influence - Ripple will affect both the color and size
        float rippleSizeInfluence = mix(1.0, 1.5, ripple); // Ripple will scale up the size of the dots

        // Apply ripple size influence to dot size
        float sdfDot = sdfCircle(gridUv, dotSize * rippleSizeInfluence * (1.0 + circleAnimatedMask * 0.5));
        float smoothDot = smoothstep(0.05, 0.0, sdfDot);

        // Global dot opacity, now only influenced by mouse trail and opacityFactor
        float dotOpacityAdjusted = dotOpacity * opacityFactor; // Adjust based on theme opacity
        float opacityInfluence = max(mouseInfluence * 15.0, circleAnimatedMask * 0.5);

        // **Only adjust opacity of trail dots when mouse is pressed**
        if (isMousePressed > 0.0) {
            dotOpacityAdjusted = mix(dotOpacityAdjusted, 1.0, mouseInfluence); // Reduce opacity for trail dots when mouse is held down
        }

        // **Change to Ripple Effect Color**: Dots affected by ripple will use the dot color without opacity
        vec3 dotColorFinal = ripple > 0.0 ? dotColor : mix(dotColor, rippleDotColor, ripple); // If ripple, use dotColor (5fd9f9) without opacity

        // **Ensure Ripple-affected Dots Have Full Opacity**:
        float finalOpacity = ripple > 0.0 ? 1.0 : dotOpacityAdjusted * (1.0 + opacityInfluence); // Ripple dots are fully opaque

        // Mix background color with dot color, ensuring full opacity for ripple-affected dots
        vec3 composition = mix(bgColor, dotColorFinal, smoothDot * combinedMask * finalOpacity);

        gl_FragColor = vec4(composition, 1.0);

        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `
);

export default function DotGridBackground() {
  const size = useThree((s) => s.size);
  const viewport = useThree((s) => s.viewport);
  const snap = useSnapshot(store); // Get snap state

  const [trail, onMove] = useTrailTexture({
    size: 512,
    radius: 0.1,
    maxAge: 400,
    interpolate: 1,
    ease: function easeInOutCirc(x) {
      return x < 0.5
        ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
        : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
    },
  });

  const dotMaterial = useMemo(() => {
    return new DotMaterial();
  }, []);

  interface CustomShaderMaterial extends THREE.ShaderMaterial {
    uniforms: {
      bgColor: { value: THREE.Color };
      dotColor: { value: THREE.Color };
      dotOpacity: { value: number };
    };
  }

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (snap.theme === 'dark') {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        const material = dotMaterial as CustomShaderMaterial;
        if (material && material.uniforms) {
          material.uniforms.bgColor.value = new THREE.Color(
            `${tailwindColors['bgDark']}`
          );
          dotMaterial.uniforms.dotColor.value = new THREE.Color(
            store.selectedColor
          );
          material.uniforms.dotOpacity.value = 0.03;
        } else {
          console.warn(
            'dotMaterial does not have the expected uniforms or bgColor property'
          );
        }
      }, 300);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      const material = dotMaterial as CustomShaderMaterial;
      if (material && material.uniforms) {
        material.uniforms.bgColor.value = new THREE.Color(
          `${tailwindColors['bgLight']}`
        );
        dotMaterial.uniforms.dotColor.value = new THREE.Color(
          store.selectedColor
        );

        material.uniforms.dotOpacity.value = 0.3;
      } else {
        console.warn(
          'dotMaterial does not have the expected uniforms or bgColor property'
        );
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [snap.theme, snap.selectedColor, dotMaterial]);

  const rippleTimeRef = useRef(-1);
  const clockRef = useRef(new THREE.Clock());

  const [opacityFactor, setOpacityFactor] = useState(1.0);
  const lastPageActiveRef = useRef(snap.pageActive);

  const [isMousePressed, setIsMousePressed] = useState(false); // Track mouse press state
  const [pressStartTime, setPressStartTime] = useState(0); // Track the press start time

  useEffect(() => {
    const animateOpacityTransition = (targetOpacity: number) => {
      const animate = () => {
        setOpacityFactor((prev) => {
          const delta = (targetOpacity - prev) * 0.05; // Smooth step
          if (Math.abs(delta) < 0.001) return targetOpacity; // Stop when close to target
          return prev + delta;
        });

        if (Math.abs(opacityFactor - targetOpacity) > 0.001) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    };
    // Only animate if pageActive changes
    const targetOpacity = snap.pageActive === 'Projects' ? 0.15 : 1.0;
    if (snap.pageActive == 'Projects') {
      lastPageActiveRef.current = snap.pageActive;
      animateOpacityTransition(targetOpacity);
    } else {
      animateOpacityTransition(targetOpacity);
    }
  }, [snap.pageActive, opacityFactor]);

  const animateRipple = () => {
    const clock = clockRef.current;
    if (rippleTimeRef.current >= 0) {
      const elapsed = clock.getElapsedTime();
      rippleTimeRef.current = elapsed;
      dotMaterial.uniforms.rippleTime.value = elapsed;

      if (elapsed > 2) {
        rippleTimeRef.current = -1; // Stop ripple after 2 seconds
        dotMaterial.uniforms.rippleTime.value = -1;
      } else {
        requestAnimationFrame(animateRipple); // Keep animating
      }
    }
  };

  const handlePointerDown = () => {
    setPressStartTime(clockRef.current.getElapsedTime());
    setIsMousePressed(true); // Start the trail effect
  };

  const handlePointerUp = (e: ThreeEvent<MouseEvent>) => {
    const pressDuration = clockRef.current.getElapsedTime() - pressStartTime;

    // If the press was short, trigger the ripple
    if (pressDuration < 0.3) {
      handleClick(e); // Trigger ripple effect
    }

    setIsMousePressed(false); // End the trail effect
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    const uv = e.uv || { x: 0.5, y: 0.5 };
    dotMaterial.uniforms.clickPosition.value = new THREE.Vector2(uv.x, uv.y);

    rippleTimeRef.current = 0; // Start ripple
    clockRef.current.start(); // Reset clock
    animateRipple(); // Start animation
  };

  const scale = Math.max(viewport.width, viewport.height) / 2;

  useFrame((state) => {
    dotMaterial.uniforms.time.value = state.clock.elapsedTime;
  });

  return (
    <mesh
      scale={[scale, scale, 1]}
      onPointerMove={(e) => onMove(e)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      renderOrder={1}
    >
      <planeGeometry args={[2, 2]} />
      <primitive
        object={dotMaterial}
        resolution={[size.width * viewport.dpr, size.height * viewport.dpr]}
        gridSize={100}
        mouseTrail={trail}
        opacityFactor={opacityFactor} // Pass opacityFactor to the shader
        isMousePressed={isMousePressed ? 1.0 : 0.0} // Pass the mouse press state to the shader
        depthWrite={false}
        renderOrder={1}
      />
    </mesh>
  );
}

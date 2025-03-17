import { useMemo, useRef, useEffect, useState } from 'react';
import { ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { shaderMaterial, useTrailTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useSnapshot } from 'valtio';
import { useLocation } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/three';
import store from '../../../appStore';
import tailwindColors from '../../../tailwindColors';
import useSound from 'use-sound';
import sphereDotfx from '/sounds/glitch.mp3';
import { useScreenSize } from '../../../hooks/useScreenSize';
import BerlinScene from '../scenes/BerlinScene';
import NaplesScene from '../scenes/NaplesScene';

interface SphereBehavior {
  x: number;
  y: number;
  z: number;
  scale: number;
  opacity: number;
  springConfig?: {
    mass?: number;
    tension?: number;
    friction?: number;
  };
}

const sphereBehaviors: Record<string, SphereBehavior> = {
  '/': {
    x: 0,
    y: 0,
    z: 0,
    scale: 0.14,
    opacity: 1.0,
    springConfig: {
      mass: 1,
      tension: 120,
      friction: 45,
    },
  },
  '/projects': {
    x: 0,
    y: 0.2,
    z: -0.1,
    scale: 0.16,
    opacity: 0.8,
    springConfig: {
      mass: 1.2,
      tension: 100,
      friction: 50,
    },
  },
  '/about': {
    x: 0,
    y: -10,
    z: -3,
    scale: 0.2,
    opacity: 0.5,
    springConfig: {
      mass: 0.8,
      tension: 140,
      friction: 40,
    },
  },
  '/contact': {
    x: 0,
    y: -0.6,
    z: -0.5,
    scale: 0.28,
    opacity: 0.2,
    springConfig: {
      mass: 0.8,
      tension: 140,
      friction: 40,
    },
  },
  '/privacy-policy': {
    x: 0,
    y: -0.6,
    z: -0.5,
    scale: 0.25,
    opacity: 0.2,
    springConfig: {
      mass: 1,
      tension: 120,
      friction: 45,
    },
  },
};

// Helper function to get behavior for current location
const getSphereBehavior = (
  location: string,
  screenSize: string
): SphereBehavior => {
  // Remove language prefix if present (e.g., /en/ or /it/)
  const normalizedPath = location.replace(/^\/[a-z]{2}\//, '/');

  // Check for about routes first
  if (normalizedPath.startsWith('/about')) {
    return sphereBehaviors['/about'] || sphereBehaviors['/'];
  }

  // For other routes, use exact match or fallback to home
  const baseBehavior = sphereBehaviors[normalizedPath] || sphereBehaviors['/'];

  // Adjust scale for mobile
  if (screenSize === 'mobile' && normalizedPath !== '/privacy-policy') {
    return {
      ...baseBehavior,
      scale: 0.29,
    };
  }

  return baseBehavior;
};

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
    rippleSpeed: 3.0,
    rippleSize: 0.2,
    rotation: 35,
    opacityFactor: 1.0,
    isMousePressed: 0.0,
    dotOpacity: 0.03,
    isPrivacyPage: 0.0,
    morphFactor: 0.0,
  },
  /* glsl */ `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float morphFactor;

    void main() {
      vUv = uv;
      
      // Calculate sphere position
      vec3 spherePosition = position;
      
      // Calculate floor plane position
      vec3 planePosition;
      
      // First rotate the sphere to lay flat (90 degrees around X axis)
      float angle = -3.14159 / 2.0;
      vec3 rotated = vec3(
        position.x,
        position.y * cos(angle) - position.z * sin(angle),
        position.y * sin(angle) + position.z * cos(angle)
      );
      
      // Then transform into a flat plane
      planePosition = vec3(
        rotated.x * 8.0,           // Double X stretch
        -0.5,                      // Fixed Y position for floor
        rotated.z * 8.0            // Double Z stretch
      );
      
      // Interpolate between sphere and plane positions
      vec3 morphedPosition = mix(spherePosition, planePosition, morphFactor);
      
      // Calculate normal based on morphed position
      vec3 morphedNormal = mix(
        normalize(position),
        vec3(0.0, 1.0, 0.0),      // Floor plane normal points straight up
        morphFactor
      );
      
      vNormal = normalize(normalMatrix * morphedNormal);
      vPosition = morphedPosition;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(morphedPosition, 1.0);
    }
  `,
  /* glsl */ `
    uniform float time;
    uniform vec2 resolution;
    uniform vec3 dotColor;
    uniform vec3 rippleDotColor;
    uniform vec3 bgColor;
    uniform sampler2D mouseTrail;
    uniform vec2 clickPosition;
    uniform float rippleTime;
    uniform float rippleSpeed;
    uniform float rippleSize;
    uniform float rotation;
    uniform float opacityFactor;
    uniform float isMousePressed;
    uniform float dotOpacity;
    uniform float isPrivacyPage;
    uniform float morphFactor;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    float smoothNoise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));

      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    float getDot(vec2 uv, float scale, float aspectRatio) {
      vec2 center = vec2(0.5);
      vec2 adjustedUV = vec2(
        (uv.x - center.x) * aspectRatio + center.x,
        uv.y
      );
      float dist = length(adjustedUV - center);
      return smoothstep(0.2 * scale, 0.15 * scale, dist);
    }

    float getGrid(vec2 uv) {
      vec2 grid = abs(fract(uv - 0.5) - 0.5) / fwidth(uv);
      float line = min(grid.x, grid.y);
      return 1.0 - smoothstep(0.0, 1.5, line);
    }

    vec2 getGridUV() {
      // For sphere state
      vec3 pos = normalize(vPosition);
      float phi = atan(pos.z, pos.x);
      float theta = acos(pos.y);
      vec2 sphereUV = vec2(
        fract(phi / (2.0 * 3.14159) * 64.0),
        fract(theta / 3.14159 * 32.0)
      );
      
      // For plane state - use regular grid pattern
      vec2 planeUV = vec2(
        fract(vPosition.x * 4.0 + 0.5),  // Adjust the 8.0 to control dot density
        fract(vPosition.z * 4.0 + 0.5)   // Use x and z coordinates for plane
      );
      
      // Interpolate between sphere and plane UVs
      return mix(sphereUV, planeUV, morphFactor);
    }

    vec2 getGlobalUV() {
      vec3 pos = normalize(vPosition);
      float phi = atan(pos.z, pos.x);
      float theta = acos(pos.y);
      vec2 sphereUV = vec2(
        phi / (2.0 * 3.14159) * 64.0,
        theta / 3.14159 * 32.0
      );
      
      vec2 planeUV = vPosition.xy * 16.0 + 0.5;
      
      return mix(sphereUV, planeUV, morphFactor);
    }

    void main() {
      vec2 gridUv = getGridUV();
      vec2 globalUv = getGlobalUV();

      // Opening pattern effect
      float wave = sin(atan(vPosition.z, vPosition.x) * 8.0 + time * 2.0) * 0.5 + 0.5;
      float opening = smoothstep(0.0, 1.0, wave + acos(vPosition.y) * 0.8);
      opening = mix(1.0, opening, isPrivacyPage);
      
      // Generate smooth random opacity variation
      vec2 randomSeed = vec2(floor(globalUv.x), floor(globalUv.y));
      float randomOpacity = mix(0.3, 0.9, smoothNoise(randomSeed + time * 0.05));
      
      float trailInfluence = texture2D(mouseTrail, vUv).r;
      float dotScale = mix(1.0, 3.0, trailInfluence);
      
      // Adjust pole compensation based on morph
      float poleCompensation = mix(1.0, sin(acos(vPosition.y)), 1.0 - morphFactor);
      dotScale *= poleCompensation;
      
      // Calculate aspect ratio compensation
      float aspectRatio = mix(1.0, 1.0, morphFactor); // No compensation needed for plane
      
      float dot = getDot(gridUv, dotScale, aspectRatio);
      float grid = getGrid(globalUv) * 0.15;

      // Add ripple effect
      float rippleEffect = 0.0;
      if (rippleTime > 0.0) {
        float dist = length(vUv - clickPosition);
        float wave = sin(dist * 30.0 - rippleTime * rippleSpeed) * 0.5 + 0.5;
        float rippleMask = 1.0 - smoothstep(0.0, rippleSize, abs(dist - rippleTime * 0.5));
        rippleEffect = wave * rippleMask;
      }

      vec3 finalColor = mix(bgColor, dotColor, max(dot, grid));
      finalColor = mix(finalColor, rippleDotColor, rippleEffect * 0.5);
      float alpha = (dot + grid + rippleEffect) * mix(0.5, 1.0, trailInfluence) * opacityFactor * randomOpacity * opening;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

const BackgroundMaterial = shaderMaterial(
  {
    time: 0,
    resolution: new THREE.Vector2(),
    bgColor: new THREE.Color(`${tailwindColors['bgDark']}`),
  },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  /* glsl */ `
    uniform vec3 bgColor;
    varying vec2 vUv;
    void main() {
      gl_FragColor = vec4(bgColor, 1.0);
      }
    `
);

const WireframeMaterial = shaderMaterial(
  {
    time: 0,
    mouseTrail: null,
    wireColor: new THREE.Color(),
    baseOpacity: 0.05,
    pulseColor: new THREE.Color('#ffffff'),
    transitionProgress: 0.0,
    hasReachedMax: 0.0,
    fadeOutProgress: 1.0,
    deactivationProgress: 1.0,
    morphFactor: 0.0,
  },
  /* glsl */ `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform float morphFactor;

    void main() {
      vUv = uv;
      
      // Calculate sphere position
      vec3 spherePosition = position;
      
      // Calculate floor plane position
      vec3 planePosition;
      
      // First rotate the sphere to lay flat (90 degrees around X axis)
      float angle = -3.14159 / 2.0;
      vec3 rotated = vec3(
        position.x,
        position.y * cos(angle) - position.z * sin(angle),
        position.y * sin(angle) + position.z * cos(angle)
      );
      
      // Then transform into a flat plane
      planePosition = vec3(
        rotated.x * 8.0,           // Double X stretch
        -0.5,                      // Fixed Y position for floor
        rotated.z * 8.0            // Double Z stretch
      );
      
      // Interpolate between sphere and plane positions
      vec3 morphedPosition = mix(spherePosition, planePosition, morphFactor);
      
      // Calculate normal based on morphed position
      vec3 morphedNormal = mix(
        normalize(position),
        vec3(0.0, 1.0, 0.0),      // Floor plane normal points straight up
        morphFactor
      );
      
      vPosition = morphedPosition;
      vNormal = normalize(normalMatrix * morphedNormal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(morphedPosition, 1.0);
    }
  `,
  /* glsl */ `
    uniform float time;
    uniform sampler2D mouseTrail;
    uniform vec3 wireColor;
    uniform vec3 pulseColor;
    uniform float baseOpacity;
    uniform float transitionProgress;
    uniform float hasReachedMax;
    uniform float fadeOutProgress;
    uniform float deactivationProgress;
    uniform float morphFactor;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;

    float easeExpo(float x) {
      return x == 0.0 ? 0.0 : pow(2.0, 10.0 * x - 10.0);
    }

    void main() {
      // Apply exponential easing to the transition
      float easedProgress = easeExpo(transitionProgress);
      
      // Start with very subtle opacity that grows exponentially
      float opacity = easedProgress * 0.8; // Max opacity of 0.8
      
      // When max is reached, add pulsing and glow effects
      if (hasReachedMax > 0.5) {
        float pulse = sin(time * 3.0) * 0.2 + 0.8;
        opacity = opacity * pulse;
        
        // Add rim lighting effect when maxed
        float rimLight = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
        opacity += rimLight * 0.3;
      }
      
      // Apply fade out transition with easing
      float easedFade = easeExpo(fadeOutProgress);
      opacity *= easedFade;
      
      // Apply deactivation transition
      float easedDeactivation = easeExpo(deactivationProgress);
      opacity *= easedDeactivation;
      
      // Color transitions to brighter when maxed
      vec3 finalColor = wireColor;
      if (hasReachedMax > 0.5) {
        finalColor = mix(wireColor, pulseColor, 0.3);
      }
      
      gl_FragColor = vec4(finalColor, opacity);
    }
  `
);

interface LightRayMaterialParameters extends THREE.ShaderMaterialParameters {
  time?: number;
  dotColor?: THREE.Color;
  rayColor?: THREE.Color;
  rayIntensity?: number;
  raySpeed?: number;
  activeDots?: Float32Array;
}

const LightRayMaterial = shaderMaterial(
  {
    time: 0,
    dotColor: new THREE.Color(),
    rayColor: new THREE.Color(store.selectedColor),
    rayIntensity: 300.0,
    raySpeed: 0.0003,
    activeDots: new Float32Array(64 * 32),
  },
  /* glsl */ `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying float vDistance;
    varying float vDotIndex;

    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      vDistance = length(position);
      
      // Calculate which dot this vertex belongs to
      vec3 pos = normalize(position);
      float phi = atan(pos.z, pos.x);
      float theta = acos(pos.y);
      float dotsX = 64.0;
      float dotsY = 32.0;
      float dotX = floor(phi / (2.0 * 3.14159) * dotsX);
      float dotY = floor(theta / 3.14159 * dotsY);
      vDotIndex = dotX + dotY * dotsX;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl */ `
    uniform float time;
    uniform vec3 dotColor;
    uniform vec3 rayColor;
    uniform float rayIntensity;
    uniform float raySpeed;
    uniform float activeDots[2048];
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying float vDistance;
    varying float vDotIndex;

    void main() {
      // Check if this dot is active
      float isActive = activeDots[int(vDotIndex)];
      
      // Create a pulsing effect based on distance
      float pulse = sin(time * raySpeed - vDistance * 0.2) * 0.5 + 0.5;
      
      // Fade out with distance
      float fade = 1.0 - smoothstep(0.0, 12.0, vDistance);
      
      // Only show rays for active dots
      float rayEffect = isActive * pulse * fade;
      
      // Combine effects with stronger intensity
      vec3 finalColor = mix(dotColor, rayColor, rayEffect * rayIntensity);
      float alpha = rayEffect * rayIntensity;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

export default function DotGridBackground() {
  const size = useThree((s) => s.size);
  const viewport = useThree((s) => s.viewport);
  const snap = useSnapshot(store);
  const location = useLocation();
  const screenSize = useScreenSize();

  const rotationRef = useRef({ x: 0, y: 0, z: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0, z: 0 });
  const isHoveringRef = useRef(false);
  const groupRef = useRef<THREE.Group>(null);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const lastMoveTimeRef = useRef(0);
  const hasRotatedRef = useRef(false);
  const rotationSpringRef = useRef({ x: 0, y: 0, z: 0 });
  const isResettingRef = useRef(false);
  const deactivationStartTimeRef = useRef(0);

  const [trail, onMove] = useTrailTexture({
    size: 512,
    radius: 0.15,
    maxAge: 100,
    interpolate: 2,
    ease: function easeOutQuad(x) {
      return 1 - (1 - x) * (1 - x);
    },
  });

  const dotMaterial = useMemo(() => new DotMaterial(), []);
  const bgMaterial = useMemo(() => new BackgroundMaterial(), []);
  const wireframeMaterial = useMemo(() => new WireframeMaterial(), []);

  // Create ray objects for each dot
  const rayObjects = useMemo(() => {
    const objects = [];
    const dotsX = 32; // More rays for better coverage
    const dotsY = 16; // More rays for better coverage
    const rayLength = 4.0; // Longer rays
    const segments = 4; // More segments for smoother rays

    // Create a more evenly distributed grid using spherical coordinates
    for (let y = 0; y < dotsY; y++) {
      for (let x = 0; x < dotsX; x++) {
        // Calculate spherical coordinates
        const phi = (x / dotsX) * Math.PI * 2; // Azimuthal angle
        const theta = (y / dotsY) * Math.PI; // Polar angle

        // Convert to Cartesian coordinates
        const dotPos = new THREE.Vector3(
          Math.sin(theta) * Math.cos(phi),
          Math.cos(theta),
          Math.sin(theta) * Math.sin(phi)
        );

        // Add slight randomization to prevent perfect grid
        const randomOffset = 0.1;
        dotPos.x += (Math.random() - 0.5) * randomOffset;
        dotPos.y += (Math.random() - 0.5) * randomOffset;
        dotPos.z += (Math.random() - 0.5) * randomOffset;
        dotPos.normalize();

        // Create ray geometry
        const rayGeometry = new THREE.BufferGeometry();
        const vertices = new Float32Array((segments + 1) * 3);
        const indices = new Uint32Array(segments * 2);

        // Set initial position at dot
        vertices[0] = dotPos.x;
        vertices[1] = dotPos.y;
        vertices[2] = dotPos.z;

        // Create segments with exponential scaling for better visual effect
        for (let i = 0; i < segments; i++) {
          const t = (i + 1) / segments;
          const scale = 1 + rayLength * Math.pow(t, 1.5); // Exponential scaling
          const pos = dotPos.clone().multiplyScalar(scale);
          vertices[(i + 1) * 3] = pos.x;
          vertices[(i + 1) * 3 + 1] = pos.y;
          vertices[(i + 1) * 3 + 2] = pos.z;

          // Create line segments
          indices[i * 2] = i;
          indices[i * 2 + 1] = i + 1;
        }

        rayGeometry.setAttribute(
          'position',
          new THREE.BufferAttribute(vertices, 3)
        );
        rayGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

        // Create ray material with animation
        const rayMaterial = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            dotColor: { value: new THREE.Color() },
            rayColor: { value: new THREE.Color(snap.selectedColor) },
            rayIntensity: { value: 2.0 }, // Increased intensity
            raySpeed: { value: 0.01 }, // Very slow speed
            isActive: { value: 0.0 },
            rayProgress: { value: 0.0 },
          },
          vertexShader: `
            varying vec3 vPosition;
            varying float vDistance;
            varying float vSegment;
            void main() {
              vPosition = position;
              vDistance = length(position);
              vSegment = float(gl_VertexID) / ${segments}.0;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform float time;
            uniform vec3 dotColor;
            uniform vec3 rayColor;
            uniform float rayIntensity;
            uniform float raySpeed;
            uniform float isActive;
            uniform float rayProgress;
            
            varying vec3 vPosition;
            varying float vDistance;
            varying float vSegment;

            void main() {
              // Only show the ray up to the current progress
              float progressMask = step(vSegment, rayProgress);
              
              // Fade out with distance using exponential falloff
              float fade = 1.0 - smoothstep(0.0, 4.0, vDistance);
              fade = pow(fade, 1.5); // Sharper falloff
              
              // Only show rays for active dots
              float rayEffect = isActive * progressMask * fade;
              
              // Combine effects
              vec3 finalColor = mix(dotColor, rayColor, rayEffect * rayIntensity);
              float alpha = rayEffect * rayIntensity;
              
              gl_FragColor = vec4(finalColor, alpha);
            }
          `,
          transparent: true,
          depthTest: false,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });

        objects.push({
          geometry: rayGeometry,
          material: rayMaterial,
          dotIndex: y * dotsX + x,
          startTime: 0,
        });
      }
    }
    return objects;
  }, []);

  const lightRayMaterial = useMemo(
    () =>
      new LightRayMaterial({
        time: 0,
        dotColor: new THREE.Color(),
        rayColor: new THREE.Color('#ffffff'),
        rayIntensity: 3.0,
        raySpeed: 0.3,
        activeDots: new Float32Array(64 * 32),
      } as LightRayMaterialParameters),
    []
  );

  interface CustomShaderMaterial extends THREE.ShaderMaterial {
    uniforms: {
      bgColor: { value: THREE.Color };
      dotColor: { value: THREE.Color };
      dotOpacity: { value: number };
      wireColor?: { value: THREE.Color };
      mouseTrail?: { value: THREE.Texture | null };
      baseOpacity?: { value: number };
    };
  }

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [playPop] = useSound(sphereDotfx, {
    volume: snap.volume,
    interrupt: true,
  });

  const rippleTimeRef = useRef(-1);
  const clockRef = useRef(new THREE.Clock());
  const [opacityFactor, setOpacityFactor] = useState(1.0);

  const lastPageActiveRef = useRef(location.pathname);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [pressStartTime, setPressStartTime] = useState(0);
  const [isLongPress, setIsLongPress] = useState(false);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const fadeStartTimeRef = useRef(0);
  const pressDurationRef = useRef(0);

  // Add fade state tracking
  const [fadeOutProgress, setFadeOutProgress] = useState(0.0);
  const fadeAnimationRef = useRef<number | null>(null);

  // Add fade out animation function
  const animateFadeOut = () => {
    const currentTime = clockRef.current.getElapsedTime();
    const elapsed = currentTime - fadeStartTimeRef.current;
    const duration = Math.min(pressDurationRef.current, 6.0); // Cap at 6 seconds

    const progress = 1.0 - Math.min(1.0, elapsed / duration);

    if (progress > 0) {
      setFadeOutProgress(progress);
      fadeAnimationRef.current = requestAnimationFrame(animateFadeOut);
    } else {
      setFadeOutProgress(0);
    }
  };

  // Replace wheel handler with mouse handlers
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    const currentTime = clockRef.current.getElapsedTime();
    setPressStartTime(currentTime);
    isDraggingRef.current = true;
    hasRotatedRef.current = false;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    // Only set mouse pressed state for long press timer if we haven't rotated
    if (!hasRotatedRef.current) {
      longPressTimeoutRef.current = setTimeout(() => {
        setIsMousePressed(true);
        setIsLongPress(true);
      }, 500); // 0.5 second delay
    }
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    onMove(e);

    if (isDraggingRef.current) {
      const deltaX = e.clientX - lastMousePosRef.current.x;
      const deltaY = e.clientY - lastMousePosRef.current.y;

      // Calculate rotation based on mouse movement
      const rotationSpeed = 0.005;

      // Update target rotation based on mouse movement
      // Only rotate Y (left/right) based on horizontal mouse movement
      targetRotationRef.current.y += deltaX * rotationSpeed;
      // Only rotate X (up/down) based on vertical mouse movement
      targetRotationRef.current.x += deltaY * rotationSpeed;
      // Remove Z rotation to keep it straight
      targetRotationRef.current.z = 0;

      // Mark that we've rotated
      if (Math.abs(deltaX) > 0.1 || Math.abs(deltaY) > 0.1) {
        hasRotatedRef.current = true;
        // Cancel long press timer if we've rotated
        if (longPressTimeoutRef.current) {
          clearTimeout(longPressTimeoutRef.current);
          longPressTimeoutRef.current = null;
        }
      }

      // Update last mouse position
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    }

    // Update position tracking for trail effect
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    lastMoveTimeRef.current = Date.now();
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    isDraggingRef.current = false;
    const currentTime = clockRef.current.getElapsedTime();
    const pressDuration = currentTime - pressStartTime;

    // If we were rotating, start reset animation
    if (hasRotatedRef.current) {
      isResettingRef.current = true;
      // Store current rotation for spring animation
      rotationSpringRef.current = {
        x: rotationRef.current.x,
        y: rotationRef.current.y,
        z: rotationRef.current.z,
      };
    }

    // Only trigger effects if we haven't rotated
    if (!hasRotatedRef.current) {
      // For short presses (< 500ms), only trigger ripple
      if (pressDuration < 0.5) {
        handleClick(e);
      } else if (isMousePressed) {
        // Only handle fade out if we were in a long press state
        pressDurationRef.current = pressDuration;
        fadeStartTimeRef.current = currentTime;
        fadeAnimationRef.current = requestAnimationFrame(animateFadeOut);
      }
    }

    // Reset states
    setIsMousePressed(false);
    setIsLongPress(false);

    // Clear long press timer
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    const uv = e.uv || { x: 0.5, y: 0.5 };
    dotMaterial.uniforms.clickPosition.value = new THREE.Vector2(uv.x, uv.y);
    rippleTimeRef.current = clockRef.current.getElapsedTime();

    // Play sound on click if volume is enabled
    if (snap.volume > 0) {
      playPop();
    }

    animateRipple();
  };

  // Update springs to include morph factor
  const springs = useSpring({
    x: getSphereBehavior(location.pathname, screenSize).x,
    y: getSphereBehavior(location.pathname, screenSize).y,
    z: getSphereBehavior(location.pathname, screenSize).z,
    s: snap.isLoading
      ? viewport.width * 0.000001
      : viewport.width * getSphereBehavior(location.pathname, screenSize).scale,
    opacity: snap.isLoading
      ? 0
      : getSphereBehavior(location.pathname, screenSize).opacity,
    morph: location.pathname.replace(/^\/[a-z]{2}\//, '/').startsWith('/about')
      ? 1
      : 0,
    config: {
      ...getSphereBehavior(location.pathname, screenSize).springConfig,
      // Add specific config for morph transition
      morph: {
        mass: 1,
        tension: 80,
        friction: 20,
      },
    },
    immediate: snap.isLoading,
  });

  useEffect(() => {
    if (dotMaterial && dotMaterial.uniforms) {
      dotMaterial.uniforms.isPrivacyPage.value =
        location.pathname === '/privacy-policy' ? 1.0 : 0.0;
      dotMaterial.uniforms.opacityFactor.value = springs.opacity.get();
    }
  }, [location.pathname, dotMaterial, springs.opacity]);

  // Add hover handlers
  const handlePointerEnter = () => {
    isHoveringRef.current = true;
  };

  // Handle pointer leave with fade out
  const handlePointerLeave = () => {
    isHoveringRef.current = false;
    isDraggingRef.current = false;

    // If we were rotating, start reset animation
    if (hasRotatedRef.current) {
      isResettingRef.current = true;
      // Store current rotation for spring animation
      rotationSpringRef.current = {
        x: rotationRef.current.x,
        y: rotationRef.current.y,
        z: rotationRef.current.z,
      };
    }

    // Only handle fade out if we were pressing and haven't rotated
    if (isMousePressed && !hasRotatedRef.current) {
      const currentTime = clockRef.current.getElapsedTime();
      const pressDuration = currentTime - pressStartTime;

      // Store the press duration and start time for fade out
      pressDurationRef.current = pressDuration;
      fadeStartTimeRef.current = currentTime;

      // Start fade out animation
      fadeAnimationRef.current = requestAnimationFrame(animateFadeOut);
    }

    // Reset states
    setIsMousePressed(false);
    setIsLongPress(false);

    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  };

  // Clean up animations on unmount
  useEffect(() => {
    return () => {
      if (fadeAnimationRef.current) {
        cancelAnimationFrame(fadeAnimationRef.current);
      }
    };
  }, []);

  // Update frame animation to include fade progress and morph progress
  useFrame((state) => {
    dotMaterial.uniforms.time.value = state.clock.getElapsedTime();
    wireframeMaterial.uniforms.time.value = state.clock.getElapsedTime();
    lightRayMaterial.uniforms.time.value = state.clock.getElapsedTime();

    const morphValue = springs.morph.get();
    const isAboutPage = location.pathname === '/about';

    // Update morph factor in materials first
    if (dotMaterial.uniforms) {
      dotMaterial.uniforms.morphFactor.value = morphValue;
    }
    if (wireframeMaterial.uniforms) {
      wireframeMaterial.uniforms.morphFactor.value = morphValue;
    }

    // When morphing to plane or on about page, force rotation to default and disable floating
    if (morphValue > 0.1) {
      targetRotationRef.current = { x: 0, y: 0, z: 0 };
      rotationRef.current = { x: 0, y: 0, z: 0 };
      if (groupRef.current) {
        groupRef.current.rotation.set(0, 0, 0);
      }
      isResettingRef.current = false;
      hasRotatedRef.current = false;
      isDraggingRef.current = false;
      return;
    }

    // Handle rotation reset animation for sphere state
    if (isResettingRef.current) {
      const springFactor = 0.1;
      const threshold = 0.001;

      rotationSpringRef.current.x *= 1 - springFactor;
      rotationSpringRef.current.y *= 1 - springFactor;
      rotationSpringRef.current.z *= 1 - springFactor;

      if (
        Math.abs(rotationSpringRef.current.x) < threshold &&
        Math.abs(rotationSpringRef.current.y) < threshold &&
        Math.abs(rotationSpringRef.current.z) < threshold
      ) {
        isResettingRef.current = false;
        rotationSpringRef.current = { x: 0, y: 0, z: 0 };
      }

      targetRotationRef.current = rotationSpringRef.current;
    }

    // Apply smooth rotation only in sphere state
    if (groupRef.current && !isAboutPage && morphValue <= 0.1) {
      rotationRef.current.x +=
        (targetRotationRef.current.x - rotationRef.current.x) * 0.1;
      rotationRef.current.y +=
        (targetRotationRef.current.y - rotationRef.current.y) * 0.1;
      rotationRef.current.z +=
        (targetRotationRef.current.z - rotationRef.current.z) * 0.1;

      groupRef.current.rotation.set(
        rotationRef.current.x,
        rotationRef.current.y,
        rotationRef.current.z
      );
    }

    // Calculate wireframe opacity with smooth transition
    if (isMousePressed && isLongPress) {
      const currentDuration =
        state.clock.getElapsedTime() - pressStartTime - 0.5; // Subtract initial delay
      const progress = Math.max(0, Math.min(currentDuration / 6, 1)); // 6 seconds transition
      wireframeMaterial.uniforms.transitionProgress.value = progress;

      // Only set hasReachedMax to true if we complete the full 6 seconds
      const hasReachedMax = progress >= 1.0;
      wireframeMaterial.uniforms.hasReachedMax.value = hasReachedMax
        ? 1.0
        : 0.0;

      // Reset deactivation progress when pressing
      wireframeMaterial.uniforms.deactivationProgress.value = 1.0;

      // Update light only when fully transitioned
      if (lightRef.current) {
        if (hasReachedMax) {
          // Pulsing light intensity that follows the exponential curve
          const pulseIntensity =
            Math.sin(state.clock.getElapsedTime() * 3) * 0.5 + 1.5;
          lightRef.current.intensity = pulseIntensity;
          lightRef.current.distance = 15;
        } else {
          lightRef.current.intensity = 0;
        }
      }
    } else {
      // Handle deactivation transition when releasing after max
      if (wireframeMaterial.uniforms.hasReachedMax.value > 0.5) {
        if (deactivationStartTimeRef.current === 0) {
          deactivationStartTimeRef.current = state.clock.getElapsedTime();
        }

        const deactivationDuration = 1.0; // 1 second deactivation
        const elapsed =
          state.clock.getElapsedTime() - deactivationStartTimeRef.current;
        const progress = Math.max(0, 1 - elapsed / deactivationDuration);
        wireframeMaterial.uniforms.deactivationProgress.value = progress;

        // Deactivate ray lights during deactivation transition
        rayObjects.forEach((ray) => {
          if (ray.material.uniforms) {
            ray.startTime = 0;
            ray.material.uniforms.rayProgress.value = 0.0;
            ray.material.uniforms.isActive.value = 0.0;
          }
        });
      } else {
        // Reset max state and transition progress when not pressing or when rotated
        wireframeMaterial.uniforms.hasReachedMax.value = 0;
        wireframeMaterial.uniforms.transitionProgress.value = 0;
        wireframeMaterial.uniforms.deactivationProgress.value = 1.0;
        deactivationStartTimeRef.current = 0;

        if (lightRef.current) {
          lightRef.current.intensity = 0;
        }
        // Reset all ray materials
        rayObjects.forEach((ray) => {
          if (ray.material.uniforms) {
            ray.startTime = 0;
            ray.material.uniforms.rayProgress.value = 0.0;
            ray.material.uniforms.isActive.value = 0.0;
          }
        });
      }
    }

    // Update fade progress based on mouse press state
    if (isMousePressed) {
      const elapsed = state.clock.getElapsedTime() - pressStartTime;
      if (elapsed < 0.5) {
        // Initial visibility during the first 500ms
        wireframeMaterial.uniforms.fadeOutProgress.value = 0.1;
      } else {
        // After 500ms, increase visibility based on press duration
        const progress = Math.min(1.0, (elapsed - 0.5) / 6);
        wireframeMaterial.uniforms.fadeOutProgress.value = progress;
      }
    } else {
      // Use the fade out progress when not pressing
      wireframeMaterial.uniforms.fadeOutProgress.value = fadeOutProgress;
    }

    if (dotMaterial.uniforms) {
      dotMaterial.uniforms.opacityFactor.value = springs.opacity.get();
    }

    // Update morph factor in materials
    if (dotMaterial.uniforms) {
      dotMaterial.uniforms.morphFactor.value = springs.morph.get();
    }
    if (wireframeMaterial.uniforms) {
      wireframeMaterial.uniforms.morphFactor.value = springs.morph.get();
    }
  });

  useEffect(() => {
    const animateOpacityTransition = (targetOpacity: number) => {
      const animate = () => {
        setOpacityFactor((prev) => {
          const delta = (targetOpacity - prev) * 0.05;
          if (Math.abs(delta) < 0.001) return targetOpacity;
          return prev + delta;
        });

        if (Math.abs(opacityFactor - targetOpacity) > 0.001) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    };

    const targetOpacity = location.pathname === '/projects' ? 0.15 : 1.0;
    if (location.pathname === '/projects') {
      lastPageActiveRef.current = location.pathname;
      animateOpacityTransition(targetOpacity);
    } else {
      animateOpacityTransition(targetOpacity);
    }
  }, [location, opacityFactor]);

  const animateRipple = () => {
    const clock = clockRef.current;
    if (rippleTimeRef.current >= 0) {
      const elapsed = clock.getElapsedTime() - rippleTimeRef.current;
      dotMaterial.uniforms.rippleTime.value = elapsed;

      if (elapsed > 1.5) {
        rippleTimeRef.current = -1;
        dotMaterial.uniforms.rippleTime.value = -1;
      } else {
        requestAnimationFrame(animateRipple);
      }
    }
  };

  useEffect(() => {
    if (snap.theme === 'dark') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        const material = dotMaterial as CustomShaderMaterial;
        if (material && material.uniforms) {
          material.uniforms.bgColor.value = new THREE.Color(
            String(tailwindColors['bgDark'])
          );
          material.uniforms.dotColor.value = new THREE.Color(
            snap.selectedColor
          );
          material.uniforms.dotOpacity.value = 2.0;
          bgMaterial.uniforms.bgColor.value = new THREE.Color(
            String(tailwindColors['bgDark'])
          );
          wireframeMaterial.uniforms.wireColor.value = new THREE.Color(
            snap.selectedColor
          );
          lightRayMaterial.uniforms.dotColor.value = new THREE.Color(
            snap.selectedColor
          );
        }
      }, 300);
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      const material = dotMaterial as CustomShaderMaterial;
      if (material && material.uniforms) {
        material.uniforms.bgColor.value = new THREE.Color(
          String(tailwindColors['bgLight'])
        );
        material.uniforms.dotColor.value = new THREE.Color(snap.selectedColor);
        material.uniforms.dotOpacity.value = 1.0;
        bgMaterial.uniforms.bgColor.value = new THREE.Color(
          String(tailwindColors['bgLight'])
        );
        wireframeMaterial.uniforms.wireColor.value = new THREE.Color(
          snap.selectedColor
        );
        lightRayMaterial.uniforms.dotColor.value = new THREE.Color(
          snap.selectedColor
        );
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [
    snap.theme,
    snap.selectedColor,
    dotMaterial,
    bgMaterial,
    wireframeMaterial,
    lightRayMaterial,
  ]);

  // Add state for active dots
  const [activeDots, setActiveDots] = useState(new Float32Array(64 * 32));
  const lastUpdateRef = useRef(0);
  const hasReachedMaxRef = useRef(false);

  // Update ray colors when selected color changes
  useEffect(() => {
    rayObjects.forEach((ray) => {
      if (ray.material.uniforms) {
        ray.material.uniforms.rayColor.value = new THREE.Color(
          snap.selectedColor
        );
      }
    });
  }, [snap.selectedColor, rayObjects]);

  // Update active dots periodically
  useFrame((state) => {
    const currentTime = state.clock.getElapsedTime();

    // Check if we've reached max wireframe effect
    const hasReachedMax = wireframeMaterial.uniforms.hasReachedMax.value > 0.5;
    hasReachedMaxRef.current = hasReachedMax;

    // Update ray materials
    rayObjects.forEach((ray) => {
      if (ray.material.uniforms) {
        ray.material.uniforms.time.value = currentTime;

        // Only animate rays if we've reached max wireframe effect
        if (hasReachedMax && activeDots[ray.dotIndex] > 0.5) {
          // If this is the first frame of activation, set start time
          if (ray.startTime === 0) {
            ray.startTime = currentTime;
          }

          // Calculate progress (0 to 1) over 4 seconds (slower animation)
          const progress = Math.min(1.0, (currentTime - ray.startTime) / 4.0);
          ray.material.uniforms.rayProgress.value = progress;

          // Reset after animation completes
          if (progress >= 1.0) {
            ray.startTime = 0;
            ray.material.uniforms.isActive.value = 0.0;
          } else {
            ray.material.uniforms.isActive.value = 1.0;
          }
        } else {
          ray.startTime = 0;
          ray.material.uniforms.rayProgress.value = 0.0;
          ray.material.uniforms.isActive.value = 0.0;
        }
      }
    });

    // Only update active dots when we've reached max wireframe effect
    if (hasReachedMax && currentTime - lastUpdateRef.current > 3.0) {
      const newActiveDots = new Float32Array(32 * 16); // Match new grid size
      // Activate more dots at once
      for (let i = 0; i < 32 * 16; i++) {
        if (Math.random() < 0.12) {
          // 12% chance (more rays at once)
          newActiveDots[i] = 1.0;
        }
      }
      setActiveDots(newActiveDots);
      lastUpdateRef.current = currentTime;
    }
  });

  const sphereRef = useRef<THREE.Mesh>(null);

  // Update useEffect for route changes
  useEffect(() => {
    // Normalize the path by removing language prefix
    const normalizedPath = location.pathname.replace(/^\/[a-z]{2}\//, '/');

    // When leaving the about page, reset all rotation states
    if (!normalizedPath.startsWith('/about')) {
      setTimeout(() => {
        isResettingRef.current = false;
        hasRotatedRef.current = false;
        isDraggingRef.current = false;
        targetRotationRef.current = { x: 0, y: 0, z: 0 };
        rotationRef.current = { x: 0, y: 0, z: 0 };
        rotationSpringRef.current = { x: 0, y: 0, z: 0 };
        if (groupRef.current) {
          groupRef.current.rotation.set(0, 0, 0);
        }
      }, 100); // Small delay to ensure morph animation has started
    }
  }, [location.pathname]);

  return (
    <>
      {/* Sphere */}
      {/* <Float
        speed={floatEnabled ? (snap.isLoading ? 0 : 1) : 0}
        rotationIntensity={floatEnabled ? (snap.isLoading ? 0 : 0.5) : 0}
        floatIntensity={floatEnabled ? (snap.isLoading ? 0 : 0.5) : 0}
        floatingRange={[-0.3, 0.3]}
      > */}
      <animated.group
        ref={groupRef}
        position-x={springs.x}
        position-y={springs.y}
        position-z={springs.z}
        scale-x={springs.s}
        scale-y={springs.s}
        scale-z={springs.s}
      >
        {/* Mouse trail and interaction capture layer */}
        <mesh
          ref={sphereRef}
          renderOrder={0}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          <sphereGeometry args={[1.002, 64, 32]} />
          <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} />
        </mesh>

        {/* Landmarks - only show when activeScene is set */}
        <group position-y={0.15}>
          <group visible={snap.activeScene === 'berlin'}>
            <BerlinScene visible={snap.activeScene === 'berlin'} />
          </group>
          <group visible={snap.activeScene === 'naples'}>
            <NaplesScene visible={snap.activeScene === 'naples'} />
          </group>
        </group>

        {/* Visual layers group */}
        <group>
          {/* Point light that activates at full opacity */}
          <pointLight
            ref={lightRef}
            position={[0, 0, 0]}
            intensity={0}
            distance={15}
            decay={1.5}
            color={store.selectedColor}
          />

          {/* 3D Light rays */}
          {rayObjects.map((ray, index) => (
            <lineSegments
              key={index}
              geometry={ray.geometry}
              material={ray.material}
              renderOrder={1}
            />
          ))}

          {/* Wireframe sphere */}
          <mesh renderOrder={2}>
            <sphereGeometry args={[1.001, 32, 32]} />
            <primitive
              object={wireframeMaterial}
              wireframe={true}
              transparent={true}
              depthTest={false}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              mouseTrail={trail}
            />
          </mesh>

          {/* Dot sphere */}
          <mesh renderOrder={3}>
            <sphereGeometry args={[1, 64, 32]} />
            <primitive
              object={dotMaterial}
              resolution={[
                size.width * viewport.dpr,
                size.height * viewport.dpr,
              ]}
              mouseTrail={trail}
              opacityFactor={opacityFactor}
              isMousePressed={isMousePressed ? 1.0 : 0.0}
              transparent={true}
              depthTest={false}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      </animated.group>
      {/* </Float> */}
    </>
  );
}

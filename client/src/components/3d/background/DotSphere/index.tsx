import { useMemo, useRef, useEffect, useState, Suspense, lazy } from 'react';
import { ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { useTrailTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useSnapshot } from 'valtio';
import { useLocation } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/three';
import store from '../../../../appStore';
import tailwindColors from '../../../../tailwindColors';
import useSound from 'use-sound';
import sphereDotfx from '/sounds/glitch.mp3';
import { useScreenSize } from '../../../../hooks/useScreenSize';
import {
  DotMaterial,
  BackgroundMaterial,
  WireframeMaterial,
  LightRayMaterial,
} from './materials';
import { getSphereBehavior } from './behaviors';
import { RayObject } from './types';

// Lazy load scenes
const WhoScene = lazy(() => import('../../scenes/WhoScene'));
const BerlinScene = lazy(() => import('../../scenes/BerlinScene'));
const NaplesScene = lazy(() => import('../../scenes/NaplesScene'));
const WhatScene = lazy(() => import('../../scenes/WhatScene'));
const HobbiesScene = lazy(() => import('../../scenes/HobbiesScene'));

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

  // Reduce the number of rays and optimize their creation
  const rayObjects = useMemo(() => {
    const objects: RayObject[] = [];
    const dotsX = 24; // Reduced from 32
    const dotsY = 12; // Reduced from 16
    const rayLength = 3.0; // Reduced from 4.0
    const segments = 3; // Reduced from 4

    // Create a more evenly distributed grid using spherical coordinates
    for (let y = 0; y < dotsY; y++) {
      for (let x = 0; x < dotsX; x++) {
        // Calculate spherical coordinates
        const phi = (x / dotsX) * Math.PI * 2;
        const theta = (y / dotsY) * Math.PI;

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

        // Create ray geometry with shared buffer attributes
        const rayGeometry = new THREE.BufferGeometry();
        const vertices = new Float32Array((segments + 1) * 3);
        const indices = new Uint32Array(segments * 2);

        // Set initial position at dot
        vertices[0] = dotPos.x;
        vertices[1] = dotPos.y;
        vertices[2] = dotPos.z;

        // Create segments with exponential scaling
        for (let i = 0; i < segments; i++) {
          const t = (i + 1) / segments;
          const scale = 1 + rayLength * Math.pow(t, 1.5);
          const pos = dotPos.clone().multiplyScalar(scale);
          vertices[(i + 1) * 3] = pos.x;
          vertices[(i + 1) * 3 + 1] = pos.y;
          vertices[(i + 1) * 3 + 2] = pos.z;

          indices[i * 2] = i;
          indices[i * 2 + 1] = i + 1;
        }

        rayGeometry.setAttribute(
          'position',
          new THREE.BufferAttribute(vertices, 3)
        );
        rayGeometry.setIndex(new THREE.BufferAttribute(indices, 1));

        // Create ray material with optimized shader
        const rayMaterial = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            dotColor: { value: new THREE.Color() },
            rayColor: { value: new THREE.Color(snap.selectedColor) },
            rayIntensity: { value: 2.0 },
            raySpeed: { value: 0.01 },
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
              float progressMask = step(vSegment, rayProgress);
              float fade = 1.0 - smoothstep(0.0, 4.0, vDistance);
              fade = pow(fade, 1.5);
              float rayEffect = isActive * progressMask * fade;
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
        uniforms: {
          time: { value: 0 },
          dotColor: { value: new THREE.Color() },
          rayColor: { value: new THREE.Color('#ffffff') },
          rayIntensity: { value: 3.0 },
          raySpeed: { value: 0.3 },
          activeDots: { value: new Float32Array(64 * 32) },
        },
      }),
    []
  );

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

  // Optimize frame updates
  useFrame((state) => {
    const currentTime = state.clock.getElapsedTime();
    const morphValue = springs.morph.get();
    const isAboutPage = location.pathname === '/about';

    // Update material uniforms only when needed
    if (dotMaterial.uniforms) {
      dotMaterial.uniforms.time.value = currentTime;
      dotMaterial.uniforms.morphFactor.value = morphValue;
      dotMaterial.uniforms.opacityFactor.value = springs.opacity.get();
    }

    if (wireframeMaterial.uniforms) {
      wireframeMaterial.uniforms.time.value = currentTime;
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

    // Optimize wireframe and light effects
    const hasReachedMax = wireframeMaterial.uniforms.hasReachedMax.value > 0.5;
    if (isMousePressed && isLongPress) {
      const currentDuration = currentTime - pressStartTime - 0.5;
      const progress = Math.max(0, Math.min(currentDuration / 6, 1));
      wireframeMaterial.uniforms.transitionProgress.value = progress;
      wireframeMaterial.uniforms.hasReachedMax.value =
        progress >= 1.0 ? 1.0 : 0.0;
      wireframeMaterial.uniforms.deactivationProgress.value = 1.0;

      if (lightRef.current) {
        if (progress >= 1.0) {
          const pulseIntensity = Math.sin(currentTime * 3) * 0.5 + 1.5;
          lightRef.current.intensity = pulseIntensity;
          lightRef.current.distance = 15;
        } else {
          lightRef.current.intensity = 0;
        }
      }
    } else {
      if (hasReachedMax) {
        if (deactivationStartTimeRef.current === 0) {
          deactivationStartTimeRef.current = currentTime;
        }

        const deactivationDuration = 1.0;
        const elapsed = currentTime - deactivationStartTimeRef.current;
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
      const elapsed = currentTime - pressStartTime;
      if (elapsed < 0.5) {
        wireframeMaterial.uniforms.fadeOutProgress.value = 0.1;
      } else {
        const progress = Math.min(1.0, (elapsed - 0.5) / 6);
        wireframeMaterial.uniforms.fadeOutProgress.value = progress;
      }
    } else {
      wireframeMaterial.uniforms.fadeOutProgress.value = fadeOutProgress;
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
        if (dotMaterial && dotMaterial.uniforms) {
          dotMaterial.uniforms.bgColor.value = new THREE.Color(
            String(tailwindColors['bgDark'])
          );
          dotMaterial.uniforms.dotColor.value = new THREE.Color(
            snap.selectedColor
          );
          dotMaterial.uniforms.dotOpacity.value = 2.0;
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
      if (dotMaterial && dotMaterial.uniforms) {
        dotMaterial.uniforms.bgColor.value = new THREE.Color(
          String(tailwindColors['bgLight'])
        );
        dotMaterial.uniforms.dotColor.value = new THREE.Color(
          snap.selectedColor
        );
        dotMaterial.uniforms.dotOpacity.value = 1.0;
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

  // Update the active dots state to match new grid size
  const [activeDots, setActiveDots] = useState(new Float32Array(24 * 12)); // Match new grid size
  const lastUpdateRef = useRef(0);
  const hasReachedMaxRef = useRef(false);

  // Optimize the frame update for rays
  useFrame((state) => {
    const currentTime = state.clock.getElapsedTime();
    const hasReachedMax = wireframeMaterial.uniforms.hasReachedMax.value > 0.5;
    hasReachedMaxRef.current = hasReachedMax;

    // Only update rays if we've reached max wireframe effect
    if (hasReachedMax) {
      rayObjects.forEach((ray) => {
        if (ray.material.uniforms) {
          ray.material.uniforms.time.value = currentTime;

          if (activeDots[ray.dotIndex] > 0.5) {
            if (ray.startTime === 0) {
              ray.startTime = currentTime;
            }

            const progress = Math.min(1.0, (currentTime - ray.startTime) / 4.0);
            ray.material.uniforms.rayProgress.value = progress;

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

      // Update active dots less frequently
      if (currentTime - lastUpdateRef.current > 3.0) {
        const newActiveDots = new Float32Array(24 * 12);
        for (let i = 0; i < 24 * 12; i++) {
          if (Math.random() < 0.12) {
            newActiveDots[i] = 1.0;
          }
        }
        setActiveDots(newActiveDots);
        lastUpdateRef.current = currentTime;
      }
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

  // Add these memoized geometries at the top of the component
  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(1, 48, 24), []); // Reduced segments
  const highResSphereGeometry = useMemo(
    () => new THREE.SphereGeometry(1, 64, 32),
    []
  ); // Keep high res for main sphere
  const wireframeSphereGeometry = useMemo(
    () => new THREE.SphereGeometry(1.001, 32, 16),
    []
  ); // Reduced for wireframe

  return (
    <>
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
          <primitive object={sphereGeometry} />
          <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} />
        </mesh>

        {/* Landmarks - only show when activeScene is set */}
        <group position-y={0.15}>
          <Suspense fallback={null}>
            <group visible={snap.activeScene === 'who'}>
              <WhoScene visible={snap.activeScene === 'who'} />
            </group>
          </Suspense>
          <Suspense fallback={null}>
            <group visible={snap.activeScene === 'berlin'}>
              <BerlinScene visible={snap.activeScene === 'berlin'} />
            </group>
          </Suspense>
          <Suspense fallback={null}>
            <group visible={snap.activeScene === 'naples'}>
              <NaplesScene visible={snap.activeScene === 'naples'} />
            </group>
          </Suspense>
          <Suspense fallback={null}>
            <group visible={snap.activeScene === 'what'}>
              <WhatScene visible={snap.activeScene === 'what'} />
            </group>
          </Suspense>
          <Suspense fallback={null}>
            <group visible={snap.activeScene === 'hobbies'}>
              <HobbiesScene visible={snap.activeScene === 'hobbies'} />
            </group>
          </Suspense>
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
            <primitive object={wireframeSphereGeometry} />
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
            <primitive object={highResSphereGeometry} />
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
    </>
  );
}

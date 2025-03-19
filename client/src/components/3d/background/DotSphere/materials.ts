import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import tailwindColors from '../../../../tailwindColors';
import store from '../../../../appStore';

export const DotMaterial = shaderMaterial(
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
      
      // Optimize position calculation
      vec3 pos = position;
      float angle = -1.5708; // -PI/2
      vec3 rotated = vec3(
        pos.x,
        pos.y * cos(angle) - pos.z * sin(angle),
        pos.y * sin(angle) + pos.z * cos(angle)
      );
      
      vec3 planePos = vec3(rotated.x * 8.0, -0.5, rotated.z * 8.0);
      vec3 morphedPos = mix(pos, planePos, morphFactor);
      
      vNormal = normalize(normalMatrix * mix(normalize(pos), vec3(0.0, 1.0, 0.0), morphFactor));
      vPosition = morphedPos;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(morphedPos, 1.0);
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

    // Optimize random function
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    // Optimize noise function
    float smoothNoise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(random(i), random(i + vec2(1.0, 0.0)), u.x),
        mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x),
        u.y
      );
    }

    float getDot(vec2 uv, float scale, float aspectRatio) {
      vec2 center = vec2(0.5);
      vec2 adjustedUV = vec2((uv.x - center.x) * aspectRatio + center.x, uv.y);
      float dist = length(adjustedUV - center);
      return smoothstep(0.2 * scale, 0.15 * scale, dist);
    }

    float getGrid(vec2 uv) {
      vec2 grid = abs(fract(uv - 0.5) - 0.5) / fwidth(uv);
      return 1.0 - smoothstep(0.0, 1.5, min(grid.x, grid.y));
    }

    vec2 getGridUV() {
      vec3 pos = normalize(vPosition);
      float phi = atan(pos.z, pos.x);
      float theta = acos(pos.y);
      vec2 sphereUV = vec2(
        fract(phi * 10.1859), // 64.0 / (2.0 * PI)
        fract(theta * 10.1859) // 32.0 / PI
      );
      
      vec2 planeUV = vec2(
        fract(vPosition.x * 4.0 + 0.5),
        fract(vPosition.z * 4.0 + 0.5)
      );
      
      return mix(sphereUV, planeUV, morphFactor);
    }

    vec2 getGlobalUV() {
      vec3 pos = normalize(vPosition);
      float phi = atan(pos.z, pos.x);
      float theta = acos(pos.y);
      vec2 sphereUV = vec2(
        phi * 10.1859,
        theta * 10.1859
      );
      
      vec2 planeUV = vPosition.xy * 16.0 + 0.5;
      return mix(sphereUV, planeUV, morphFactor);
    }

    void main() {
      vec2 gridUv = getGridUV();
      vec2 globalUv = getGlobalUV();

      // Optimize wave calculation
      float wave = sin(atan(vPosition.z, vPosition.x) * 8.0 + time * 2.0) * 0.5 + 0.5;
      float opening = smoothstep(0.0, 1.0, wave + acos(vPosition.y) * 0.8);
      opening = mix(1.0, opening, isPrivacyPage);
      
      // Optimize random opacity calculation
      vec2 randomSeed = vec2(floor(globalUv.x), floor(globalUv.y));
      float randomOpacity = mix(0.3, 0.9, smoothNoise(randomSeed + time * 0.05));
      
      float trailInfluence = texture2D(mouseTrail, vUv).r;
      float dotScale = mix(1.0, 3.0, trailInfluence);
      
      // Optimize pole compensation
      float poleCompensation = mix(1.0, sin(acos(vPosition.y)), 1.0 - morphFactor);
      dotScale *= poleCompensation;
      
      float dot = getDot(gridUv, dotScale, 1.0);
      float grid = getGrid(globalUv) * 0.15;

      // Optimize ripple effect
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

export const BackgroundMaterial = shaderMaterial(
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

export const WireframeMaterial = shaderMaterial(
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

export const LightRayMaterial = shaderMaterial(
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

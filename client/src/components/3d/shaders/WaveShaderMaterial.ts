import * as THREE from 'three';
import { extend } from '@react-three/fiber';
import { Object3DNode } from '@react-three/fiber';

// Create the custom shader material
export class WaveShaderMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('white') },
        uExplosionProgress: { value: 0.0 },
        uNoiseFreq: { value: 3.0 },
        uNoiseAmplitude: { value: 1.0 },
        uAnimationDuration: { value: 1.0 }, // Duration of explosion animation in seconds
        uStartTime: { value: -1 }, // Start time of the animation (-1 means not started)
        uHovered: { value: false },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uExplosionProgress;
        uniform float uNoiseFreq;
        uniform float uNoiseAmplitude;
        uniform float uAnimationDuration;
        uniform float uStartTime;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        //	Simplex 3D Noise 
        //	by Ian McEwan, Ashima Arts
        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
        
        float snoise(vec3 v){ 
          const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
          const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
        
          // First corner
          vec3 i  = floor(v + dot(v, C.yyy) );
          vec3 x0 =   v - i + dot(i, C.xxx) ;
        
          // Other corners
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min( g.xyz, l.zxy );
          vec3 i2 = max( g.xyz, l.zxy );
        
          vec3 x1 = x0 - i1 + 1.0 * C.xxx;
          vec3 x2 = x0 - i2 + 2.0 * C.xxx;
          vec3 x3 = x0 - 1. + 3.0 * C.xxx;
        
          // Permutations
          i = mod(i, 289.0 ); 
          vec4 p = permute( permute( permute( 
                     i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                   + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                   + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
        
          // Gradients
          float n_ = 1.0/7.0; // N=7
          vec3  ns = n_ * D.wyz - D.xzx;
        
          vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)
        
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
        
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
        
          vec4 b0 = vec4( x.xy, y.xy );
          vec4 b1 = vec4( x.zw, y.zw );
        
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
        
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
        
          vec3 p0 = vec3(a0.xy,h.x);
          vec3 p1 = vec3(a0.zw,h.y);
          vec3 p2 = vec3(a1.xy,h.z);
          vec3 p3 = vec3(a1.zw,h.w);
        
          //Normalise gradients
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
        
          // Mix final noise value
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                    dot(p2,x2), dot(p3,x3) ) );
        }
        
        void main() {
          vUv = uv;
          vNormal = normal;
          vPosition = position;
          
          // Calculate animation progress
          float progress = uExplosionProgress;
          if (uStartTime >= 0.0) {
            float timeSinceStart = uTime - uStartTime;
            progress = 1.0 - clamp(timeSinceStart / uAnimationDuration, 0.0, 1.0);
          }
          
          // Calculate noise based on position and time
          float noise = snoise(vec3(position.xyz * uNoiseFreq + uTime * 0.5)) * uNoiseAmplitude;
          
          // Calculate explosion direction (outward from center)
          vec3 explosionDir = normalize(position);
          
          // Mix original position with exploded position based on explosion progress
          vec3 finalPosition = mix(
            position,
            position + explosionDir * (noise + 1.0) * 2.0,
            progress
          );
          
          // Add subtle continuous animation
          finalPosition += sin(position.y * 10.0 + uTime * 2.0) * 0.01 * explosionDir;
          
          vec4 modelPosition = modelMatrix * vec4(finalPosition, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          
          gl_Position = projectedPosition;
          
          // Dynamic point size based on distance and progress
          float size = mix(2.0, 4.0, progress);
          gl_PointSize = size * (1.0 / -viewPosition.z);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uExplosionProgress;
        uniform float uTime;
        uniform float uStartTime;
        uniform float uAnimationDuration;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          // Calculate animation progress
          float progress = uExplosionProgress;
          if (uStartTime >= 0.0) {
            float timeSinceStart = uTime - uStartTime;
            progress = 1.0 - clamp(timeSinceStart / uAnimationDuration, 0.0, 1.0);
          }
          
          gl_FragColor = vec4(uColor, 1.0);
        }
      `,
      transparent: false,
      depthWrite: true,
      blending: THREE.NoBlending,
      vertexColors: true,
    });
  }

  set time(value: number) {
    this.uniforms.uTime.value = value;
  }

  set color(value: THREE.Color) {
    this.uniforms.uColor.value = value;
  }

  set explosionProgress(value: number) {
    this.uniforms.uExplosionProgress.value = value;
  }

  set hovered(value: boolean) {
    this.uniforms.uHovered.value = value;
  }

  startAnimation(duration: number = 1.0) {
    this.uniforms.uStartTime.value = this.uniforms.uTime.value;
    this.uniforms.uAnimationDuration.value = duration;
  }

  resetAnimation() {
    this.uniforms.uStartTime.value = -1;
    this.uniforms.uExplosionProgress.value = 0;
  }
}

// Extend for use in JSX
extend({ WaveShaderMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    waveShaderMaterial: Object3DNode<
      WaveShaderMaterial,
      typeof WaveShaderMaterial
    >;
  }
}

declare module 'three' {
  interface WaveShaderMaterial extends THREE.ShaderMaterial {
    time: number;
    color: THREE.Color;
    explosionProgress: number;
    hovered: boolean;
    startAnimation: (duration?: number) => void;
    resetAnimation: () => void;
  }
}

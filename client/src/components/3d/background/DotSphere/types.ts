import * as THREE from 'three';

export interface SphereBehavior {
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

export interface LightRayMaterialParameters
  extends THREE.ShaderMaterialParameters {
  time?: number;
  dotColor?: THREE.Color;
  rayColor?: THREE.Color;
  rayIntensity?: number;
  raySpeed?: number;
  activeDots?: Float32Array;
}

export interface CustomShaderMaterial extends THREE.ShaderMaterial {
  uniforms: {
    bgColor: { value: THREE.Color };
    dotColor: { value: THREE.Color };
    dotOpacity: { value: number };
    wireColor?: { value: THREE.Color };
    mouseTrail?: { value: THREE.Texture | null };
    baseOpacity?: { value: number };
  };
}

export interface RayObject {
  geometry: THREE.BufferGeometry;
  material: THREE.ShaderMaterial;
  dotIndex: number;
  startTime: number;
}

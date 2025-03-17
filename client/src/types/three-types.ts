import { MaterialNode } from '@react-three/fiber';
import * as THREE from 'three';
import { WaveShaderMaterial } from '../components/3d/shaders/WaveShaderMaterial';
import { ShaderMaterial, IUniform } from 'three';

interface WaveShaderMaterialUniforms {
  [key: string]: IUniform<number | THREE.Color>;
  uTime: IUniform<number>;
  uColor: IUniform<THREE.Color>;
  uExplosionProgress: IUniform<number>;
  uNoiseFreq: IUniform<number>;
  uNoiseAmplitude: IUniform<number>;
  uParticleSize: IUniform<number>;
}

export interface WaveShaderMaterialType extends ShaderMaterial {
  uniforms: WaveShaderMaterialUniforms;
  time: number;
  explosionProgress: number;
  severity: number;
}

declare module 'three' {
  export class WaveShaderMaterial extends ShaderMaterial {
    uniforms: WaveShaderMaterialUniforms;
    time: number;
    explosionProgress: number;
    severity: number;
    constructor();
  }
}

export interface WaveShaderMaterialImpl extends ShaderMaterial {
  time: number;
  explosionProgress: number;
}

export interface WaveShaderMaterialProps
  extends MaterialNode<WaveShaderMaterialImpl, typeof WaveShaderMaterial> {
  ref?: React.RefObject<WaveShaderMaterialImpl>;
}

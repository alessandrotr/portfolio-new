import { WaveShaderMaterialProps } from './three-types';

declare module '@react-three/fiber' {
  interface ThreeElements {
    waveShaderMaterial: WaveShaderMaterialProps;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      waveShaderMaterial: WaveShaderMaterialProps;
    }
  }
}

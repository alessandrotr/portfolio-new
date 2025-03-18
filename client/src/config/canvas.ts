import * as THREE from 'three';

export const CANVAS_CONFIG = {
  style: {
    height: 'calc(var(--vh, 1vh) * 100)',
    width: '100vw',
  },
  className: 'bg-bgLight dark:bg-bgDark',
  camera: {
    position: [0, 0, 15] as [number, number, number],
  },
  gl: {
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
    outputColorSpace: THREE.SRGBColorSpace,
    toneMapping: THREE.NoToneMapping,
  },
  id: 'canvas',
  flat: true,
} as const;

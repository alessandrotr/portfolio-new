import React, { useMemo, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

const Skybox = () => {
  const skyboxTexture = useLoader(
    THREE.TextureLoader,
    "./textures/green_metal_rust_disp_4k.jpg"
  );

  const [topColor, setTopColor] = useState(new THREE.Color(0x444444));
  const [bottomColor, setBottomColor] = useState(new THREE.Color(0x444444));

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: topColor },
        bottomColor: { value: bottomColor },
        skyboxTexture: { value: skyboxTexture },
      },
      vertexShader: `varying vec3 vWorldPosition;
                     void main() {
                       vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                       vWorldPosition = worldPosition.xyz;
                       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                     }`,
      fragmentShader: `
      precision mediump float;

uniform vec3 topColor;
uniform vec3 bottomColor;
uniform sampler2D skyboxTexture; // Add the uniform for the skybox texture
varying vec3 vWorldPosition;

void main() {
  vec3 direction = normalize(vWorldPosition);
  float theta = acos(direction.y) / 3.141592653589793;
  float phi = atan(direction.z, direction.x) / (2.0 * 3.141592653589793);
  vec2 uv = vec2(1.0 - (phi + 3.141592653589793) / (2.0 * 3.141592653589793), theta);
  vec3 skyColor = texture2D(skyboxTexture, uv).rgb;
  gl_FragColor = vec4(mix(bottomColor, topColor, max(0.0, min(1.0, direction.y))), 1.0) * vec4(skyColor, 1.0);
}
      `,
      side: THREE.BackSide, // Render the skybox on the inside of the cube
    });
  }, [topColor, bottomColor, skyboxTexture]);

  useFrame(() => {
    const time = Date.now() * 0.001; // Convert milliseconds to seconds for smooth animation
    const colorIntensity = Math.sin(time) * 0.5 + 0.5; // Map sine wave (-1 to 1) to (0 to 1)

    setTopColor(
      new THREE.Color(0x999999).lerp(new THREE.Color(0x777777), colorIntensity)
    );
    setBottomColor(
      new THREE.Color(0x555555).lerp(new THREE.Color(0x666666), colorIntensity)
    );
  });

  return (
    <>
      <mesh scale={[25, 25, 25]} material={material} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 64, 64]} />
      </mesh>
    </>
  );
};

export default Skybox;

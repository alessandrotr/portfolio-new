import * as THREE from "three";
import CameraControls from "camera-controls";
import { useThree, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useEffect } from "react";

CameraControls.install({ THREE: THREE });

const OrbitCameraControls = () => {
  const { camera } = useThree();
  const currentCoords = useRef([0, 0]);

  const [cameraControls, clock] = useMemo(() => {
    const ctrls = new CameraControls(
      camera,
      document.getElementById("canvas")!
    );

    ctrls.mouseButtons.left = CameraControls.ACTION.NONE;
    ctrls.mouseButtons.right = CameraControls.ACTION.NONE;
    ctrls.mouseButtons.wheel = CameraControls.ACTION.NONE;
    ctrls.mouseButtons.middle = CameraControls.ACTION.NONE;

    ctrls.touches.one = CameraControls.ACTION.NONE;
    ctrls.touches.two = CameraControls.ACTION.NONE;
    ctrls.touches.three = CameraControls.ACTION.NONE;

    const startAzimus = ctrls.azimuthAngle;
    const startPolar = ctrls.polarAngle;

    currentCoords.current = [startAzimus, startPolar];

    const clock = new THREE.Clock();

    return [ctrls, clock];
  }, [camera]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const xOffset = (e.clientX - window.innerWidth / 2) / window.innerWidth;
      const yOffset = (e.clientY - window.innerHeight / 2) / window.innerHeight;

      cameraControls.rotateTo(
        currentCoords.current[0] - xOffset * 0.05,
        currentCoords.current[1] - yOffset * 0.05,
        true
      );
    };
    document.addEventListener("mousemove", onMouseMove, true);
    return () => document.removeEventListener("mousemove", onMouseMove, true);
  }, [cameraControls]);

  useFrame(() => {
    const delta = clock.getDelta();
    cameraControls.update(delta);
  });

  return null;
};

export default OrbitCameraControls;

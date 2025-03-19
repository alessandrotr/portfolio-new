import * as THREE from 'three';
import CameraControls from 'camera-controls';
import { useThree, useFrame } from '@react-three/fiber';
import { useMemo, useRef, useEffect } from 'react';

// iOS-specific type for DeviceOrientationEvent
interface iOSDeviceOrientationEvent extends DeviceOrientationEvent {
  requestPermission(): Promise<'granted' | 'denied'>;
}

CameraControls.install({ THREE: THREE });

const OrbitCameraControls = () => {
  const { camera } = useThree();
  const currentCoords = useRef([0, 0]);
  const isMobile = useRef(false);

  const [cameraControls, clock] = useMemo(() => {
    const ctrls = new CameraControls(
      camera,
      document.getElementById('canvas')!
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
    // Check if device is mobile using user agent and touch support
    isMobile.current =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || 'ontouchstart' in window;

    const onMouseMove = (e: MouseEvent) => {
      if (isMobile.current) return; // Skip mouse movement on mobile devices

      const xOffset = (e.clientX - window.innerWidth / 2) / window.innerWidth;
      const yOffset = (e.clientY - window.innerHeight / 2) / window.innerHeight;

      cameraControls.rotateTo(
        currentCoords.current[0] - xOffset * 0.1,
        currentCoords.current[1] - yOffset * 0.1,
        true
      );
    };

    const onDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (!isMobile.current) return; // Skip gyroscope on desktop devices

      try {
        // Beta represents front-to-back tilt in degrees, with range [-180,180]
        // Gamma represents left-to-right tilt in degrees, with range [-90,90]
        const beta = event.beta || 0;
        const gamma = event.gamma || 0;

        // Convert device orientation to camera rotation
        // Adjust these multipliers to control sensitivity
        const xOffset = (gamma / 90) * 1.0;
        const yOffset = (beta / 180) * 1.0;

        cameraControls.rotateTo(
          currentCoords.current[0] - xOffset,
          currentCoords.current[1] - yOffset,
          true
        );
      } catch (error) {
        console.error('Error handling device orientation:', error);
      }
    };

    // Handle both iOS and Android devices
    if (isMobile.current) {
      try {
        // Check if it's iOS (which requires permission)
        if (
          typeof (
            DeviceOrientationEvent as unknown as iOSDeviceOrientationEvent
          ).requestPermission === 'function'
        ) {
          (DeviceOrientationEvent as unknown as iOSDeviceOrientationEvent)
            .requestPermission()
            .then((permissionState: 'granted' | 'denied') => {
              if (permissionState === 'granted') {
                window.addEventListener(
                  'deviceorientation',
                  onDeviceOrientation
                );
              }
            })
            .catch((error: Error) => {
              console.error(
                'Error requesting device orientation permission:',
                error
              );
            });
        } else {
          // For Android and other devices, directly add the event listener
          window.addEventListener('deviceorientation', onDeviceOrientation);
        }
      } catch (error) {
        console.error('Error setting up device orientation:', error);
      }
    } else {
      document.addEventListener('mousemove', onMouseMove);
    }

    return () => {
      if (isMobile.current) {
        try {
          window.removeEventListener('deviceorientation', onDeviceOrientation);
        } catch (error) {
          console.error('Error removing device orientation listener:', error);
        }
      } else {
        document.removeEventListener('mousemove', onMouseMove);
      }
    };
  }, [cameraControls]);

  useFrame(() => {
    const delta = clock.getDelta();
    cameraControls.update(delta);
  });

  return null;
};

export default OrbitCameraControls;

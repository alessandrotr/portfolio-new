import { Html } from '@react-three/drei';

interface MonumentPopupProps {
  position: [number, number, number];
  title: string;
  description: string;
  showPopup: boolean;
  visible: boolean;
}

export default function MonumentPopup({
  position,
  title,
  description,
  showPopup,
  visible,
}: MonumentPopupProps) {
  return (
    <Html
      position={position}
      center
      style={{
        pointerEvents: 'none',
        transition: 'all 0.3s',
        opacity: visible && showPopup ? 1 : 0,
      }}
    >
      <div
        className="w-fit whitespace-nowrap text-center p-[1.25vw] rounded-3xl bg-borderLightTransparent dark:bg-borderDarkTransparent dark:shadow-3xl"
        style={{
          transform: 'scale(0.5)',
        }}
      >
        <h3 className="text-[2.5vw] uppercase text-textDark dark:text-textLight">
          {title}
        </h3>
        <p className="text-[1.75vw] mt-2 text-gray-700 dark:text-gray-400 ">
          {description}
        </p>
      </div>
    </Html>
  );
}

import { animated } from '@react-spring/web';
import { LAYOUT } from './constants';
import { AboutSectionProps } from './types';

const AboutSection = ({ title, content, scene, style }: AboutSectionProps) => {
  return (
    <animated.div
      style={style}
      className="w-fit h-fit absolute top-0 bottom-0 left-0 right-0 m-auto pointer-events-none"
      role="tabpanel"
      aria-label={title}
    >
      <div
        className="text-textDark dark:text-textLight text-center"
        style={{ maxWidth: LAYOUT.section.maxWidth }}
      >
        <h2
          className="uppercase mb-[1vw]"
          style={{
            fontSize: LAYOUT.section.titleSize,
            marginBottom: LAYOUT.section.titleMarginBottom,
          }}
        >
          {title}
        </h2>
        <div
          className="space-y-4"
          style={{ fontSize: LAYOUT.section.contentSize }}
        >
          {content}
        </div>
      </div>
      {scene && (
        <div className="w-full h-full">
          <div className="w-full h-full">{scene}</div>
        </div>
      )}
    </animated.div>
  );
};

export default AboutSection;

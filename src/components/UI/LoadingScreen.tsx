import { animated, useTransition } from "@react-spring/web";
import { useEffect, useState } from "react";
import store from "../../appStore";

// const items = ["Alessandro", "Traiola"];
// const config = { mass: 5, tension: 750, friction: 150 };

function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  // const springProps = useSpring({
  //   config,
  //   opacity: isLoading ? 1 : 0,
  //   y: isLoading ? 0 : 20,
  //   height: isLoading ? 35 : 0,
  //   from: { opacity: 0, y: 20, height: 0 },
  // });

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      store.isLoading = false;
    }, 2500);
  }, []);

  const IsLoadingTransition = useTransition(isLoading, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    duration: 500,
  });

  return IsLoadingTransition(
    (style, item) =>
      item && (
        <animated.div
          className="fixed w-full h-full overflow-hidden flex flex-col justify-center items-center text-center z-[2001] top-0 left-0"
          style={style}
        >
          {/* {items.map((item) => (
            <animated.div
              key={item}
              className="trails-text relative w-full h-[35px] overflow-hidden xl:text-2xl leading-10 z-[2001]"
              style={{
                ...springProps,
                transform: springProps.y.interpolate(
                  (y) => `translate3d(0,${y}px,0)`
                ),
              }}
            >
              <animated.h1
                className="overflow-hidden text-white uppercase z-[2001]"
                style={springProps.height as unknown as React.CSSProperties}
              >
                {item}
              </animated.h1>
            </animated.div>
          ))} */}
        </animated.div>
      )
  );
}

export default LoadingScreen;

import React from "react";
import store from "../../appStore";
import { SpringValue, animated } from "@react-spring/web";
interface NavigatorProps {
  linkToPage: string;
  pageActiveName: string;
  opacity: SpringValue<number>;
}

const Navigator: React.FC<NavigatorProps> = ({
  linkToPage,
  pageActiveName,
  opacity,
}) => {
  return (
    <animated.div
      style={{
        opacity: opacity,
      }}
      className="flex flex-col justify-end items-center gap-4 xl:gap-6 select-none xl:text-lg w-full h-[40vh]"
    >
      <h4
        onClick={() => (store.pageActive = linkToPage)}
        className="-mb-4 transition-colors duration-250 font-semibold cursor-pointer rounded-md bg-secondaryDark hover:bg-white text-items hover:text-primaryDark drop-shadow-xl p-2 px-3 uppercase xl:text-2xl"
      >
        {pageActiveName}
      </h4>
    </animated.div>
  );
};

export default Navigator;

import { MouseEventHandler } from "react";
import { MdChevronLeft } from "react-icons/md";
import { useSnapshot } from "valtio";
import store from "../../appStore";
import { animated, useTransition } from "@react-spring/web";

const BackButton = ({
  onClickHandler,
  pageIsShowing,
}: {
  onClickHandler: MouseEventHandler;
  pageIsShowing: boolean;
}) => {
  const snap = useSnapshot(store);

  const IsLoadingTransition = useTransition(snap.pageActive === "Projects", {
    from: { opacity: 0, translateY: "10px" },
    enter: { opacity: 1, translateY: "0px" },
    leave: { opacity: 0, translateY: "10px" },
    duration: 100,
    delay: 750,
  });

  return (
    <div
      className={`${
        pageIsShowing
          ? "opacity-1 left-4 xl:left-8 "
          : " opacity-0 -left-[500px]"
      } transition-all duration-500 top-4 xl:top-8 fixed z-20 flex items-center gap-6 overflow-hidden`}
    >
      <div
        className="rounded-full w-fit p-2 hover:bg-white bg-secondaryDark text-items hover:text-primaryDark cursor-pointer drop-shadow-xl text-3xl"
        onClick={onClickHandler}
      >
        <MdChevronLeft />
      </div>
      {IsLoadingTransition(
        (style, item) =>
          item && (
            <animated.h4
              className="uppercase text-sm hidden xl:block"
              style={style}
            >
              Projects
            </animated.h4>
          )
      )}
    </div>
  );
};

export default BackButton;

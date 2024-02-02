import { MouseEventHandler } from "react";
import { MdChevronLeft } from "react-icons/md";

const BackButton = ({
  onClickHandler,
  pageIsShowing,
}: {
  onClickHandler: MouseEventHandler;
  pageIsShowing: boolean;
}) => {
  return (
    <div
      className={`${
        pageIsShowing
          ? "opacity-1 left-4 xl:left-8 "
          : " opacity-0 -left-[500px]"
      } transition-all duration-500 top-4 xl:top-8 rounded-full w-fit p-2 hover:bg-white bg-secondaryDark text-items hover:text-primaryDark cursor-pointer fixed z-20 text-3xl shadow-xl`}
      onClick={onClickHandler}
    >
      <MdChevronLeft />
    </div>
  );
};

export default BackButton;

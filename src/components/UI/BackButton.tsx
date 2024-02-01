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
        pageIsShowing ? "opacity-1 left-4 " : " opacity-0 -left-[500px]"
      } transition-all duration-500 top-4 rounded-full w-fit p-2 bg-gray-800 hover:bg-gray-700 cursor-pointer fixed z-20 text-3xl shadow-xl`}
      onClick={onClickHandler}
    >
      <MdChevronLeft />
    </div>
  );
};

export default BackButton;

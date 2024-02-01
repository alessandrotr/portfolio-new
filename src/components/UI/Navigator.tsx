import React from "react";
import store from "../../appStore";

interface NavigatorProps {
  linkToPage: string;
  pageActiveName: string;
  prevText: string;
}

const Navigator: React.FC<NavigatorProps> = ({
  linkToPage,
  pageActiveName,
  prevText,
}) => {
  return (
    <div className="flex flex-col items-center gap-4 xl:gap-6 select-none xl:text-lg">
      <p className="text-gray-400">{prevText}</p>

      <h4
        onClick={() => (store.pageActive = linkToPage)}
        className="transition-colors duration-250 font-semibold cursor-pointer rounded-md bg-secondaryDark hover:bg-white text-items hover:text-primaryDark drop-shadow-xl p-2 px-3 uppercase text-sm"
      >
        {pageActiveName}
      </h4>
    </div>
  );
};

export default Navigator;

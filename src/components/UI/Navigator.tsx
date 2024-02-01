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
    <p className="flex items-center gap-1.5 select-none xl:text-lg">
      <span className="text-gray-400">{prevText}</span>

      <span
        onClick={() => (store.pageActive = linkToPage)}
        className="text-items hover:text-itemsHover cursor-pointer"
      >
        {pageActiveName}
      </span>
    </p>
  );
};

export default Navigator;

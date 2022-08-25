import { useLayoutEffect } from "react";

const useDocumentTitle = (title) => {
  useLayoutEffect(() => {
    if (title) {
      document.title = title;
    } else {
      document.title = "Getama Shop - eCommerce React App";
    }
  }, [title]);
};

export default useDocumentTitle;

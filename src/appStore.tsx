import { proxy } from "valtio";

export const storeModel = {
  isLoading: true,
  projectActive: "ENRX",
  pageActive: "HomePage",
};

export const store = proxy(storeModel);

export default store;

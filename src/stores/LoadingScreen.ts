import { defineStore } from "pinia";
export const useLoadingScreenStore = defineStore({
  id: "LoadingScreen",
  state: () => ({
    isLoading: false,
  }),
  getters: {
    getIsLoading: (state) => {
      return state.isLoading;
    },
  },
  actions: {
    setIsLoading(value: boolean) {
      this.isLoading = value;
    },
  },
});

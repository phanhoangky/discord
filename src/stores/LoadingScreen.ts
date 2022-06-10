import { defineStore } from "pinia";
export const useLoadingScreenStore = defineStore({
  id: "LoadingScreen",
  state: () => ({
    isLoading: false,
    progress: 0,
  }),
  getters: {
    getIsLoading: (state) => {
      return state.isLoading;
    },
  },
  actions: {
    setIsLoading(value: boolean) {
      this.$patch({
        isLoading: value,
        progress: 0,
      });
    },
  },
});

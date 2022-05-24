import { defineStore } from "pinia";

export const enum MESSAGE_TYPE {
  INFOR = "toast-infor",
  ERROR = "circle-xmark",
  WARNING = "toast-warning",
  SUCCESS = "circle-check",
}

export const useToastMessageStore = defineStore({
  id: "toast",
  state: () => ({
    isShow: false,
    icon: "",
    message: "",
    header: "",
  }),
  actions: {
    setToast(type: string, header: string, message: string) {
      this.icon = type;
      this.message = message;
      this.header = header;
      this.setIsShow(true);
    },
    setIsShow(value: boolean) {
      this.isShow = value;
    },
  },
});

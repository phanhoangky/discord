import { MESSAGE_TYPE, useToastMessageStore } from "./../stores/ToastMessage";
import axios from "axios";
import { useLoadingScreenStore } from "@/stores/LoadingScreen";
const ApiHelper = axios.create({
  baseURL: "https://localhost:44390/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10 * 1000,
});
ApiHelper.interceptors.request.use((config) => {
  const jwtToken = document.cookie;
  console.log("[Token] >>>", jwtToken);

  if (config && config.headers && jwtToken) {
    config.headers["Authorization"] = "Bearer " + jwtToken;
  }
  // if (config.method === "post") {
  //   config.data = JSON.stringify(config.data);
  // }
  return config;
});

ApiHelper.interceptors.response.use(
  (response) => {
    const toastStore = useToastMessageStore();
    const loadingScreenStore = useLoadingScreenStore();
    if (response.config.method != "get") {
      toastStore.setToast(MESSAGE_TYPE.SUCCESS, "Success", response.statusText);
    }
    loadingScreenStore.setIsLoading(false);
    return response;
  },
  (error) => {
    const toastStore = useToastMessageStore();
    const loadingScreenStore = useLoadingScreenStore();
    console.log(error);

    if (error.response) {
      toastStore.setToast(
        MESSAGE_TYPE.ERROR,
        error.response.data.StatusCode,
        error.response.data.Message
      );
    }
    loadingScreenStore.setIsLoading(false);
    return Promise.reject(error);
  }
);

export default ApiHelper;

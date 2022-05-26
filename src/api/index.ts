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
  const loadingScreenStore = useLoadingScreenStore();
  loadingScreenStore.setIsLoading(true);
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

    if (error.code == "ERR_NETWORK") {
      toastStore.setToast(MESSAGE_TYPE.ERROR, error.code, error.message);
    }

    if (error.response) {
      if (error.response.data) {
        const { data } = error.response;
        console.log(data.errors.Name);

        let message: string = data.Message || "";
        if (data.errors.Name.length > 0) {
          data.errors.Name.forEach((e: string) => {
            console.log(e);
            message = `${message} \n ${e}`;
          });
        }

        toastStore.setToast(
          MESSAGE_TYPE.ERROR,
          data.StatusCode || data.status,
          message
        );
      }
    }

    loadingScreenStore.setIsLoading(false);
    return Promise.reject(error);
  }
);

export default ApiHelper;

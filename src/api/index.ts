import { MESSAGE_TYPE, useToastMessageStore } from "./../stores/ToastMessage";
import axios from "axios";
import { useLoadingScreenStore } from "@/stores/LoadingScreen";
const ApiHelper = axios.create({
  baseURL: "https://localhost:44335/api",
  headers: {
    // Accept: "*/*",
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 60 * 1000,
  // onDownloadProgress: (ev) => {
  //   console.log("[Download ] >>>>", ev);
  // },
  // onUploadProgress: (ev) => {
  //   console.log("[Upload] >>>", ev);
  // },
});
ApiHelper.interceptors.request.use((config) => {
  const jwtToken = document.cookie;
  const jwt = jwtToken.split(";");
  // console.log("[Token] >>>", jwt[jwt.length - 1]);

  if (config && config.headers && jwtToken) {
    config.headers["Authorization"] = "Bearer " + jwt[jwt.length - 1];
  }

  // if (config.method === "post") {
  //   config.data = JSON.stringify(config.data);
  // }
  // console.log("[Data] >>>", config, config.data);
  const param = config.data || config.params;
  if (param.isLoading) {
    const loadingScreenStore = useLoadingScreenStore();
    loadingScreenStore.setIsLoading(true);
  }
  return config;
});

ApiHelper.interceptors.response.use(
  (response) => {
    const toastStore = useToastMessageStore();
    const loadingScreenStore = useLoadingScreenStore();
    console.log(response.config.data, response.config.params);
    let parsedData = response.config.data;
    if (response.config.data && !(response.config.data instanceof Object)) {
      parsedData = JSON.parse(response.config.data);
    }
    const param = parsedData || response.config.params;
    if (param && param.isLoading) {
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
      loadingScreenStore.setIsLoading(false);
      return Promise.reject(error);
    }

    if (error.response) {
      if (error.response.data) {
        const { data, status } = error.response;

        let message: string = data.Message || data || "UNCERTAIN ERROR";
        if (data.errors && data.errors.Name && data.errors.Name.length > 0) {
          data.errors.Name.forEach((e: string) => {
            console.log(e);
            message = `${message} \n ${e}`;
          });
        }
        toastStore.setToast(
          MESSAGE_TYPE.ERROR,
          data.StatusCode || data.status || status,
          message
        );
      }
    }

    loadingScreenStore.setIsLoading(false);
    return Promise.reject(error);
  }
);

export default ApiHelper;

import { MESSAGE_TYPE, useToastMessageStore } from "./../stores/ToastMessage";
import axios from "axios";
const ApiHelper = axios.create({
  baseURL: "https://localhost:44390/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
ApiHelper.interceptors.request.use((config) => {
  // const jwtToken = document.cookie;
  // if (config && config.headers && jwtToken) {
  //   config.headers["Authorization"] = "Bearer " + jwtToken;
  // }
  // if (config.method === "post") {
  //   config.data = JSON.stringify(config.data);
  // }
  return config;
});

ApiHelper.interceptors.response.use(
  (resonse) => {
    const toastStore = useToastMessageStore();

    toastStore.setToast(MESSAGE_TYPE.SUCCESS, "Success", resonse.statusText);
    return resonse;
  },
  (error) => {
    const toastStore = useToastMessageStore();

    toastStore.setToast(MESSAGE_TYPE.ERROR, "Error", error);
    return Promise.reject(error);
  }
);

export default ApiHelper;

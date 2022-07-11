import { useLoadingScreenStore } from "@/stores/LoadingScreen";
import { MESSAGE_TYPE, useToastMessageStore } from "@/stores/ToastMessage";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getMetadata,
  type UploadMetadata,
} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDogAE49V02UfltFtu5-PiK8uobkh2qfZg",
  authDomain: "discord-6b898.firebaseapp.com",
  projectId: "discord-6b898",
  storageBucket: "discord-6b898.appspot.com",
  messagingSenderId: "415526923802",
  appId: "1:415526923802:web:afcdf0ba85343e2097aba3",
  // measurementId: "G-08QK30GSJC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export default app;
export const firebaseStorage = getStorage(app);
export const fbStorageRef = ref(firebaseStorage);

export const refFile = (path: string) => {
  return ref(firebaseStorage, path);
};

export const fetchFileURL = async (path: string) => {
  const file = ref(firebaseStorage, path);
  const result = await getDownloadURL(file);
  return result;
};

export const uploadFile = async (
  path: string,
  file: File,
  metadata?: UploadMetadata,
  isLoading?: boolean,
  isNotify?: boolean
) => {
  const loadingScreenStore = useLoadingScreenStore();
  const toastMessageStore = useToastMessageStore();
  loadingScreenStore.setIsLoading(isLoading ? isLoading : false);
  const task = await uploadBytesResumable(
    ref(firebaseStorage, path),
    file,
    metadata
  );
  task.task.on(
    "state_changed",
    () => {
      // const progess = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    },
    (error) => {
      console.log("[Firebase error] >>>", error);
      loadingScreenStore.setIsLoading(false);
      toastMessageStore.setToast(`${MESSAGE_TYPE.ERROR}`, "Firebase Error", "");
    },
    () => {
      console.log();
      loadingScreenStore.setIsLoading(false);
      if (isNotify) {
        toastMessageStore.setToast(
          `${MESSAGE_TYPE.SUCCESS}`,
          "Uploaded File",
          "Success"
        );
      }
    }
  );
};

export const fetchFileMetadata = async (filePath: string) => {
  const metadata = await getMetadata(ref(firebaseStorage, filePath)).catch(
    (error) => {
      console.log("[Firebase Error] >>>", error);
      const toastMessageStore = useToastMessageStore();
      toastMessageStore.setToast(`${MESSAGE_TYPE.ERROR}`, "Firebase Error", "");
    }
  );
  return metadata;
};

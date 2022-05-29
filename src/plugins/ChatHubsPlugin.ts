import { chatHub } from "@/stores/services/ChatHub";
import type { App, Plugin } from "vue";

export const ChatHubPlugin: Plugin = {
  install(app: App, options: any) {
    // ChatHub.start();
    app.config.globalProperties.$chatHub = chatHub;
  },
};

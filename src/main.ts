import type { ChatHub } from "@/stores/services/ChatHub";
import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import FontAwesomeIcon from "@/utilities/FontAwesome";
import { ChatHubPlugin } from "./plugins/ChatHubsPlugin";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ChatHubPlugin);
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $chatHub: ChatHub;
  }
}
app.component("font-awesome-icon", FontAwesomeIcon);
app.mixin({
  // beforeCreate() {
  //   console.log("[Created]:", this.$route);
  // },
});
// app.config.errorHandler = (err, vm, infor) => {
//   //
//   console.log("[Main Catch Error ]>>>", err, vm, infor);
// };
app.mount("#app");

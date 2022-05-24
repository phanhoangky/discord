import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import FontAwesomeIcon from "@/utilities/FontAwesome";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component("font-awesome-icon", FontAwesomeIcon);
app.mixin({
  beforeCreate() {
    console.log("[Created]:", this.$route);
  },
});
app.mount("#app");

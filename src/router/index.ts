import useUserStore from "@/stores/UserStore";
import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import JWT from "jwt-decode";
import useMessageStore from "@/stores/MessageStore";
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/ChatView/DashboardView.vue"),
    meta: {
      layout: "MainLayout",
    },
  },
  {
    path: "/user-profile",
    name: "UserProfile",
    component: () => import("@/views/UserProfile/UserProfileView.vue"),
    meta: {
      layout: "MainLayout",
    },
    beforeEnter: () => {
      const messageStore = useMessageStore();
      // messageStore.setSelectedRoom(undefined);
      // messageStore.setSelectedUser(undefined);
      messageStore.$patch({
        selectedUser: undefined,
        messages: [],
        selectedRoom: undefined,
      });
      // messageStore.messages = [];
    },
  },
  {
    path: "/sign-in",
    name: "SignIn",
    component: () => import("@/views/SignInView.vue"),
    meta: {
      layout: "AuthLayout",
    },
  },
  {
    path: "/sign-up",
    name: "SignUp",
    component: () => import("@/views/SignUpView.vue"),
    meta: {
      layout: "AuthLayout",
    },
  },
  // {
  //   path: "/about",
  //   name: "about",
  //   // route level code-splitting
  //   // this generates a separate chunk (About.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import("../views/AboutView.vue"),
  // },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  const store = useUserStore();
  // console.log(store.user);

  if (!store.user) {
    // console.log("[Cookie]", document.cookie);
    // if (document.cookie) {
    //   const jwt: any = JWT(document.cookie);
    //   if (jwt && jwt.actort) {
    //     const actor = JSON.parse(jwt?.actort);
    //     console.log(actor, store.user);
    //     store.setUser(actor);
    //     next();
    //   }
    // } else {
    //   const anonymous: string[] = ["SignUp", "SignIn"];
    //   if (to.name && !anonymous.includes(to.name.toString())) {
    //     console.log("[Push Login]");
    //     router.push("sign-in");
    //   }
    // }
    const anonymous: string[] = ["SignUp", "SignIn"];
    if (to.name && !anonymous.includes(to.name.toString())) {
      console.log("[Push Login]");
      router.push("sign-in");
    }
  }
  next();
});
export default router;

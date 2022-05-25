import { useUserStore } from "@/stores/UserStore";
import { createRouter, createWebHistory } from "vue-router";
import JWT from "jwt-decode";
const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/ChatView/DashboardView.vue"),
    meta: {
      layout: "MainLayout",
    },
  },
  {
    path: "/Device",
    name: "Device",
    component: () => import("@/views/DeviceView.vue"),
    meta: {
      layout: "MainLayout",
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
  // if (!document.cookie) {
  //   router.push("sign-in");
  // }
  // if (!store.user) {
  //   const jwt: any = JWT(document.cookie);
  //   if (jwt && jwt.actort) {
  //     const actor = JSON.parse(jwt?.actort);
  //     console.log(actor, store.user);
  //     store.setUser(actor);
  //     const anonymous: string[] = ["SignUp", "SignIn"];
  //     if (!actor && to.name && anonymous.includes(to.name.toString())) {
  //       router.push("sign-in");
  //       return;
  //     }
  //   }
  // }

  next();
});
export default router;

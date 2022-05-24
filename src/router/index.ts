import { useUserStore } from "./../stores/userStore";
import { createRouter, createWebHistory } from "vue-router";
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
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/AboutView.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  const store = useUserStore();
  const anonymous: string[] = ["SignUp", "SignIn"];
  if (
    store.getUser.email == "" &&
    to.name &&
    !anonymous.includes(to.name.toString())
  ) {
    console.log(store.$state.User, to);
    router.push("sign-in");
  }
  next();
});
export default router;

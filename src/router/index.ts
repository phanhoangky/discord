import useUserStore from "@/stores/UserStore";
import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import useMessageStore from "@/stores/MessageStore";
import JWT from "jwt-decode";
import { useRoomStore } from "@/stores/RoomStore";
import { getCookieValue } from "@/components/common/common";
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
      messageStore.$patch({
        selectedUser: undefined,
        messages: [],
        selectedRoom: undefined,
      });
    },
  },
  {
    path: "/sign-in",
    name: "SignIn",
    component: () => import("@/views/SignInView.vue"),
    meta: {
      layout: "AuthLayout",
    },
    beforeEnter: () => {
      const messageStore = useMessageStore();
      const roomStore = useRoomStore();
      messageStore.$patch({
        selectedUser: undefined,
        messages: [],
        selectedRoom: undefined,
      });
      roomStore.$patch({
        selectedRoom: undefined,
      });
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
    path: "/forgot-password",
    name: "ForgotPassword",
    component: () => import("@/views/ForgotPasswordView.vue"),
    meta: {
      layout: "AuthLayout",
    },
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: () => import("@/views/ResetPasswordView.vue"),
    meta: {
      layout: "AuthLayout",
    },
  },
  {
    path: "/confirm-email",
    name: "ConfirmEmail",
    component: () => import("@/views/ConfirmEmailView.vue"),
    meta: {
      layout: "AuthLayout",
    },
  },
  {
    path: "/confirmed-email",
    name: "ConfirmedEmail",
    component: () => import("@/views/ConfirmedEmailView.vue"),
    meta: {
      layout: "AuthLayout",
    },
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  try {
    // console.log("Next >>>>", to, from);
    const store = useUserStore();
    // console.log(store.user);
    const anonymous: string[] = [
      "SignUp",
      "SignIn",
      "ForgotPassword",
      "ResetPassword",
      "ConfirmedEmail",
      "ConfirmEmail",
    ];

    if (!store.user) {
      // const tokens = document.cookie.split(";");
      // tokens.splice(0, tokens.length - 1);
      const token = getCookieValue("apiToken");
      // console.log("[Cookie] >>>", token);
      if (!token && to.name && !anonymous.includes(to.name?.toString())) {
        next({ name: "SignIn" });
      } else if (token) {
        const decodedToken: any = JWT(token);
        if (
          decodedToken &&
          decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata"
          ]
        ) {
          const actor = JSON.parse(
            decodedToken[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata"
            ]
          );
          store.setUser(actor);
          next();
        } else {
          next({ name: "SignIn" });
        }
      } else {
        if (token && to.name && !anonymous.includes(to.name.toString())) {
          next({ name: "SignIn" });
        } else {
          next();
        }
      }
    } else if (store.user && to.name && to.name == "SignIn") {
      next({ name: "home" });
    } else {
      next();
    }
  } catch (error) {
    next({ name: "SignIn" });
  }
});
export default router;

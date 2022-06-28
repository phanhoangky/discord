<template>
  <div class="container">
    <!-- <div class="header__item icon">
      <font-awesome-icon icon="bell"></font-awesome-icon>
    </div> -->
    <div class="half-left">
      <!-- <Transition>
        <div class="header__item menu-icon" @click="openSidebar">
          <font-awesome-icon icon="bars"></font-awesome-icon>
        </div>
      </Transition> -->
    </div>
    <div class="half-right">
      <InvitationDrawer class="header__item icon"></InvitationDrawer>
      <div class="user__profile header__item" @click="toUserProfileView">
        <div class="image-overlay">
          <img
            :src="user?.photoUrl != '' ? user?.photoUrl : defaultAvatarURL"
          />
        </div>
        <span>{{ user?.firstName }} {{ user?.lastName }}</span>
      </div>
      <div class="header__item">
        <div class="switcher">
          <input
            id="toggleButton"
            type="checkbox"
            class="checkbox"
            hidden
            @change="toggleDarkTheme"
          />
          <label for="toggleButton" class="switch-button">
            <font-awesome-icon class="icon" icon="sun"></font-awesome-icon>
            <font-awesome-icon
              class="icon"
              icon="star-and-crescent"
            ></font-awesome-icon>
            <div class="slider round"></div>
          </label>
        </div>
      </div>
      <div class="logout__icon icon header__item">
        <ConfirmPopup
          :title="`Do you want to logout ?`"
          below
          align-right
          width="200px"
          :confirm-async="confirmLogout"
        >
          <font-awesome-icon icon="dungeon"></font-awesome-icon>
        </ConfirmPopup>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import useUserStore from "@/stores/UserStore";
import { mapActions, mapState } from "pinia";
import { defineComponent } from "vue";
import InvitationDrawer from "./Header/Modals/InvitationDrawer.vue";
import ConfirmPopup from "./common/ConfirmPopup.vue";

export default defineComponent({
  setup() {
    return {};
  },
  data: () => {
    return {
      isOpenSidebar: false,
    };
  },
  computed: {
    ...mapState(useUserStore, {
      user: "user",
    }),
    defaultAvatarURL() {
      const url = new URL("../assets/defaultuser.png", import.meta.url);
      return url.toString();
    },
  },
  methods: {
    ...mapActions(useUserStore, {
      logout: "logout",
    }),
    toUserProfileView() {
      this.$router.push({ name: "UserProfile" });
    },
    toggleDarkTheme() {
      const html = document.documentElement;
      html.classList.toggle("dark-theme");
    },
    confirmLogout() {
      this.logout();
    },
    openSidebar() {
      //
    },
  },
  components: { InvitationDrawer, ConfirmPopup },
});
</script>

<style scoped lang="scss">
.container {
  display: flex;
  gap: 1em;
  justify-content: space-between;
  height: 100%;

  .half-left,
  .half-right {
    display: flex;
    gap: 1em;
    justify-content: center;
    align-items: center;
    .header__item {
      height: 100%;
      display: flex;
      gap: 10px;
      align-items: center;
      justify-content: center;
      padding: 0 10px;
      transition: all 0.3s ease;
      border-radius: 5px;
      min-width: 50px;
      cursor: pointer;
      .switcher {
        width: 50px;
        aspect-ratio: 2 / 1;
        .checkbox:checked + .switch-button .slider {
          transform: translateX(25px);
        }
        .switch-button {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          border-radius: 50px;
          border: 1px solid var(--vt-c-black-mute);
          padding: 0px;
          position: relative;
          background-color: var(--vt-c-black-soft);

          .icon {
            width: 50%;
          }
          .slider {
            position: absolute;
            height: 100%;
            width: 50%;
            left: 0;
            top: 0;
            bottom: 0;
            border-radius: 50%;
            transition: all 0.3s ease;
            background-color: var(--vt-c-white-mute);
          }
        }
      }
      .image-overlay {
        height: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        aspect-ratio: 1 / 1;
        background-color: var(--vt-c-white-mute);
        img {
          box-sizing: initial;
          height: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          padding: 4px;
          background-color: transparent;
          outline: var(--vt-c-blue-light-2) solid 4px;
        }
      }

      &:hover {
        background-color: var(--vt-c-button-hover-bg);
        color: var(--vt-c-button-hover-text);
      }
    }
  }
  .half-left {
    .menu-icon {
      font-size: large;
      display: flex;
    }
  }
  .half-right {
  }
}
@media only screen and (min-width: 40em) {
  .container {
    .half-left {
      .header__item {
        &.menu-icon {
          display: none;
        }
      }
    }
  }
}
</style>

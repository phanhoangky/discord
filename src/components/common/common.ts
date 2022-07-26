import { onBeforeUnmount, onMounted, type Ref } from "vue";

export const useClickOutSide = (elementRef: Ref, callback) => {
  //
  if (!elementRef) return;

  //
  const listener = (event: MouseEvent) => {
    if (elementRef.value.contains(event.target)) {
      return;
    }
    if (typeof callback == "function") {
      callback();
    }
  };

  onMounted(() => {
    window.addEventListener("mousedown", listener);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("mousedown", listener);
  });
  return listener;
};

export const setCookie = (name: string, value: string, exDays: number) => {
  //
  const date = new Date();
  date.setTime(date.getTime() + exDays * 24 * 60 * 60 * 1000);
  const expire = "expires=" + date.toUTCString();
  document.cookie = `${name}=${value}; expires=${expire}; path=/`;
};

export const getCookieValue = (name: string) => {
  //
  const decodedCookie = decodeURIComponent(document.cookie).split(";");
  console.log("[Cookie Value] .>>", decodedCookie, document.cookie, `${name}=`);
  const key = decodedCookie.filter((c) => c.trim().indexOf(`${name}=`) == 0);
  if (key.length > 0) {
    const value = key[0].trim().substring(name.length + 1, key[0].length);
    console.log("[Cookie Value] .>>", value);
    return value.trim();
  }

  if (key.length == 0) {
    return null;
  }
};

export const deleteCookiee = (name: string) => {
  //
  document.cookie = `${name}=""; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

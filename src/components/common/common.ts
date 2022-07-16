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
    console.log("[Unmount]: Click");

    window.removeEventListener("mousedown", listener);
  });
  return listener;
};

// export const useClickOutSide = (
//   element: HTMLElement,
//   callback: () => any | Promise<any>
// ): any => {
//   console.log(element);

//   function onClickOutSide(event: any) {
//     //
//     console.log("[Click out side] ??");

//     if (element) {
//       if (element.contains(event.target)) {
//         //
//         callback();
//       }
//     }
//   }
//   if (element) {
//     //
//     onMounted(() => {
//       window.addEventListener("click", onClickOutSide);
//     });
//     onUnmounted(() => {
//       window.removeEventListener("click", onClickOutSide);
//     });
//   }
// };

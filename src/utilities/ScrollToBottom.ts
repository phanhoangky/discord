export const scrollToBottom = (element: string) => {
  const elementRef = document.getElementById(element);
  console.log(
    element,
    elementRef,
    elementRef?.scrollHeight,
    elementRef?.scrollTop
  );

  if (elementRef) {
    elementRef.scrollTo({
      top: elementRef.scrollHeight,
      behavior: "smooth",
    });
  }
};

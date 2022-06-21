export const scrollToBottom = (element: string) => {
  const elementRef = document.getElementById(element);
  console.log(element, elementRef);

  if (elementRef) {
    elementRef.scrollTo({
      top: elementRef.scrollHeight,
      behavior: "smooth",
    });
  }
};

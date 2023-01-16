export function smoothScroll(gallery) {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();
  window.scrollTo({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

import { parQuery, openGallery } from './index';

export async function infiniteScroll() {
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;
  const scrolled = window.scrollY;
  const threshold = height - screenHeight / 4;
  const position = scrolled + screenHeight;
  if (position >= threshold) {
    parQuery.page += 1;
    await openGallery();
  }
}

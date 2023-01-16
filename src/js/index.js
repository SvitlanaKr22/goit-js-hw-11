//Створи фронтенд частину застосунку пошуку і перегляду зображень за ключовим словом.
// Додай оформлення елементів інтерфейсу.
// У відповіді буде масив зображень, що задовольнили критерії параметрів запиту.

//Кожне зображення описується об'єктом, з якого тобі цікаві тільки наступні властивості:
// webformatURL - посилання на маленьке зображення для списку карток.
// largeImageURL - посилання на велике зображення.
// tags - рядок з описом зображення. Підійде для атрибуту alt.
// likes - кількість лайків.
// views - кількість переглядів.
// comments - кількість коментарів.
// downloads - кількість завантажень.

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { fetchContents } from './fetchcontents';
import { createMarkUp } from './createmarkup';
import { smoothScroll } from './smoothscroll';
import { infiniteScroll } from './infinitscroll';

Notify.init({
  width: '400px',
  fontSize: '20px',
  position: 'right-top',
  info: {
    background: '#e978d0',
  },
});

const THROTLLE_DELAY = 300;
const NUM_IMG = 40;

export const parQuery = {
  nameQuery: '',
  page: null,
  per_page: NUM_IMG,
};

const galleryBox = new SimpleLightbox('.gallery a', {
  /* options */
  captionPosition: 'center',
  captionDelay: 250,
  animationSpeed: 500,
  fadeSpeed: 200,
});

const gallery = document.querySelector('.gallery');
const form = document.querySelector('#search-form');

let isEvtSubmit;
let isEvtScroll;

form.addEventListener('submit', onFormSubmit);
document.addEventListener('scroll', throttle(onWindowScroll, THROTLLE_DELAY));

async function onFormSubmit(evt) {
  evt.preventDefault();
  gallery.innerHTML = '';
  isEvtSubmit = true;
  isEvtScroll = false;

  const { searchQuery } = evt.target.elements;
  parQuery.nameQuery = searchQuery.value;
  parQuery.page = 1;
  await openGallery();
}

async function onWindowScroll() {
  if (isEvtSubmit && !isEvtScroll) {
    isEvtSubmit = false;
    isEvtScroll = true;
    return;
  }
  if (isEvtScroll) await infiniteScroll();
}

export async function openGallery() {
  try {
    const {
      data: { hits, totalHits },
    } = await fetchContents(parQuery);

    if (
      !isEvtSubmit &&
      isEvtScroll &&
      totalHits &&
      parQuery.page * parQuery.per_page >= totalHits
    ) {
      Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      isEvtScroll = false;
      return;
    }

    if (!hits.length) {
      Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    gallery.innerHTML += createMarkUp(hits);
    galleryBox.refresh();

    if (parQuery.page > 1) {
      smoothScroll(gallery);
      Notify.success(`Hooray! We found ${totalHits} images.`);
    }
  } catch (error) {
    console.log(error);
    Notify.failure(`Oops!  ${error}`);
  }
}

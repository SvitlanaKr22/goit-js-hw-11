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

const parQuery = {
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

let isEvtSubit = false;

form.addEventListener('submit', onFormSubmit);
document.addEventListener('scroll', throttle(onWindowScroll, THROTLLE_DELAY));

async function onFormSubmit(evt) {
  evt.preventDefault();
  gallery.innerHTML = '';
  isEvtSubit = true;
  const { searchQuery } = evt.target.elements;
  parQuery.nameQuery = searchQuery.value;
  parQuery.page = 1;

  await openGallery();
}

async function onWindowScroll() {
  if (isEvtSubit) {
    isEvtSubit = false;
    return;
  }
  await infiniteScroll();
}

async function openGallery() {
  try {
    const {
      data: { hits, totalHits },
    } = await fetchContents(parQuery);

    if (!hits.length) {
      Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    gallery.innerHTML += createMarkUp(hits);
    galleryBox.refresh();

    if (parQuery.page > 1) {
      smoothScroll();
      Notify.success(`Hooray! We found ${totalHits} images.`);
    }
  } catch (error) {
    console.log(error);
    Notify.failure(`Oops!  ${error}`);
  }
}

function smoothScroll() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();
  window.scrollTo({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

async function infiniteScroll() {
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

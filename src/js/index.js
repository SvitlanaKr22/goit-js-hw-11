//Створи фронтенд частину застосунку пошуку і перегляду зображень за ключовим словом.
// Додай оформлення елементів інтерфейсу.
// user_id:32806243
//32806243-dfe26fa8cb817022a28999782

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
  //background: '#32c682',
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

function onFormSubmit(evt) {
  isEvtSubit = true;
  evt.preventDefault();
  gallery.innerHTML = '';
  const { searchQuery } = evt.target.elements;
  parQuery.nameQuery = searchQuery.value;
  parQuery.page = 1;
  console.log('вызов openGallery в onFormSubmit', parQuery.page);
  openGallery();
}

function onWindowScroll() {
  if (isEvtSubit) {
    isEvtSubit = false;
    return;
  }

  // получаем высоту элемента, на котором произошло событие
  // Нам потребуется знать высоту документа и высоту экрана:
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;
  // Записываем, сколько пикселей пользователь уже проскроллил:
  const scrolled = window.scrollY;

  // Обозначим порог, по приближении к которому
  // будем вызывать какое-то действие.
  const threshold = height - screenHeight / 4;
  // console.log('порог:', threshold);
  // Отслеживаем, где находится низ экрана относительно страницы:
  const position = scrolled + screenHeight;
  //  console.log('текущая позиция:', position);
  if (position >= threshold) {
    // Если мы пересекли полосу-порог, вызываем нужное действие.
    console.log('We are on the place!!!');
    parQuery.page += 1;
    console.log('page:', parQuery.page);
    openGallery();
  }
}

async function openGallery() {
  try {
    const {
      data: { hits },
    } = await fetchContents(parQuery);

    if (!hits.length) {
      Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    gallery.innerHTML += createMarkUp(hits);
    galleryBox.refresh();
    console.log('номер страницы в openGallery', parQuery.page);
    if (parQuery.page > 1) smoothScroll();
  } catch (error) {
    console.log(error);
    console.log('это ошибка');
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

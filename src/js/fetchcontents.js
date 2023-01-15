// Для бекенду використовуй публічний API сервісу Pixabay.
// key - твій унікальний ключ доступу до API.
// q - термін для пошуку. Те, що буде вводити користувач.
// image_type - тип зображення. На потрібні тільки фотографії, тому постав значення photo.
// orientation - орієнтація фотографії. Постав значення horizontal.
// safesearch - фільтр за віком. Постав значення true.

import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '32806243-dfe26fa8cb817022a28999782';
export async function fetchContents({ nameQuery, page, per_page }) {
  const config = {
    url: BASE_URL,
    params: {
      key: API_KEY,
      q: `${nameQuery}`,
      page,
      per_page,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
    },
  };

  try {
    return await axios(config);
  } catch (error) {
    console.error(error);
  }
}

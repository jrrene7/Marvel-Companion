const axios = require('axios');
const db = require('../db/config');


const COMIC_VINE_KEY = process.env.COMIC_VINE_API_KEY;
const COMIC_VINE_BASE = 'https://comicvine.gamespot.com/api';

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
}

const Books = {}

Books.getBooks = (request, response, next) => {
  const title = request.body.input;
  axios.get(`${COMIC_VINE_BASE}/search/`, {
    params: {
      api_key: COMIC_VINE_KEY,
      format: 'json',
      query: title,
      resources: 'volume',
      field_list: 'id,name,deck,image',
      limit: 20
    }
  })
  .then(res => {
    const results = (res.data.results || []).map(item => ({
      id: item.id,
      title: item.name || 'Unknown Title',
      description: item.deck || '',
      thumbnail: item.image ? item.image.medium_url : null,
    }));
    response.locals.titleData = results;
    next();
  })
  .catch(err => console.error(`ERROR IN RETRIEVING TITLE: ${err}`));
};

// Books.saveSeach = (request, response, next) => {
// 	 const book = request.body.data.results;
// 	db.one( 'INSERT INTO user_books (user_id, book_id, book) VALUES ($1, $2, $3) RETURNING *', 
// 		[request.users.id, request.Books.id, book])
// 	.then((bookData) => {
// 		response.locals.bookData = bookData;
// 		console.log(bookData);
// 		next();
// 	})
// };


//worked with GAINOR
Books.saveSearch = (book, user_id) => {
	console.log('====>', book)
	 const {title, description, thumbnail} = book;
	// const character = request.body.data.results;
	return db.one('INSERT INTO books (title, description, thumbnail, user_id) VALUES (?, ?, ?, ?) RETURNING *',
		[title, description, thumbnail, user_id])
	// .then(() => {
	// 	// response.locals.characterData = characterData;
	// 	// console.log(characterData);
	// 	next();
	// })
};

Books.getFavorites = (user_id) => {
	return db.any('SELECT * FROM books WHERE user_id = ?', [user_id]);
}

// Books.updateFavorite = (req, res, next) => {
//   const {user_id, book_id} = res.locals.userBooks;
//   const {id} = req.params;
//   db.oneOrNone(`UPDATE user_books SET
//     user_id = $1, book_id = $2
//     WHERE id = $3 RETURNING *`,
//     [user_id, book_id, id])
//     .then(userBook => {
//       res.locals.userBook = userBook;
//       next();
//     })
//     .catch(err => console.log(err));
// };

Books.getBookById = async (id) => {
  const res = await axios.get(`${COMIC_VINE_BASE}/volume/4050-${id}/`, {
    params: {
      api_key: COMIC_VINE_KEY,
      format: 'json',
      field_list: 'id,name,deck,description,image,start_year,count_of_issues,publisher,person_credits,character_credits,site_detail_url'
    }
  });
  const v = res.data.results;
  if (!v) return null;

  return {
    id: v.id,
    title: v.name || 'Unknown Title',
    description: stripHtml(v.description) || v.deck || 'No description available.',
    thumbnail: v.image ? v.image.super_url || v.image.medium_url : null,
    pageCount: v.count_of_issues || '—',
    saleDate: v.start_year || '—',
    price: '—',
    detailUrl: v.site_detail_url || null,
    creators: (v.person_credits || []).map(p => ({
      name: p.name,
      role: p.role ? p.role.charAt(0).toUpperCase() + p.role.slice(1) : 'Creator'
    })),
    characters: (v.character_credits || []).slice(0, 20).map(c => ({ name: c.name })),
  };
};

Books.deleteFavorite = (request, response, next) => {
  const {id} = request.params;
  db.none('DELETE FROM books WHERE id = ?', [id])
  .then(()=> next())
  .catch(err => console.log(err));
};







module.exports = Books;
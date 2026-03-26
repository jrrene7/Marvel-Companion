const axios = require('axios');
const db = require('../db/config');


const TS = process.env.TS;
const API_KEY = process.env.API_KEY;
const HASH = process.env.HASH;

const Books = {}

Books.getBooks = (request, response, next) => {
	const title = request.body.input;
	const urlStr = `https://gateway.marvel.com:443/v1/public/comics?dateDescriptor=thisMonth&titleStartsWith=${title}&limit=20&ts=${TS}&apikey=${API_KEY}&hash=${HASH}`;
	console.log(urlStr);
	axios.get(`https://gateway.marvel.com:443/v1/public/comics?dateDescriptor=thisMonth&titleStartsWith=${title}&limit=20&ts=${TS}&apikey=${API_KEY}&hash=${HASH}`)
	.then( titleData => {
		response.locals.titleData = titleData.data.data.results;
		next()
	}).catch( err => {
		console.error(`ERROR IN RETRIEVING TITLE: ${err}`)
	})
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
  const res = await axios.get(
    `https://gateway.marvel.com:443/v1/public/comics/${id}?ts=${TS}&apikey=${API_KEY}&hash=${HASH}`
  );
  const comic = res.data.data.results[0];
  if (!comic) return null;

  const onsale = comic.dates.find(d => d.type === 'onsaleDate');
  const saleDate = onsale
    ? new Date(onsale.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  const printPrice = comic.prices.find(p => p.type === 'printPrice');
  const price = printPrice && printPrice.price > 0 ? `$${printPrice.price.toFixed(2)}` : '—';

  const detailUrl = (comic.urls.find(u => u.type === 'detail') || {}).url || null;

  return {
    id: comic.id,
    title: comic.title,
    description: comic.description || 'No description available.',
    thumbnail: `${comic.thumbnail.path}.${comic.thumbnail.extension}`,
    pageCount: comic.pageCount > 0 ? comic.pageCount : '—',
    saleDate,
    price,
    detailUrl,
    creators: comic.creators.items.map(c => ({
      name: c.name,
      role: c.role.charAt(0).toUpperCase() + c.role.slice(1)
    })),
    characters: comic.characters.items.map(c => ({ name: c.name })),
  };
};

Books.deleteFavorite = (request, response, next) => {
  const {id} = request.params;
  db.none('DELETE FROM books WHERE id = ?', [id])
  .then(()=> next())
  .catch(err => console.log(err));
};







module.exports = Books;
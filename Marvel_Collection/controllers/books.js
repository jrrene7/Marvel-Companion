const router = require('express').Router();
const auth = require('../services/auth');
const Books = require('../models/books');

const User = require('../models/user');
const passport = require('passport');


router.get('/search',
		auth.restrict,
		(request, response) =>{
				response.render('books/index', response.locals.titleData);
});

router.post('/show',
		auth.restrict,
		Books.getBooks,
		(request, response) =>{
				response.render('books/show', {books: response.locals.titleData});
});

router.post('/home', auth.restrict, (request, response) => {
     Books.saveSearch({
     	title: request.body.title,
     	description: request.body.description,
     	thumbnail: request.body.thumbnail}, request.user.id)
     .then(() => response.redirect('/books/home'))
     .catch(err => console.error(err));
  });

router.get('/home', auth.restrict, (request, response) => {
     	Books.getFavorites(request.user.id)
     	.then((books) => {
     		    response.render('home', {books});
     	})
     	.catch(err => console.error(err));
})

// router.put('/:id',
//   Books.updateFavorite,
//   (request, response) => {
//     const {userBook} = response.locals;
//     response.json({userBook});
//   });

router.get('/:id', auth.restrict, async (req, res) => {
  try {
    const book = await Books.getBookById(req.params.id);
    if (!book) return res.status(404).send('Book not found');
    res.render('books/detail', book);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading book');
  }
});

router.delete('/:id',
  Books.deleteFavorite,
  (request, response) => {
    response.send('deleted');
  });


module.exports = router;
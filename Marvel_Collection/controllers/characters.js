const router = require('express').Router();
const auth = require('../services/auth');
const Characters = require('../models/characters');

const User = require('../models/user');
const passport = require('passport');



router.get('/search',
		auth.restrict,
		(request, response) =>{
				response.render('characters/index', response.locals.nameData);
});

router.post('/show',
		auth.restrict,
		Characters.getCharacters,
		(request, response) =>{
				response.render('characters/show', {characters: response.locals.nameData});
});

router.post('/home', auth.restrict, (request, response) => {
     Characters.saveSearch({
     	name: request.body.name,
     	description: request.body.description,
     	thumbnail: request.body.thumbnail}, request.user.id)
     .then(() => response.redirect('/characters/home'))
     .catch(err => console.error(err));
  });

router.get('/home', auth.restrict, (request, response) => {
     	Characters.getFavorites(request.user.id)
     	.then((characters) => {
     		    response.render('home', {characters});
     	})
     	.catch(err => console.error(err));
})

// router.get('/home/edit',
//   // Characters.updateFavorite,
//   (request, response) => {
//     console.log(Characters);
//     const {userCharacter} = response.locals;
//     response.render('characters/edit', {userCharacter});
//   });

// router.put('/:id', 
//   Characters.updateFavorite,
//   (request, response) => {
//     console.log('======> HERE');
//     const {userCharacter} = response.locals;
//     response.json({userCharacter})
//   })

router.get('/:id', auth.restrict, async (req, res) => {
  try {
    const character = await Characters.getById(req.params.id);
    if (!character) return res.status(404).send('Character not found');
    res.render('characters/detail', character);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading character');
  }
});

router.delete('/:id',
  Characters.deleteFavorite,
  (request, response) => {
    response.send('deleted');
  });



module.exports = router;
const axios = require('axios');
const db = require('../db/config');

const SUPERHERO_API_URL = 'https://akabab.github.io/superhero-api/api/all.json';

let heroCache = null;

async function getAllHeroes() {
  if (heroCache) return heroCache;
  const res = await axios.get(SUPERHERO_API_URL);
  heroCache = res.data;
  return heroCache;
}

const Characters = {};

Characters.getCharacters = async (request, response, next) => {
  const name = request.body.input.toLowerCase();
  console.log('search input: ' + name);

  try {
    const allHeroes = await getAllHeroes();
    const results = allHeroes
      .filter(hero =>
        hero.biography.publisher === 'Marvel Comics' &&
        hero.name.toLowerCase().includes(name)
      )
      .map(hero => {
        const imgUrl = hero.images.md;
        const lastDot = imgUrl.lastIndexOf('.');
        const descParts = [
          hero.biography.fullName ? `Real name: ${hero.biography.fullName}` : '',
          hero.biography.firstAppearance ? `First appearance: ${hero.biography.firstAppearance}` : '',
          hero.biography.alignment ? `Alignment: ${hero.biography.alignment}` : ''
        ].filter(Boolean);

        return {
          id: hero.id,
          name: hero.name,
          description: descParts.join(' | '),
          thumbnail: {
            path: imgUrl.substring(0, lastDot),
            extension: imgUrl.substring(lastDot + 1)
          }
        };
      });

    response.locals.nameData = results;
    next();
  } catch (err) {
    console.error(`ERROR RETRIEVING CHARACTER: ${err}`);
    next(err);
  }
};

Characters.saveSearch = (character, user_id) => {
  const { name, description, thumbnail } = character;
  return db.one(
    'INSERT INTO characters (name, description, thumbnail, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, description, thumbnail, user_id]
  );
};

Characters.getFavorites = (user_id) => {
  return db.any('SELECT * FROM characters WHERE user_id = $1', user_id);
};

Characters.updateFavorite = (req, res, next) => {
  const { id } = req.params;
  db.oneOrNone(
    'UPDATE characters SET name = $1, description = $2, thumbnail = $3 WHERE id = $4 RETURNING *',
    [name, description, thumbnail, id]
  )
    .then(userCharacter => {
      res.locals.userCharacter = userCharacter;
      next();
    })
    .catch(err => console.log(err));
};

Characters.deleteFavorite = (request, response, next) => {
  const { id } = request.params;
  db.none('DELETE FROM characters WHERE id = $1', id)
    .then(() => next())
    .catch(err => console.log(err));
};

module.exports = Characters;

require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const mustacheExpress = require('mustache-express');

const logger = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// var names = require('marvel-comics-characters');
// var allNames = names.all;
// var randomName = names.random();
// var threeRandomNames = names.random(3);


const charactersController = require('./controllers/characters');
const booksController = require('./controllers/books');
const userController = require('./controllers/user');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// view setup.
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// asset setup.
app.use(express.static(__dirname + '/public'));

// auth setup.
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

app.use(logger('dev'));

const auth = require('./services/auth.js');
app.use(auth.passportInstance);
app.use(auth.passportSession);
app.use(cookieParser());

app.use((request, response, next) => {
	response.locals.user = request.user || null;
	next();
})


app.get('/', (req, res) => {
  res.render('index');
})
app.get('/home', (req, res) => {
  res.render('home');
})

app.use('/characters', charactersController);
app.use('/books', booksController );
app.use('/user', userController);


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

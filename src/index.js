const express = require('express');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session'); // Create user session
const MySQLStore = require('express-mysql-session')(session); // Store user session on mysql database
const passport = require('passport');
const cookieParser = require("cookie-parser");
const cors = require('cors')
require('dotenv').config();  // Read environment variables
require('./lib/passport');
const { databaseConection } = require('./config');

// Initializations

const app = express();   // Initialize express

// Settings 

app.set('port', process.env.PORT || 4000);   // If variable PORT is empty use 4000

// Middlewares

app.use(express.urlencoded({ extended: false }));   // Permite recibir datos desde formularios, no se aceptan archivos como imagenes, etc.
app.use(express.json());     // Allow send and receive json
app.use(
    cors({
        origin: ["https://dannielfrs.github.io", "http://localhost:3000"], // Location of the react app from where connecting to
        credentials: true,
    })
);
app.use(session({
    // key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    resave: true,
    saveUninitialized: true,
    store: new MySQLStore(databaseConection), // Store user session on mysql database
    cookie: {
        maxAge: 1000 * 60 * 60,   // User session expires in one hour
        secure : process.env.NODE_ENV === "production" ? true : false
    },
}));
app.use(cookieParser('session_cookie_secret'));
app.use(passport.initialize());
app.use(passport.session());   // Create a session for passport
app.use(morgan('dev'));

// Routes

app.use(require('./routes/authentication'));
app.use('/api/movies', require('./routes/movies'));

// Public

app.use(express.static(path.join(__dirname, 'public')));  // Static files location

// Starting the server

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});
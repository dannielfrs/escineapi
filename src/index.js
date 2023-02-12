const express = require('express');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session'); // Las sesiones almacenan datos en la memoria del servidor o en la base de datos
const passport = require('passport');
const cookieParser = require("cookie-parser");
const cors = require('cors')
require('dotenv').config();  // read environment variables
require('./lib/passport');

// Initializations

const app = express();   // Initialize express

// Settings 

app.set('port', process.env.PORT || 4000);   // If variable PORT is empty use 4000

// Middlewares

app.use(cookieParser());
app.use(
    session({
        key: "userId",
        secret: "subscribe",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60,   // User session expires in one hour
        },
    })
);
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));   // Permite recibir datos desde formularios, no se aceptan archivos como imagenes, etc.
app.use(express.json());     // Allow send and receive json
app.use(passport.initialize());
app.use(passport.session());   // Create a session for passport
app.use(
    cors({
        origin: ["https://dannielfrs.github.io", "http://localhost:3000"], // Location of the react app were connecting to
        credentials: true,
    })
);

// Routes

app.use(require('./routes/authentication'));
app.use('/api/movies', require('./routes/movies'));

// Public

app.use(express.static(path.join(__dirname, 'public')));  // Static files location

// Starting the server

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});
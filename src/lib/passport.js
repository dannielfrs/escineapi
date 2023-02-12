const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const database = require('../database');
const useBcrypt = require('./bcrypt');

passport.use('local.register', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const rows = await database.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
        return done(null, false, { content: 'El nombre de usuario ya existe', type: "error" });
    }
    const { firstName, lastName, email } = req.body;
    const newUser = {
        username,
        password,
        firstName,
        lastName,
        email
    };
    newUser.password = await useBcrypt.encryptPassword(password);
    console.log(newUser)
    const result = await database.query('INSERT INTO users SET ?', [newUser]);
    console.log(result)
    newUser.id = result.insertId;
    return done(null, newUser, { content: 'Usuario registrado exitosamente', type: "success" });
}));

passport.use('local.login', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    console.log(req.body);
    console.log(req.user);
    const rows = await database.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await useBcrypt.matchPassword(password, user.password);
        if (validPassword) {
            done(null, user, { content: 'Bienvenido ' + user.username, type: "success" });
        } else {
            done(null, false, { content: 'Contraseña incorrecta', type: "error" });
        }
    } else {
        return done(null, false, { content: 'El nombre de usuario no existe', type: "error" });
    }
}));

// Create a cookie on the browser with the userid inside of it
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Read the cookie on the browser to get the user 
passport.deserializeUser(async (id, done) => {
    const [row] = await database.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, row);
});
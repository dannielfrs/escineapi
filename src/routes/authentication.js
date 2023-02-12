const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/verifyIsLoggedIn');
const upload = require('../lib/multer');

router.post('/register', upload.none(), isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.register', (error, user, message) => {
        if (error) return next(error);
        res.json({ message: message, user: false, isLoggedin: false });
    })(req, res, next);
});

router.get("/login", upload.none(), (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ message: { content: 'Sesión de usuario activa', type: "info" }, user: req.user, isLoggedin: true });
    } else {
        console.log('No has iniciado sesión')
        res.json({ message: { content: 'No has iniciado sesión', type: "info" }, user: false, isLoggedin: false });
    }
});

router.post('/login', upload.none(), isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.login', (error, user, message) => {
        if (error) throw error
        if (!user) res.json({ message: message, user: false, isLoggedin: false });
        else {
            req.logIn(user, (error) => {
                if (error) throw error;
                res.json({ message: message, user: user, isLoggedin: true });
            });
        }
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.json({ message: { content: 'Sesión finalizada', type: "info" }, user: false, isLoggedin: false });
});


router.get('/', (req, res) => {
    res.send("Bienvenido al servidor");
})


module.exports = router;
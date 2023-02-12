module.exports = {

    isLoggedIn(req, res, next) {
        if (req.user) {
            return next();
        }
        return res.json({ message: { content: 'No has iniciado sesión', type: "info" }, user: false, isLoggedin: false });
    },

    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        return res.json({ message: { content: 'Sesión de usuario activa', type: "info" }, user: req.user, isLoggedin: true });
    }
}
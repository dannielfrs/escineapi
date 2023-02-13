const express = require('express');
const router = express.Router();
const { unlink } = require('fs-extra');
const path = require('path');
const upload = require('../lib/multer');
const database = require('../database');
const { isLoggedIn } = require('../lib/verifyIsLoggedIn');

router.get('/', isLoggedIn, async (req, res) => {
    const movies = await database.query('SELECT * FROM movies WHERE user_id = ?', [req.user.id])
    res.json({ movies: movies, isLoggedin: true })
});

router.post('/add', upload.single('image'), isLoggedIn, async (req, res) => {
    const { title, year, genre, duration, description } = req.body;  // Javascript destructuring 
    let imagePath = ''
    if (req.file) {
        imagePath = '/uploads/' + req.file.filename;
    }
    const newMovie = {
        title,
        year,
        genre,
        duration,
        description,
        imagePath,
        user_id: req.user.id
    }
    await database.query('INSERT INTO movies set ?', [newMovie]);  // Add to database
    res.json({ message: { content: 'Pelicula agregada exitosamente', type: "success" } });
});

router.post('/edit/:id', upload.single('image'), isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, year, genre, duration, description } = req.body;
    let imagePath = ''
    const [item] = await database.query('SELECT * FROM movies WHERE id = ?', [id]);
    if (req.file) {
        imagePath = '/uploads/' + req.file.filename;
        unlink(path.resolve('./src/public' + item.imagePath));  // Delete file stored on server
    } else {
        imagePath = item.imagePath;
    }
    const editedMovie = {
        title,
        year,
        genre,
        duration,
        description,
        imagePath,
    }
    console.log(editedMovie);
    await database.query('UPDATE movies set ? WHERE id = ?', [editedMovie, id]);
    res.json({ message: { content: 'Pelicula actualizada exitosamente', type: "success" } });
});

router.delete('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const [deletedRow] = await database.query('SELECT * FROM movies WHERE id = ?', [id]);
    if (deletedRow.imagePath) {
        unlink(path.resolve('./src/public' + deletedRow.imagePath));  // Delete file stored on server    
    }
    const status = await database.query('DELETE FROM movies WHERE id = ?', [id]);
    res.json({ message: { content: 'Pelicula eliminada exitosamente', type: "success" } });
});

module.exports = router;
//books routes
const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* Helper function to cut down on code for each route to handle async requests.*/
function asyncHelper(callback){
    return async(req, res, next) => {
        try {
            await callback(req, res, next)
        } catch(error){
            res.status(500).send(error);
        }
    }
}

//get all books
router.get('/', asyncHelper(async (req, res) => {
    const books = await Book.findAll({ order: [[ "title", "ASC" ]]});
    res.render('index', { books });
}));

//get new book form /books/new
router.get('/new', asyncHelper(async (req, res) => {
    res.render('new-book', { book: {} });
}));

//post a new book to the db /books/new on form submission
router.post('/new', asyncHelper(async (req, res) => {
    //putting what we fill out in the new book form into the db
    const book = await Book.create(req.body);
    console.log(req.body);
    res.redirect('/books/' + book.id);
}));

//get show indv book detail /books/:id
router.get('/:id', asyncHelper(async (req, res) => {
    //getting and showing a specific article depending on the id in the url
    const book = await Book.findByPk(req.params.id);
    res.render('update-book', { book });
}));

//post update book info in db /books/:id
router.post('/:id', asyncHelper(async(req, res) => {
    //finds the specific book in the db and updates the info changed in the form
    const book = await Book.findByPk(req.params.id);
    await book.update(req.body);
    res.redirect('/books/' + book.id);
}));

//get - takes you to the confirm deletion page
router.get('/:id/delete', asyncHelper(async(req,res) => {
    const book = await Book.findByPk(req.params.id);
    res.render('delete', { book });
}));

//post - deletes a book /books/:id/delete
router.post('/:id/delete', asyncHelper(async(req, res) => {
    //removing specific book from the db.
    const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect('/books');
}));


module.exports = router;
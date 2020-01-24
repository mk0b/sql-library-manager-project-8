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
    console.log(books);
    res.render('index', { books });
    //TODO: Setup pug files so these can be tested properly. Use the HTML Pug Converter
}));

//get new book form /books/new
router.get('/new', asyncHelper(async (req, res) => {
    res.render('new-book', { book:  {} });
}));

//post a new book to the db /books/new on form submission
router.post('/', asyncHelper(async (req, res) => {
    //putting what we fill out in the new book form into the db
    const book = await Book.create(req.body);
    console.log(book);
    res.redirect('/books/' + book.id);
}));

//get show indv book detail /books/:id
router.get('/:id', asyncHelper(async (req, res) => {
    //getting and showing a specific article depending on the id in the url
    const book = await Book.findByPk(req.params.id);
    res.render('book-detail', { book });
}));

//post update book info in db /books/:id

//post - deletes a book /books/:id/delete TODO: create a test to test deleting books.

module.exports = router;
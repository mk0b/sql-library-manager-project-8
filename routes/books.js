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
    //TODO: Alphabetical order by title.
    const books = await Book.findAll({ order: [[ "title", "ASC"]]});
    res.render('index', { books, pageTitle: "Books" });
    //TODO: make the title dynamic
    //TODO: Setup pug files so these can be tested properly. Use the HTML Pug Converter
}));

//get new book form /books/new

//post a new book to the db /books/new on form submission

//get show idv book detail /books/:id

//post update book info in db /books/:id

//post - deletes a book /books/:id/delete TODO: create a test to test deleting books.
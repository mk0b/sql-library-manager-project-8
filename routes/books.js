//books routes
const express = require('express');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
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

/* Book Routes */

//get all books
router.get('/', asyncHelper(async (req, res) => {
    //get the page num in the url if no page num yet set to 0
    const page = req.query.page || 0;
    const recordsPerPage = 10;
    //calc offset
    const offset = page * recordsPerPage;
    //set limit
    const limit = recordsPerPage;

    //get the count of books for the pag link equation
    //get the list of books ordered by title alphabetically
    const books = await Book.findAndCountAll({
        order: [[ "title", "ASC"]],
        limit: limit,
        offset: offset
    });
    
    //getting the num of pages for pagination
    const numOfPages = Math.ceil(books.count / recordsPerPage)

    //creates an array to iterate through in pug for the pag links
    const pagLinkArray = []
    for (let i = 1; i <= numOfPages; i++) {
        pagLinkArray.push(i);
    }

    res.render('index', { books, title: 'All Books', pagLinkArray });
}));

//post search form to search the whole db.
router.post('/', asyncHelper(async(req, res) => {
    //capture the search form content
    const search = req.body;
    
    //Have to use findAndCountAll so that the pagination works with search as well
    //and doesn't break the home page. 
    //using Op to use like search for each column
    const books = await Book.findAndCountAll({ where: {
        [Op.or]: 
            [
                {
                    title: {
                        [Op.like]: `%${search.searchtext.toLowerCase()}%`
                    }
                },
                {
                    author: {
                        [Op.like]: `%${search.searchtext.toLowerCase()}%`
                    }
                },
                {
                    genre: {
                        [Op.like]: `%${search.searchtext.toLowerCase()}%`
                    }
                },
                {
                    year: {
                        [Op.like]: `%${search.searchtext.toLowerCase()}%`
                    }
                }
            ]    
    } });

    const recordsPerPage = 10;
    //getting the num of pages for pagination
    const numOfPages = Math.ceil(books.count / recordsPerPage)

    //creates an array to iterate through in pug for the pag links
    const pagLinkArray = []
    for (let i = 1; i <= numOfPages; i++) {
        pagLinkArray.push(i);
    }

    res.render('index', { books, title: 'All Books', pagLinkArray } );
}));

//get new book form /books/new
router.get('/new', asyncHelper(async (req, res) => {
    res.render('new-book', { book: {}, title: 'New Book' });
}));

//post a new book to the db /books/new on form submission
router.post('/new', asyncHelper(async (req, res) => {
    let book;
    try {
        //putting what we fill out in the new book form into the db
        book = await Book.create(req.body);
        res.redirect('/books/' + book.id);
    } catch (error) {
        //error handling so if it's a sequelize error we can show the sequel validations
        if (error.name === "SequelizeValidationError") {
            book = await Book.build();
            res.render('new-book', { book, errors:  error.errors, title: 'New Book'} );
        } else {
            throw error;
        }
    }
}));

//get show indv book detail /books/:id
router.get('/:id', asyncHelper(async (req, res) => {
    //getting and showing a specific article depending on the id in the url
    const book = await Book.findByPk(req.params.id);
    res.render('update-book', { book, title: 'Update Book' });
}));

//post update book info in db /books/:id
router.post('/:id', asyncHelper(async(req, res) => {
    let book = await Book.findByPk(req.params.id);
    try {
        //finds the specific book in the db and updates the info changed in the form
        await Book.update(
            {
                title: req.body.title,
                author: req.body.author,
                genre: req.body.genre,
                year: req.body.year
            },
            {
                returning: true, where: { id: req.params.id }
            }
        );
        console.log('Book in try catch after update: ', book);
        res.redirect('/books/' + book.id);
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            console.log('Book if error occurs and .buld() is called; ', book);
            res.render('update-book', { book, errors:  error.errors, title: 'New Book'} );
        } else {
            throw error;
        }
    }
}));

//get - takes you to the confirm deletion page
router.get('/:id/delete', asyncHelper(async(req,res) => {
    const book = await Book.findByPk(req.params.id);
    res.render('delete', { book, title: 'Delete Book' });
}));

//post - deletes a book /books/:id/delete
router.post('/:id/delete', asyncHelper(async(req, res) => {
    //removing specific book from the db.
    const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect('/books');
}));


module.exports = router;
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

//TODO: Make a helper function to add it right into my / findAll like the article says
//TODO: For the pagination we need to accept a query param called page

//get all books
router.get('/', asyncHelper(async (req, res) => {
    const page = req.query.page || 0;
    console.log('Page: ', page);
    const recordsPerPage = 10;
    //calc offset
    const offset = page * recordsPerPage;
    console.log('offset: ', offset);
    const limit = recordsPerPage;
    console.log('limit: ', limit);

    //get the count of books to dictate the number of pagination needed
    const books = await Book.findAndCountAll({
        order: [[ "title", "ASC"]],
        limit: limit,
        offset: offset
    });
    console.log('books Count: ', books.count);
    //console.log('Books: ', books);
    
    const numOfPages = Math.ceil(books.count / recordsPerPage)
    console.log('numOfPages: ', numOfPages);

    const pagLinkArray = []
    for (let i = 1; i <= numOfPages; i++) {
        pagLinkArray.push(i);
    }
    //console.log('pagLinkArray: ', pagLinkArray);


    //I need to divide 16 by how ever many records I want to show on the page. 10 probably. 
    //Then make an array of those numbers to use in pug?

    //getting all the books and ordering by title alphabetical
    //const oldBooks = await Book.findAll({ order: [[ "title", "ASC" ]]});
    //console.log('oldBooks: ', oldBooks);

    res.render('index', { books, title: 'All Books', pagLinkArray });
}));

//post search form to search the whole db. //TODO: Decide if this needs it's own page?
router.post('/', asyncHelper(async(req, res) => {
    //capture the search form content
    const search = req.body;
    console.log('Search text: ', search);
    //create books for this page with the search results
    //use the multiple like operator
    const books = await Book.findAll({ where: {
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
    console.log('Books: ', books);
    res.render('index', { books, title: 'All Books' } );
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
        console.log(req.body);
        res.redirect('/books/' + book.id);
    } catch (error) {
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
    let book;
    try {
        //finds the specific book in the db and updates the info changed in the form
        const book = await Book.findByPk(req.params.id);
        await book.update(req.body);
        res.redirect('/books/' + book.id);
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            book = await Book.build();
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
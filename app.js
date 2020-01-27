//main js script for the application
const express = require('express');
const path = require('path');
const sequelize = require('./models').sequelize;
const bookRoutes = require('./routes/books');
const mainRoutes = require('./routes');

//creates express app
const app = express();

//Setting some components of the app to be used.
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.use('/books', bookRoutes);
app.use('/', mainRoutes);

/* Listen on port*/
sequelize.sync().then(() => {
    //setting up dev server
    app.listen(3000, () => {
        console.log('Magic is now happening on localhost:3000.');
    });    
});

//this makes it so that any route that is not defined will pass through a defined error.
app.all('*', (req, res, next) => {
    const err = new Error('Page not found!');
    err.status = 404;
    console.log(`Something went wrong. Status: ${err.status}, Message: ${err.message}, Stack: ${err.stack}`)
    next(err);
});

// error handler
app.use( (err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err.message, err.status);

    // render the error page
    res.status(err.status || 500);
    if (err.status === 404) {
        res.render('page-not-found');
    }
});

//TODO: Clean up pug.
//TODO: Ask for clarification around "global error handling" for a book that doesn't exist.
//TODO: Go for exceeds
//TODO: Add styling to the search bar and move it to the top right of the layout
//TODO: Clean up pagination and move into a helper function?
//TODO: Add a try catch to the search route to put a friendly error message when there are no matching search results.
//TODO: Add a button to the index page to go back to "all books"? Clear Search or something
//TODO: Add create another book button to the update page.
//TODO: Test!
//TODO: Fill out read.me
//TODO: Cleanup tests
//TODO: Clean up comments
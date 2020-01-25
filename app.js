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

//TODO: Clean up pug. Make a form pug to use in new and update.
//TODO: Error handling - Error routes? Seperate routes js file
//TODO: Uninstall body-parser from project.
//TODO: Go for exceeds?
//TODO: Test!
//TODO: Fill out read.me
//TODO: Cleanup tests
//TODO: Clean up comments
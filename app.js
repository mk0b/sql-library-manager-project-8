//main js script for the application
const express = require('express');
const sequelize = require('./models').sequelize;
const bookRoutes = require('./routes/books');
const mainRoutes = require('./routes');


//creates express app
const app = express();

//Setting some components of the app to be used.
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

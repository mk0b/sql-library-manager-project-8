//main js script for the application
const express = require('express');


//creates express app
const app = express();

app.set('view engine', 'pug');

//setting up dev server
app.listen(3000, () => {
    console.log('Magic is now happening on localhost:3000.');
});
const express = require('express');
const router = express.Router();

//root route redirected to /books
router.get('/', (req, res) => {
    res.redirect('/books');
});

module.exports = router;
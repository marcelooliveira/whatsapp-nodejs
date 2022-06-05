var express = require('express');
const { movies } = require("../public/javascripts/movies");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Adding WhatsApp To Your Node.js Projects', movies: movies });
});

module.exports = router;

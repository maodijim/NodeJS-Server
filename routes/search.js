var express = require('express');
var request = require('request');
var router = express.Router();

/* GET Search page. */
router.get('/', function(req, res, next) {
  res.render('search', { title: 'searchPage' });
});

module.exports = router;

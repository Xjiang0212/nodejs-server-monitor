var express = require('express');
var router = express.Router();
var client = require('../utils/client-server')
var clientNew = require('../utils/client-server-new')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/add', function(req, res, next) {
  res.render('page/add-server', { title: 'Express' });
});


/* GET home page. */
router.get('/echart', function(req, res, next) {
  client()
  res.render('page/echart', { title: 'Echart' });
});

/* GET home page. */
router.get('/echart2', function(req, res, next) {
  clientNew()
  res.render('page/echarts_new', { title: 'Echart' });
});


/* GET home page. */
router.get('/edit', function(req, res, next) {
  res.render('page/edit', { title: 'Echart' });
});

module.exports = router;

/* jshint node: true */

var express = require('express');
var path = require('path');
var jade = require('jade');
var logger = require('morgan');

var app = express();

// log events
app.use(logger('dev'));

// configure template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

// routing
app.get('/', function (req, res) {
  res.render('index');
});

app.listen(8080);

/* jshint node: true */

var express = require('express');

var app = express();
app.configure(function () {
  app.use(express.static(__dirname + '/public'));
  app.set('views', __dirname);
});
app.listen(8080);



console.log('Express is go...');

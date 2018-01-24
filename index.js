require('dotenv').config();
var port = process.env.TT_PORT;
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

require('./routes')(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // set up ejs for templating


app.use(require('morgan')());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(express.static(__dirname+'views'));


// static resource
app.use(express.static((process.env.TT_UPLOAD_DEST || 'Image_Uploads') + 'min'));

module.exports = index;

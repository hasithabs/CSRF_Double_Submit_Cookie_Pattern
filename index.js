const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const morgan = require('morgan')

const makeToken = require('./Helpers/Token.js');

const PORT = process.env.PORT || 3000;
const app = express();
app.set('views', path.join(__dirname, '/public'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public/assets'));


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(morgan('dev'));
app.use(cookieParser());

// error handler
app.use(function (err, req, res, next) {
  res.status(500)
  res.send('Something went wrong!')
});

// Views
app.get('/', function(req, res) {
    res.render('views/index', { msg: "", className: "" });
});
app.get('/form', function(req, res) {
    res.render('views/form');
});



app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});


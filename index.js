const express = require('express');
const session = require('express-session')
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

app.use(session({
  name: 'sessionID',
  secret: 'SLIITSSDKt2HA454tYPW',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true }
}))
// Change cookie: { secure: true, httpOnly: true } when deploying to Production environment

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


app.post('/login', function (req, res) {
  if (req.body.username == "ssd" && req.body.password == "ssd123") {
    res.cookie('username', req.body.username);
    res.cookie('CSRF-TOKEN', makeToken(30));
    res.redirect('form');
  } else {
    res.render('views/index', {
      msg: 'Invalid credentials! Please use default username and password.',
      className: 'message-fail'
    });
  }
})

app.post('/formsubmit', function(req, res) {
  if ((!!req.body._csrf.trim()) && req.cookies['CSRF-TOKEN'] == req.body._csrf) {
    res.render('views/message', {
      msgTxt: 'Your contact information has been successfully added!',
      reason: 'CSRF token is valid!',
      className: 'success'
    });
  } else {
    res.render('views/message', {
      msgTxt: 'Your contact information is invalid.',
      reason: 'Valid CSRF token required!',
      className: 'fail'
    });
  }
})


app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});


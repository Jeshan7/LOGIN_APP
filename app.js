const express = require('express'),
      bodyParser = require('body-parser'),
      routes = require('./routes/form'),
      path = require('path'),
      mongoose = require('mongoose'),
      session = require('express-session');

var app = express();

app.use(session({
  secret: 'jeshanKhan',
  resave: true,
  saveUninitialized: false
}));

app.use(function(req, res, next) {
  res.locals.currentUser = req.session.userId;
  next();
})

mongoose.connect("mongodb://localhost/auth");
mongoose.Promise = global.Promise;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use('/',routes);
app.use((err, req, res, next) => {
  console.log(err);
})

app.set('views', path.join(__dirname, 'views'));
app.set('view-engine', 'ejs');

app.listen(3000, () => {
  console.log("Connected ...");
});

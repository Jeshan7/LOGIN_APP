const express = require('express'),
      User = require('../models/user');

var router = express.Router();

router.get('/logout', (req, res, next) => {
  if(req.session){
    req.session.destroy((error) => {
      if(error){
        return next(error);
      } else {
        return res.redirect('/login');
      }
    })
  }
})

router.get('/profile', (req, res, next) => {
  if( !req.session.userId) {
    var err = new Error("Not authorised to visit this page")
    err.status = 403
    return next(err)
  }
  User.findById(req.session.userId)
    .exec((error, user) => {
      if(error){
        return next(error);
      } else {
        return res.render('profile.ejs', {})
      }
    })
})

router.get('/login', (req, res) => {
  res.render('login.ejs', {})
});

router.post('/login', (req, res, next) => {
  if(req.body.email && req.body.password){
    User.authenticate(req.body.email, req.body.password, (error, user) => {
      if(error || !user) {
        var err = new Error("Wrong Email or Password")
        err.status = 401
        return next(err)
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    })
  } else {
    var err = new Error("All fields required")
    err.status = 400;
    return next(err);
  }
});

router.get('/register', (req, res) => {
  res.render('register.ejs', {});
});

router.post('/register', (req, res, next) => {
  if( req.body.email &&
      req.body.name &&
      req.body.password &&
      req.body.repeat_password){

      if(req.body.password !== req.body.repeat_password){
        var err = new Error("Password do not match");
        err.status = 400;
        return next(err);
      }

  User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password},
    function(error, user) {
      if(error){
        return next(error)
      } else {
        req.session.userId = user._id;
        res.redirect('/login')
      }
    });
  } else {
      var err = new Error("All Fields Required")
      err.status = 400;
      return next(err);
    }
 })


module.exports = router;

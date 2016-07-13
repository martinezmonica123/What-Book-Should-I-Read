var mongoose = require('mongoose'), passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

var User = mongoose.model('User');

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
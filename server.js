var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');

const USER = 'admin';
const PASSWORD = 'password1';
var accountBalance = 1000;
var authenticated = false;
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
   secret: 'SESSION_SECRET',
   resave: false,
   saveUninitialized: true,
   cookie: { maxAge: 300000, sameSite: false }
}));

// Auth
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password'
   }, function (user, password, done) {
   if (user === USER && password === PASSWORD) {
      return done (null, { username: user });
   }
   return done (null, false);
}));

passport.serializeUser(function (user, done) {
   return done(null, user);
});
 
passport.deserializeUser(function (user, done) {
   return done(null, user);
});

function isAuthenticated(req, res, next) {
   if (authenticated)
      return next();
   return res.redirect('/login');
}

app.use(function (req, res, next) {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Credentials', false);
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
   res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
   next();
});

app.get('/', isAuthenticated, function (req, res, next) {
   res.sendFile(__dirname + '/index.html');
});

app.get('/login', function (req, res, next) {
   res.sendFile(__dirname + '/login.html');
});

app.post('/login', function (req, res, next) {
   passport.authenticate('local', function (err, user, info) {
      if (err) {
         return res.redirect('/login');
      }

      req.logIn(user, function () {
         authenticated = true;
         return res.redirect('/');
      });
   })(req, res, next);
});

app.get('/logout', isAuthenticated, function (req, res, next) {
   authenticated = false;
   req.logout();
   res.redirect('/login');
});

app.get('/balance', isAuthenticated, function (req, res, next) {
   res.send({ balance: accountBalance });
});

app.post('/transfer', isAuthenticated, function (req, res, next) {
   var amount = parseInt(req.body.amount);
   var user = req.body.user;
   
   if (!user) {
      // Pretend there's real user validation here
      res.status(400).redirect('/');
   }
   if (isNaN(amount) || amount <= 0) {
      res.status(400).redirect('/');
   }
   
   if (amount > accountBalance) {
      res.status(400).redirect('/');
   }

   accountBalance -= amount;
   res.redirect('/');
});

app.listen(process.env.PORT || 3001);
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');

var accountBalance = 1000;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
   res.header('Access-Control-Allow-Origin', '*');
   next();
});

app.get('/', function (req, res, next) {
   res.sendFile(__dirname + '/index.html');
});

app.get('/balance', function (req, res, next) {
   res.send({ balance: accountBalance });
});

app.post('/transfer', function (req, res, next) {
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
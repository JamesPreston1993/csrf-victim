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
      return res.status(400).send('Invalid user');
   }
   if (isNaN(amount)) {
      return res.status(400).send('Invalid amount');
   }
   
   if (amount > accountBalance) {
      return res.status(400).send('Insufficient funds');
   }

   accountBalance -= amount;
   return res.send('Balance updated');
});

app.listen(process.env.PORT || 3001);
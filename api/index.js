var express = require('express')
var app = express()
var T = require('./transactions/transactions')
var getDefaultTransactions = T.getDefaultTransactions
var processUpload = T.processUpload

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-With")
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
})

// app.use('/cdn/', express.static(__dirname + '/../static'))

app.get('/transactions', function (req, res) {
  getDefaultTransactions('', res)
});

app.put('/transactions-upload', function (req, res) {
  processUpload(req, res)
});

app.post('/transactions-upload', function (req, res) {
  processUpload(req, res)
});

app.listen(3600)
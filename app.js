require('dotenv').load();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var WebSocketServer = require("ws").Server;
var btoa = require('btoa');
var https = require('https');

var access_token;
var options = {
  hostname: 'services.rdio.com',
  path: '/oauth2/token',
  method: 'POST',
  auth: process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};
var req = https.request(options, function(res) {
  res.on('data', function(d) {
    var data = JSON.parse(d);
    access_token = data.access_token;
    console.log(access_token);
  });
});
req.write('grant_type=client_credentials');
req.end();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  fs.readFile('index.html', function (err, data) {
    res.end(data);
  });
});

app.get('/rdio.js', function (req, res) {
  fs.readFile('rdio.js', function (err, data) {
    res.end(data);
  });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

var wss = new WebSocketServer({server: server})
console.log("websocket server created")
wss.broadcast = function(data) {
  wss.clients.forEach(function(client) {
    client.send(data);
  });
};

app.post('/', function (req, res) {
  var query = req.body.query;

  var options = {
    hostname: 'services.rdio.com',
    path: '/api/1/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  var req = https.request(options, function(res) {
    var body = '';
    res.on('data', function(d) {
      body = body + d;
    });
    res.on('end', function() {
      console.log(body);
      var data = JSON.parse(body);
      var key = data.result.results[0].key;
      console.log(key);
      wss.broadcast(key);
    });
  });
  req.write('access_token='+access_token+'&method=search&query='+encodeURIComponent(query)+'&types=t');
  req.end();

  res.send('');
});

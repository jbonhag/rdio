require('dotenv').load();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var WebSocketServer = require("ws").Server;
var https = require('https');

var access_token;
var playback_token;
var domain = process.env.DOMAIN || 'localhost';

function getPlaybackToken() {
  var options = {
    hostname: 'services.rdio.com',
    path: '/api/1/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  var req = https.request(options, function(res) {
    res.on('data', function(d) {
      var data = JSON.parse(d);
      playback_token = data.result;
      console.log('playback_token: ' + playback_token);
    });
  });
  req.write('access_token='+access_token+'&method=getPlaybackToken&domain='+domain);
  req.end();
}

function getAccessToken() {
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
      console.log('access_token: ' + access_token);
      getPlaybackToken();
    });
  });
  req.write('grant_type=client_credentials');
  req.end();
}

getAccessToken();

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

app.get('/token.js', function(req, res) {
  res.set('Content-Type', 'text/javascript');
  res.send('var playback_token = "'+playback_token+'";\n' +
           'var domain = "'+domain+'";\n');
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

function playFirstTrack(query) {
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
      if (data.result.results.length > 0) {
        var key = data.result.results[0].key;
        console.log(key);
        wss.broadcast(JSON.stringify({command: 'play', key: key}));
      }
    });
  });
  req.write('access_token='+access_token+'&method=search&query='+encodeURIComponent(query)+'&types=t');
  req.end();
}

app.post('/', function (req, res) {
  var command = req.body.command;

  switch (command) {
    case 'play':
      var query = req.body.query;
      playFirstTrack(query);
      break;
    case 'stop':
      wss.broadcast(JSON.stringify({command: 'stop'}));
      break;
  }

  res.send('ok\n');
});


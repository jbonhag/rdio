var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var WebSocketServer = require("ws").Server;
var https = require('https');
var port = process.env.PORT || 5000;

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
  console.log('getAccessToken');
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

var server = app.listen(port, function () {
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

var search = function(query, callback) {
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
      callback(null, JSON.parse(body));
    });
  });
  req.write('access_token='+access_token+'&method=search&query='+encodeURIComponent(query)+'&types=t');
  req.end();
};

app.post('/', function (req, res) {
  console.log('post', '/');
  var command = req.body.command;
  console.log('command', command);

  switch (command) {
    case 'play':
      var key = req.body.key;
      console.log('key', key);
      wss.broadcast(JSON.stringify({command: 'play', key: key}));
      res.send('ok\n');
      break;
    case 'pause':
      wss.broadcast(JSON.stringify({command: 'pause'}));
      res.send('ok\n');
      break;
    case 'stop':
      wss.broadcast(JSON.stringify({command: 'stop'}));
      res.send('ok\n');
      break;
    case 'next':
      wss.broadcast(JSON.stringify({command: 'next'}));
      res.send('ok\n');
      break;
    case 'previous':
      wss.broadcast(JSON.stringify({command: 'previous'}));
      res.send('ok\n');
      break;
    case 'seek':
      var position = req.body.position;
      console.log('position', position);
      wss.broadcast(JSON.stringify({command: 'seek', position: position}));
      res.send('ok\n');
      break;
    case 'setShuffle':
      var shuffle = req.body.shuffle;
      console.log('shuffle', shuffle);
      wss.broadcast(JSON.stringify({command: 'setShuffle', shuffle: shuffle}));
      res.send('ok\n');
      break;
    case 'setRepeat':
      var mode = req.body.mode;
      console.log('mode', mode);
      wss.broadcast(JSON.stringify({command: 'setRepeat', mode: mode}));
      res.send('ok\n');
      break;
    case 'queue':
      var key = req.body.key;
      console.log('key', key);
      wss.broadcast(JSON.stringify({command: 'queue', key: key}));
      res.send('ok\n');
      break;
    case 'setVolume':
      var volume = req.body.volume;
      console.log('volume', volume);
      wss.broadcast(JSON.stringify({command: 'setVolume', volume: volume}));
      res.send('ok\n');
      break;
    case 'setMute':
      var mute = req.body.mute;
      console.log('mute', mute);
      wss.broadcast(JSON.stringify({command: 'setMute', mute: mute}));
      res.send('ok\n');
      break;
    case 'playQueuedTrack':
      var position = req.body.position;
      var offset = req.body.offset;
      console.log('position', position);
      console.log('offset', offset);
      wss.broadcast(JSON.stringify({command: 'playQueuedTrack', position: position, offset: offset}));
      res.send('ok\n');
      break;
    case 'moveQueuedSource':
      var from = req.body.from;
      var to = req.body.to;
      console.log('from', from);
      console.log('to', to);
      wss.broadcast(JSON.stringify({command: 'moveQueuedSource', from: from, to: to}));
      res.send('ok\n');
      break;
    case 'clearQueue':
      wss.broadcast(JSON.stringify({command: 'clearQueue'}));
      res.send('ok\n');
      break;
    case 'setCurrentPosition':
      var sourceIndex = req.body.sourceIndex;
      console.log('sourceIndex', sourceIndex);
      wss.broadcast(JSON.stringify({command: 'setCurrentPosition', sourceIndex: sourceIndex}));
      res.send('ok\n');
      break;
    case 'removeFromQueue':
      var sourceIndex = req.body.sourceIndex;
      console.log('sourceIndex', sourceIndex);
      wss.broadcast(JSON.stringify({command: 'removeFromQueue', sourceIndex: sourceIndex}));
      res.send('ok\n');
      break;
    case 'sendState':
      wss.broadcast(JSON.stringify({command: 'sendState'}));
      res.send('ok\n');
      break;
    case 'startFrequencyAnalyzer':
      var period = req.body.period;
      var frequencies = req.body.frequencies;
      console.log('period', period);
      console.log('frequencies', frequencies);
      var options = {period: period, frequencies: frequencies};
      wss.broadcast(JSON.stringify({command: 'startFrequencyAnalyzer', options: options}));
      res.send('ok\n');
      break;
    case 'stopFrequencyAnalyzer':
      wss.broadcast(JSON.stringify({command: 'stopFrequencyAnalyzer'}));
      res.send('ok\n');
      break;
    case 'search':
      var query = req.body.query;
      console.log('query', query);
      search(query, function(err, result) {
        res.send(result);
      });
      break;
  }
});


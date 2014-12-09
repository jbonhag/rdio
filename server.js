var server = require('webserver').create();
var system = require('system');
var page = require('webpage').create();
var fs = require('fs');

// Note: if we run into function name collisions, you can call these rdio_x
var play = function(key) {
  apiswf.rdio_play(key);
};

var pause = function() {
  apiswf.rdio_pause();
};

var stop = function() {
  apiswf.rdio_stop();
};

var get = function(request, response) {
  if (request.url === '/') {
    var responseText = fs.read('index.html');

    response.headers = {
      'Content-Type': 'text/html;charset=UTF-8',
      'Content-Length': responseText.length
    };

    response.write(responseText);
    response.close();
  }

  if (request.url === '/pause') {
    page.evaluate(pause);

    response.headers = {
      'Content-Type': 'text/plain',
      'Content-Length': 2
    };

    response.statusCode = 200;
    response.write('OK');
    response.close();
  }

  if (request.url === '/stop') {
    page.evaluate(stop);

    response.headers = {
      'Content-Type': 'text/plain',
      'Content-Length': 2
    };

    response.statusCode = 200;
    response.write('OK');
    response.close();
    slimer.exit();
  }
}

server.listen(8083, function(request, response) {
  if (request.method === 'GET') {
    get(request, response);
  }

  if (request.method === 'POST' && request.url === '/play') {
    page.evaluate(play, request.post.key);
    
    response.headers = {
      'Content-Type': 'text/plain',
      'Content-Length': 2
    };

    response.statusCode = 200;
    response.write('OK');
    response.close();
  }
});

page.open('http://localhost:8083');


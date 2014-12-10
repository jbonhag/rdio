var server = require('webserver').create();
var system = require('system');
var page = require('webpage').create();
var fs = require('fs');

var init = function(playbackToken) {
    var playback_token = "GAlNi78J_____zlyYWs5ZG02N2pkaHlhcWsyOWJtYjkyN2xvY2FsaG9zdEbwl7EHvbylWSWFWYMZwfc=";
    var domain = "localhost";
    // a global variable that will hold a reference to the api swf once it has loaded
    var apiswf = null;

    // on page load use SWFObject to load the API swf into div#apiswf
    var flashvars = {
        'playbackToken': playback_token, // from token.js
        'domain': domain, // from token.js
        'listener': 'callback_object' // the global name of the object that will receive callbacks from the SWF
    };
    var params = {
        'allowScriptAccess': 'always'
    };
    var attributes = {};
    swfobject.embedSWF('http://www.rdio.com/api/swf/', // the location of the Rdio Playback API SWF
        'apiswf', // the ID of the element that will be replaced with the SWF
        1, 1, '9.0.0', 'expressInstall.swf', flashvars, params, attributes);

    // the global callback object
    var callback_object = {};

    callback_object.ready = function ready(user) {
        apiswf = document.getElementById('apiswf');
    };
}

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

    if (request.method === 'POST') {
        if (request.url === '/play') {
            page.evaluate(play, request.post.key);

            response.headers = {
                'Content-Type': 'text/plain',
                'Content-Length': 2
            };

            response.statusCode = 200;
            response.write('OK');
            response.close();
        }

        if (request.url === '/init') {
            page.evaluate(init, request.post.playbackToken);

            response.headers = {
                'Content-Type': 'text/plain',
                'Content-Length': 2
            };

            response.statusCode = 200;
            response.write('OK');
            response.close();
        }
    }
});

page.open('http://localhost:8083');
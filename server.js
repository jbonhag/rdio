var fs = require('fs');
var server = require("webserver").create();
var page = require('webpage').create();

server.registerFile('/index.html', fs.workingDirectory + '/index.html');
server.registerFile('/rdio.js', fs.workingDirectory + '/rdio.js');

server.listen(8083, function(request, response) {
  if (request.method === 'POST') {
    page.evaluate(function(key) {
      document.getElementById('apiswf').rdio_play(key);
    }, 't2996238');
    response.setHeader('Content-Type', 'text/plain');
    response.write('OK');
    response.close()
  }
});

console.log('server done');


page.viewportSize = { width: 1, height: 1 };

page.open('http://localhost:8083/index.html', function (status) {
  if (status == "success") {
    console.log("The title of the page is: "+ page.title);
  }
  else {
    console.log("Sorry, the page is not loaded");
  }
});

console.log('page done');

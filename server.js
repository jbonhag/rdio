var fs = require('fs');
var server = require("webserver").create();
var page = require('webpage').create();
var ENV = require('system').env;


var accessToken = "";

var xhr = require('webpage').create();

var authorization = 'Basic ' + btoa(ENV['CLIENT_ID'] + ':' + ENV['CLIENT_SECRET']);
console.log(authorization);

var httpConf = {
  operation: 'post',
  data: "grant_type=client_credentials",
  headers: {
    'Authorization': authorization,
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

xhr.open('https://services.rdio.com/oauth2/token', httpConf).then(function(status) {
  console.log(status);
  var resp = JSON.parse(xhr.plainText);
  accessToken = resp.access_token;
  console.log('got access token: ' + accessToken);
  xhr.close();
});

function play(token, query) {
  var xhr = require('webpage').create();

  var httpConf = {
    operation: 'post',
    data: 'access_token='+token+'&method=search&query='+encodeURIComponent(query)+'&types=t',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  xhr.open('https://services.rdio.com/api/1/', httpConf)
     .then(function(status) {
      var resp = JSON.parse(xhr.plainText);
      xhr.close();

      console.log(status);
      var key = resp.result.results[0].key;
      console.log(key);
      page.evaluate(function(key) {
        return apiswf.rdio_play(key);
      }, key);
  });
}

server.registerFile('/index.html', fs.workingDirectory + '/index.html');
server.registerFile('/rdio.js', fs.workingDirectory + '/rdio.js');

server.listen(8083, function(request, response) {
  if (request.method === 'POST') {
    play(accessToken, request.post.query);
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

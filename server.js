var fs = require('fs');
var system = require('system');

var filePath = [fs.workingDirectory, 'index.html'].join(fs.separator);

var webserverTest = require("webserver").create();
webserverTest.listen(8083, function(request, response) {
  webserverTest.registerFile('/', filePath);
});

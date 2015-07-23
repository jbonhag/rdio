var fs = require('fs');

var filePath = [fs.workingDirectory, 'index.html'].join(fs.separator);

var server = require("webserver").create();
server.listen(8083, function(request, response) {
  server.registerFile('/', filePath);
});

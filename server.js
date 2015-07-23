var webserverTest = require("webserver").create();
webserverTest.listen(8083, function(request, response) {
  if (request.url == '/hello.html') {
    response.statusCode = 200;
    response.write('<!DOCTYPE html>\n<html><head><meta charset="utf-8"><title>hello world</title></head><body>Hello!</body></html>');
    response.close();
  }
});

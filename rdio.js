var apiswf = null;
var callbacks = {};

callbacks.ready = function() {
  apiswf = document.getElementById('apiswf');
  console.log('now we can dance');
};

function ready() {
  var flashvars = {
    'playbackToken': "GAlNi78J_____zlyYWs5ZG02N2pkaHlhcWsyOWJtYjkyN2xvY2FsaG9zdEbwl7EHvbylWSWFWYMZwfc=",
    'domain': 'localhost',
    'listener': 'callbacks'
  };

  var params = {
    'allowScriptAccess': 'always'
  };

  var attributes = {};

  swfobject.embedSWF('http://www.rdio.com/api/swf',
                     'apiswf',
                     1,
                     1,
                     '9.0.0',
                     'expressInstall.swf',
                     flashvars,
                     params,
                     attributes);
};

// not even prerequisites?
var script = document.createElement('script');
script.src = "https://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js";
script.addEventListener('load', ready);
document.body.appendChild(script);

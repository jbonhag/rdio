var apiswf = null;
var callbacks = {};

callbacks.ready = function() {
  apiswf = document.getElementById('apiswf');
};

callbacks.playingTrackChanged = function(track) {
  document.body.style.backgroundImage = "url(" + track.bigIcon1200 + ")";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundX = "center";
  document.body.style.backgroundSize = "cover";
}

function ready() {
  var flashvars = {
    'playbackToken': playback_token,
    'domain': domain,
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

var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host);
ws.onmessage = function (event) {
  var data = JSON.parse(event.data);

  switch (data.command) {
    case 'play':
      apiswf.rdio_play(data.key);
      break;
    case 'stop':
      apiswf.rdio_stop();
      break;
  }
};

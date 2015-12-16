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
      if (data.key !== undefined) {
        apiswf.rdio_play(data.key);
      } else {
        apiswf.rdio_play();
      }
      break;
    case 'pause':
      apiswf.rdio_pause();
      break;
    case 'stop':
      apiswf.rdio_stop();
      break;
    case 'next':
      apiswf.rdio_next();
      break;
    case 'previous':
      apiswf.rdio_previous();
      break;
    case 'seek':
      apiswf.rdio_seek(data.position);
      break;
    case 'setShuffle':
      apiswf.rdio_setShuffle(data.shuffle);
      break;
    case 'setRepeat':
      apiswf.rdio_setRepeat(data.mode);
      break;
    case 'queue':
      apiswf.rdio_queue(data.key);
      break;
    case 'setVolume':
      apiswf.rdio_setVolume(data.volume);
      break;
    case 'setMute':
      apiswf.rdio_setMute(data.mute);
      break;
    case 'playQueuedTrack':
      apiswf.rdio_playQueuedTrack(data.position, data.offset);
      break;
    case 'moveQueuedSource':
      apiswf.rdio_moveQueuedSource(data.from, data.to);
      break;
    case 'clearQueue':
      apiswf.rdio_clearQueue();
      break;
    case 'setCurrentPosition':
      apiswf.rdio_setCurrentPosition(data.sourceIndex);
      break;
    case 'removeFromQueue':
      apiswf.rdio_removeFromQueue(data.sourceIndex);
      break;
    case 'sendState':
      apiswf.rdio_sendState();
      break;
    case 'startFrequencyAnalyzer':
      apiswf.rdio_startFrequencyAnalyzer(data.options);
      break;
    case 'stopFrequencyAnalyzer':
      apiswf.rdio_stopFrequencyAnalyzer();
      break;
  }
};

function search(query) {
  var request = new XMLHttpRequest();
  request.open("POST", "/search");
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send("query="+encodeURIComponent(query));
  return request;
}

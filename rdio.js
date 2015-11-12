var apiswf = null;

var callbacks = {};

callbacks.ready = function() {
  // find the embed/object element
  apiswf = document.getElementById('apiswf');
  console.log(apiswf);
  console.log('now we can dance');
  apiswf.rdio_play('t2996238');
};

function ready() {
  console.log(swfobject);
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

var playStates = [
  "paused",
  "playing",
  "stopped",
  "buffering",
  "paused"
];

callbacks.playStateChanged = function(playState) {
  console.log('playStateChanged → ' + playStates[playState]);
};

callbacks.playingTrackChanged = function(playingTrack, sourcePosition) {
  document.body.style.backgroundImage = "url(" + playingTrack.bigIcon1200 + ")";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundX = "center";
  console.log(sourcePosition);
};

callbacks.playingSourceChanged = function(playingSource) {
  console.log(playingSource);
};

callbacks.volumeChanged = function(volume) {
  console.log('volumeChanged → ' + volume);
};

callbacks.muteChanged = function(mute) {
  console.log('muteChanged → muting ' (mute ? 'enabled' : 'disabled'));
};

callbacks.positionChanged = function(position) {
  console.log('positionChanged → ' + position);
};

callbacks.queueChanged = function(newQueue) {
  console.log(newQueue);
};

callbacks.shuffleChanged = function(shuffle) {
  console.log(shuffle);
};

callbacks.repeatChanged = function(repeat) {
  console.log(repeat);
};

callbacks.updateFrequencyData = function(frequencyData) {
  console.log(frequencyData);
};

callbacks.playingSomewhereElse = function() {};

callbacks.freeRemainingChanged = function(freeRemaining) {
  console.log(freeRemaining);
};

var play = function(title, artist) {
  var data = {
    api_key: "G9NEVKUK91NLLSSAH",
    results: 1,
    title: title,
    artist: artist
  }

  $.getJSON("http://developer.echonest.com/api/v4/song/search?bucket=id:rdio-US&bucket=tracks", data, function(response) {
    var key = response.response.songs[0].tracks[0].foreign_id.replace("rdio-US:track:", "");
    apiswf.rdio_play(key);
  });
}

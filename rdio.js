var apiswf = null;

var callback_object = {};

callback_object.ready = function(userInfo) {
  // find the embed/object element
  apiswf = document.getElementById('apiswf');
};

// not even prerequisites?
var script = document.createElement('script');
script.src = "https://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js";
script.addEventListener('load', function() {
  console.log(swfobject);
  var flashvars = {
    'playbackToken': "GAlNi78J_____zlyYWs5ZG02N2pkaHlhcWsyOWJtYjkyN2xvY2FsaG9zdEbwl7EHvbylWSWFWYMZwfc=",
    'domain': 'localhost',
    'listener': 'callback_object'
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
});

document.body.appendChild(script);

var playStates = [
  "paused",
  "playing",
  "stopped",
  "buffering",
  "paused"
];

callback_object.playStateChanged = function(playState) {
  console.log('playStateChanged → ' + playStates[playState]);
};

callback_object.playingTrackChanged = function(playingTrack, sourcePosition) {
  document.body.style.backgroundImage = "url(" + playingTrack.bigIcon1200 + ")";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundX = "center";
  console.log(sourcePosition);
};

callback_object.playingSourceChanged = function(playingSource) {
  console.log(playingSource);
};

callback_object.volumeChanged = function(volume) {
  console.log('volumeChanged → ' + volume);
};

callback_object.muteChanged = function(mute) {
  console.log('muteChanged → muting ' (mute ? 'enabled' : 'disabled'));
};

callback_object.positionChanged = function(position) {
  console.log('positionChanged → ' + position);
};

callback_object.queueChanged = function(newQueue) {
  console.log(newQueue);
};

callback_object.shuffleChanged = function(shuffle) {
  console.log(shuffle);
};

callback_object.repeatChanged = function(repeat) {
  console.log(repeat);
};

callback_object.updateFrequencyData = function(frequencyData) {
  console.log(frequencyData);
};

callback_object.playingSomewhereElse = function() {};

callback_object.freeRemainingChanged = function(freeRemaining) {
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

var playback_token = "GAlNi78J_____zlyYWs5ZG02N2pkaHlhcWsyOWJtYjkyN2xvY2FsaG9zdEbwl7EHvbylWSWFWYMZwfc=";
var domain = "localhost";

var apiswf = null;

$(document).ready(function() {
  var flashvars = {
    'playbackToken': playback_token, // from token.js
    'domain': domain,                // from token.js
    'listener': 'callback_object'    // the global name of the object that will receive callbacks from the SWF
  };
  var params = {
    'allowScriptAccess': 'always'
  };
  var attributes = {};
  swfobject.embedSWF('http://www.rdio.com/api/swf/', // the location of the Rdio Playback API SWF
  'apiswf', // the ID of the element that will be replaced with the SWF
  1, 1, '9.0.0', 'expressInstall.swf', flashvars, params, attributes);

  $('[name="key"]').keyup(function(e) {
    if (e.keyCode == 13) {
      var key = $('[name="key"]').val();
      apiswf.rdio_play(key);
    }
  });
});



var callback_object = {};

callback_object.ready = function(userInfo) {
  console.log(userInfo);

  // find the embed/object element
  apiswf = document.getElementById('apiswf');
};

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

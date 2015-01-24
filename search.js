var OAuth = require('oauth');
var dotenv = require('dotenv');
dotenv.load();

var oauth = new OAuth.OAuth(
    'http://api.rdio.com/oauth/request_token',
    'http://api.rdio.com/oauth/access_token',
    process.env.RDIO_CONSUMER_KEY,
    process.env.RDIO_CONSUMER_SECRET,
    '1',
    null,
    'HMAC-SHA1'
);

oauth.post('http://api.rdio.com/1/',
    process.env.RDIO_TOKEN,
    process.env.RDIO_TOKEN_SECRET,
    {"method":"search", "query":"blake mills", "types":"track"},
    function (e, data, res) {
      if (e) console.error(e);
      console.log(data);
    }
);


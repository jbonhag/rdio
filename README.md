Now with WebSockets!!!

## Server

Put the `CLIENT_ID` and `CLIENT_SECRET` for Rdio in a `.env` file.  We can keep
it kind of simple because the application doesn't require user authentication
-- just an access token.  When the server starts it will automatically fetch an
access token.

Start the server with `node app.js`.  Then go to [http://localhost:3000] in
your web browser.  You use web browsers, right?

## Client

    source rdio
    play "sail to the moon"

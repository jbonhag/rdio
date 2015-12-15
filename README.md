Now with DOCKER(tm)!!!

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

## Container

    docker build -t rdio .
    docker run --env CLIENT_ID=abcd --env CLIENT_SECRET=efgh -i -t --rm -p 5000:5000 rdio

If you're running Docker on Windows or OS X, you'll have to specify the IP
address of the boot2docker or docker-machine instance.

    docker run --env CLIENT_ID=abcd --env CLIENT_SECRET=efgh --env DOMAIN=192.168.99.100 -i -t --rm -p 5000:5000 rdio

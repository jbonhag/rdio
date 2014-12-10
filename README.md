Thanks to the magic of Xvfb, we can run this in a terminal:

    Xvfb :1 &
    DISPLAY=:1 ./slimer -P default server.js &
    . client
    play t1241424

> http://docs.slimerjs.org/current/configuration.html#profiles

Rdio determines whether you can hear full or partial songs via a cookie.
You can create a slimer.js profile, but I just copied my default Firefox
profile directory over to slimer.js:

    cp -r ~/.mozilla/firefox/ ~/.innophi/slimerjs

It would probably be smarter to duplicate the profile and delete all but
the Rdio cookie, or extract the cookie, or load the cookie manually...

Anyways, the `-P default` argument specifies which profile to load.


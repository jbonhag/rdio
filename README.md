# OS X:

1. Install Firefox 41.0
2. git submodule foreach git pull origin master
3. `export SLIMERJSLAUNCHER=/Applications/Firefox.app/Contents/MacOS/firefox`

# Linux

Thanks to the magic of Xvfb, we can run this in a terminal:

    Xvfb :1 &
    DISPLAY=:1 ./slimer -P default server.js &
    . client
    init
    play "sail to the moon"

> http://docs.slimerjs.org/current/configuration.html#profiles

Rdio determines whether you can hear full or partial songs via a cookie.
You can create a slimer.js profile, but I just copied my default Firefox
profile directory over to slimer.js:

    cp -r ~/.mozilla/firefox/ ~/.innophi/slimerjs

It would probably be smarter to duplicate the profile and delete all but
the Rdio cookie, or extract the cookie, or load the cookie manually...

Anyways, the `-P default` argument specifies which profile to load.

You can also point it to your existing Firefox profile, but this will
lock the profile so you won't be able to launch Firefox.

    slimerjs.bat -profile %APPDATA%\Mozilla\Firefox\Profiles\5zkt9prg.default server.js

On OS X, your profile will be somewhere like:

    ~/Library/Application\ Support/Firefox/Profiles/k1cel1bq.default

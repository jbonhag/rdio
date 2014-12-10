Thanks to the magic of Xvfb, we can run this in a terminal:

    Xvfb :1 &
    DISPLAY=:1 ./slimer server.js &
    . client
    play t1241424


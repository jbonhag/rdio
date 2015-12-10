@ECHO OFF
SET URL=http://localhost:5000

REM Remove quotes from argument
SET QUERY=%~2

IF %1==play curl %URL% --data "command=play&key=%2&initialPosition=%3"
IF %1==pause curl %URL% --data "command=pause"
IF %1==stop curl %URL% --data "command=stop"
IF %1==next curl %URL% --data "command=next"
IF %1==previous curl %URL% --data "command=previous"
IF %1==seek curl %URL% --data "command=seek&position=%2"
IF %1==setShuffle curl %URL% --data "command=setShuffle&shuffle=%2"
IF %1==setRepeat curl %URL% --data "command=setRepeat&repeat=%2"
IF %1==queue curl %URL% --data "command=queue&key=%2"
IF %1==setVolume curl %URL% --data "command=setVolume&volume=%2"
IF %1==setMute curl %URL% --data "command=setMute&mute=%2"
IF %1==playQueuedTrack curl %URL% --data "command=playQueuedTrack&position=%2&offset=%3"
IF %1==moveQueuedSource curl %URL% --data "command=moveQueuedSource&from=%2&to=%3"
IF %1==clearQueue curl %URL% --data "command=clearQueue"
IF %1==setCurrentPosition curl %URL% --data "command=setCurrentPosition&sourceIndex=%2"
IF %1==removeFromQueue curl %URL% --data "command=removeFromQueue&sourceIndex=%2"
IF %1==sendState curl %URL% --data "command=sendState"
IF %1==startFrequencyAnalyzer curl %URL% --data "command=startFrequencyAnalyzer&period=%2&frequencies=%3"
IF %1==stopFrequencyAnalyzer curl %URL% --data "command=stopFrequencyAnalyzer"
IF %1==search curl %URL%/search --data "query=%QUERY%"

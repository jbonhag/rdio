require 'grooveshark'
client = Grooveshark::Client.new

songs = client.search_songs('107 steps')
url = client.get_song_url(songs.first)
system("curl -q \"#{url}\"")

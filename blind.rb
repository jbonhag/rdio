require 'grooveshark'
client = Grooveshark::Client.new

songs = client.search_songs('dancer in the dark')
url = client.get_song_url(songs.first)
puts url
system("curl -q #{url}")

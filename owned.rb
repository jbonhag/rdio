$LOAD_PATH << '.'
require 'rdio'
require 'dotenv'

Dotenv.load

rdio = Rdio.new([ENV['RDIO_CONSUMER_KEY'], ENV['RDIO_CONSUMER_SECRET']])

url = rdio.begin_authentication('oob')
system("xdg-open \"#{url}\"")
print 'Enter code: '
verifier = gets.strip
rdio.complete_authentication(verifier)

playlists = rdio.call('getPlaylists')['result']['owned']

playlists.each do |playlist|
  puts "%s\t%s" % [playlist['shortUrl'], playlist['name']]
end

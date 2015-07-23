$LOAD_PATH << '.'
require 'rdio'

rdio.token = [ENV['RDIO_TOKEN'], ENV['RDIO_TOKEN_SECRET']]

if rdio.token == [nil, nil]
  rdio.token = nil
  url = rdio.begin_authentication('oob')
  system("xdg-open \"#{url}\"")
  print 'Enter code: '
  verifier = gets.strip
  rdio.complete_authentication(verifier)

  File.open('.env', 'a') do |f|
    f << "RDIO_TOKEN=#{rdio.token[0]}\n"
    f << "RDIO_TOKEN_SECRET=#{rdio.token[1]}\n"
  end
end

query = ARGV[0]
tracks = rdio.call('search', {"query" => query,
                              "types" => "Track",
                              "limit" => 9})['result']['results']
tracks.each_with_index do |track, i|
  puts "#{1+i} #{track['key']} #{track['artist']} - #{track['name']}"
end

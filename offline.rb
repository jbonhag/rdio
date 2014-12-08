$LOAD_PATH << '.'
require 'rdio'
require 'dotenv'

def number_of_tracks_by_artist(collection, artist)
  collection.select {|t| t["artist"] == artist }.length
end

def do_not_download_overrepresented_artists(rdio)
  offline_tracks = rdio.call('getOfflineTracks', {"count" => 200})['result']

  # nice suggestion from jmonteiro on Stack overflow
  overrepresented_artist_tracks = offline_tracks.select do |track| 
    number_of_tracks_by_artist(offline_tracks, track["artist"]) > 1
  end

  do_not_download = overrepresented_artist_tracks.collect { |t| t["key"] }

  if do_not_download.length > 0
    puts "Putting the following artists on hold:"
    do_not_download.collect {|t| t["artist"]}.uniq.each do |artist|
      puts artist
    end
  end

  rdio.call('setAvailableOffline', {"keys" => do_not_download.join(','), "offline" => false})
end

Dotenv.load

rdio = Rdio.new([ENV['RDIO_CONSUMER_KEY'], ENV['RDIO_CONSUMER_SECRET']])

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

do_not_download_overrepresented_artists(rdio)

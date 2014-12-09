$LOAD_PATH << '.'
require 'rdio'
require 'dotenv'

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

puts rdio.call('getPlaybackToken')['result']


require 'sinatra'
require 'dotenv'

Dotenv.load

get '/' do
  client_id = ENV['RDIO_CLIENT_KEY']
  authorization_url = "https://www.rdio.com/oauth2/authorize?response_type=token&redirect_uri=http%3A%2F%2Flocalhost:4567%2Foauth&client_id=#{client_id}"
  redirect authorization_url
end

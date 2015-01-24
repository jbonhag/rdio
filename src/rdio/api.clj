(ns rdio.api
  (:require [clj-http.client :as http]
            [environ.core :refer [env]]
            [oauth.client :as oauth]
            [clojure.java.browse :refer :all]))

(def rdio-consumer-key
  (env :rdio-consumer-key))

(def rdio-consumer-secret
  (env :rdio-consumer-secret))

(def rdio-token
  (env :rdio-token))

(def rdio-token-secret
  (env :rdio-token-secret))

(def consumer (oauth/make-consumer rdio-consumer-key
                                   rdio-consumer-secret
                                   "http://api.rdio.com/oauth/request_token"
                                   "http://api.rdio.com/oauth/access_token"
                                   "https://www.rdio.com/account/oauth1/authorize/"
                                   :hmac-sha1))


(ns rdio.core
  (:require [rdio.api :as api]
            [ring.adapter.jetty :refer :all]
            [ring.middleware.params :refer :all]
            [ring.middleware.reload :refer :all]
            [ring.middleware.resource :refer :all]))

(defn play [{params :form-params}]
  (def query (params "query"))

  {:status 200
   :headers {"Content-Type" "text/plain"}
   :body (api/search query)})

(def app
  (-> #'play 
    (wrap-reload '(rdio.core))
    (wrap-resource "public")))

(defn boot []
  (run-jetty (wrap-params #'app) {:port 3000}))


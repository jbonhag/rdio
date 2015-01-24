(ns rdio.core
  (:require
            [ring.adapter.jetty :refer :all]
            [ring.middleware.params :refer :all]
            [ring.middleware.reload :refer :all]
            [ring.middleware.resource :refer :all]))

(defn play [{params :form-params}]
  {:status 200
   :headers {"Content-Type" "text/plain"}
   :body (params "query")})

(def app
  (-> #'play 
    (wrap-reload '(rdio.core))
    (wrap-resource "public")))

(defn boot []
  (run-jetty (wrap-params #'app) {:port 3000}))


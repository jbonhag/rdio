(ns rdio.core
  (:use ring.adapter.jetty
        ring.middleware.params
        ring.middleware.reload
        ring.middleware.resource))

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


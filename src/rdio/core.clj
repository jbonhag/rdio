(ns rdio.core
  (:require [ring.adapter.jetty :refer [run-jetty]])
  (:require [ring.middleware.resource :refer [wrap-resource]]))

(defn handler [request]
  {:status 404 
   :headers {"Content-Type" "text/plain"}
   :body "404 Not Found"})

(def app
  (wrap-resource handler "public"))

(run-jetty app {:port 3000})


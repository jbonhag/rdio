(ns rdio.core
  (:require [rdio.api :as api]
            [compojure.route :as route]
            [compojure.handler :as handler]
            [compojure.core :refer :all]
            [ring.middleware.params :refer :all]))

(defn search [query]
  {:status 200
   :headers {"Content-Type" "text/plain"}
   :body (api/search query)})

(defroutes main-routes
  (POST "/search" [query] (search query))
  (route/resources "/")
  (route/not-found "Not found"))

(def app (handler/site main-routes))


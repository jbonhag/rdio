(ns rdio.core
  (:require [rdio.api :as api]
            [compojure.route :as route]
            [compojure.handler :as handler]
            [compojure.core :refer :all]
            [ring.middleware.params :refer :all]
            [ring.middleware.json :refer :all]
            [ring.util.response :refer :all]))

(defroutes main-routes
  (GET "/" [] (resource-response "index.html" {:root "public"}))

  (POST "/api/:method" [method & p]
        (response (api/call method p)))

  (route/resources "/")
  (route/not-found "Not found"))

(def app 
  (-> (handler/site main-routes)
      (wrap-json-response)))


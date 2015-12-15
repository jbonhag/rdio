FROM ubuntu:trusty

RUN apt-get update
RUN apt-get install -y npm

ADD package.json /rdio/package.json
RUN cd /rdio && npm install
ADD . /rdio

EXPOSE 5000
CMD ["nodejs", "/rdio/app.js"]

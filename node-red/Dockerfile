FROM nodered/node-red:3.0.2

ADD node-red-nodes ./node-red-nodes
RUN npm install ./node-red-nodes

ADD images /data/images
COPY settings.js /data/settings.js
COPY flows.json /data/flows.json
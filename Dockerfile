FROM node:14

COPY server /opt/src
WORKDIR /opt/src
RUN npm install

CMD npm run start
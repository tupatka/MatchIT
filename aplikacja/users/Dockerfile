FROM node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
RUN npm install pg
COPY ./*.mjs ./

EXPOSE 7070

CMD [ "node", "users.mjs" ]

FROM node:14

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

RUN npm install pm2 -g

ENV NODE_ENV production

EXPOSE 3000

CMD ["pm2-runtime", "src/server.js"]

USER node
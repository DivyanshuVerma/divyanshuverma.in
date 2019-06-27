FROM node:12.4-alpine

RUN npm install webpack webpack-cli -g

WORKDIR /tmp
COPY package.json /tmp/
RUN npm config set registry http://registry.npmjs.org/ && npm install

WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN cp -a /tmp/node_modules /usr/src/app/

RUN webpack

ENV NODE_ENV=production 
ENV PORT=8080

CMD [ "/usr/local/bin/node", "./server.js" ]

EXPOSE 8080
FROM node

WORKDIR /
COPY package.json ./
RUN npm install
COPY . /

CMD node server.js
EXPOSE 3000
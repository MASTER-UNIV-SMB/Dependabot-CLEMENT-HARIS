FROM node:14

WORKDIR /usr/src/app/dependabot_client

COPY package*.json ./

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
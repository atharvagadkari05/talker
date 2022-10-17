FROM node:13
WORKDIR /home/node/app
COPY server /home/node/app
RUN npm install
CMD npm run app
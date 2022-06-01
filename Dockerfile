FROM node:16
WORKDIR /usr/src/clean-node-api
RUN yarn install --only=prod


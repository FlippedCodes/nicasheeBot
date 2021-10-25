# get node version 16
FROM node:16.12-buster-slim

# Create app directory
WORKDIR /usr/src/app

#  npm ERR! gyp ERR! stack Error: Could not find any Python installation to use
# RUN apk add --update python make g++\
#   && rm -rf /var/cache/apk/*

# Get app dependencies
COPY package*.json ./

# building app
RUN npm ci --only=production

# Bundle app source
COPY . .

# start up the bot
CMD [ "npm", "start" ]
FROM node:16.2.0-alpine

# create destination directory
RUN mkdir -p /usr/src/region
WORKDIR /usr/src/region

# update and install dependency
RUN apk update && apk upgrade
RUN apk add git

# copy the app, note .dockerignore
COPY . /usr/src/region/

# install dependencies
RUN yarn

# expose 3000 on container
EXPOSE 3000

# set app serving to permissive / assigned
# ENV NUXT_HOST=0.0.0.0
# set app port
# ENV NUXT_PORT=3000

# start the app
CMD [ "node", "server.js" ]
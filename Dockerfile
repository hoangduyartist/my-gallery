FROM node:10.13-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
CMD npm start

# docker build -t mygallery .
# docker tag 9fad943e9df1 my-gallery:latest
# docker run -t my-gallery
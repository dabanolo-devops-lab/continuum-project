# adding node alpine image
FROM node:19.2-alpine
# Install app dependencies
WORKDIR /usr/src/app
COPY ./app /usr/src/app
RUN npm install --only=production
# Bundle app source
EXPOSE 8080
# Expose port for socket.io
EXPOSE 3000
# Run the app when the container launches
CMD ["npm", "start"]
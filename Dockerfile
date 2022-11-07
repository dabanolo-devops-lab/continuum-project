# adding node alpine image
FROM node:gallium-alpine3.15
# Install app dependencies
WORKDIR /usr/app
COPY ./app /usr/app
RUN npm install
# Bundle app source
EXPOSE 8080
# Expose port for socket.io
EXPOSE 3000
# Run the app when the container launches
CMD ["npm", "start"]
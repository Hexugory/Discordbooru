# Use the official Node.js image as the base image
FROM node:14

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy local code
COPY . .

# Run the application
CMD [ "node", "hookbot.js" ]


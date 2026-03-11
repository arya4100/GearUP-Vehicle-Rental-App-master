# Use a lightweight Node.js base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package files first to leverage Docker's layer caching
COPY final-demo/package*.json ./

# Install dependencies in the container
RUN npm install

# Copy the rest of the source code
COPY final-demo/ .

# Expose the port used by React's dev server (default 3000)
EXPOSE 3000

# Specify the command to start the development server
CMD ["npm", "start"]

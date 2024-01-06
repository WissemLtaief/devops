# Starting from a node base image
FROM node:18-alpine as build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the application
RUN npm run build

# Start a new stage from nginx to serve the static files
FROM nginx:alpine

# Copy static assets from builder stage
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose port 80 to access the container
EXPOSE 80

# No need for CMD because it's included in the nginx base image

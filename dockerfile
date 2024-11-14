# Stage 1: Build React application
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy files to the container
COPY . .

# Install dependencies
RUN npm install

# Build the application
RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:alpine

# Copy the build output to Nginx's web directory
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

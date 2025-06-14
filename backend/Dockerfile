FROM node:16-alpine

# Install required dependencies
RUN apk add --no-cache \
    python3 \
    g++ \
    make \
    docker-cli

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"] 
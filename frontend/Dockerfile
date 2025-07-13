FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including development dependencies)
RUN npm install

# Copy source code
COPY . .

# Exposed Ports
EXPOSE 3000

# Start the development server
CMD ["npm", "start"] 
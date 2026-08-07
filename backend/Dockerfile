# Use official Node.js image
FROM node:20

# Create working directory inside container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Tell Docker which port the app uses
EXPOSE 5000

# Start the backend
CMD ["npm", "start"]
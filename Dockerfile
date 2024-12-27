# Stage 1: Build Stage
FROM node:18 AS build

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

COPY .env .env

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Run Stage
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy only the built files and necessary dependencies
COPY package*.json ./
RUN npm install --production

# Copy the .env file again in the runtime stage
COPY .env .env

COPY --from=build /usr/src/app/dist ./dist

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]

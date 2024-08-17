# Use an official Node runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the Nuxt application
RUN npm run build

# Run migrations
RUN npx prisma migrate deploy
RUN npx prisma migrate status

# Expose the port the app runs on
EXPOSE 3000

# Set the command to run the app
CMD ["node", ".output/server/index.mjs"]
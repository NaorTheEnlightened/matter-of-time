#!/bin/sh

# Wait for the database to be ready
echo "Waiting for database to be ready..."
./wait-for-it.sh db:5432 -t 60

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Start the application
echo "Starting the application..."
node .output/server/index.mjs
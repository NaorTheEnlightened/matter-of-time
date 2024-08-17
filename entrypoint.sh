#!/bin/sh

# Wait for the PostgreSQL database to be available
until npx prisma migrate status; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 5
done

# Run database migrations
npx prisma migrate deploy

# Start the application
exec "$@"
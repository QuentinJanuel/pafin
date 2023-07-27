# Add HOST and PORT to .env
echo "DB_HOST=db" >> .env
echo "PORT=3000" >> .env

# Load the .env file
source .env

# Add DATABASE_URL to .env
echo "DATABASE_URL=postgresql://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME" >> .env

# Setup the database
npx prisma migrate dev --name init

# Start the server
npm start

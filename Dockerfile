FROM node:18.3.0-alpine3.14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Make the start.sh file executable
RUN chmod +x ./start.sh

# Setup prisma
RUN npx prisma generate

# Expose port 3000
EXPOSE 3000

# Run the app
CMD [ "./start.sh" ]

# 1. Base the cloud environment on Node.js
FROM node:20

# 2. Automatically install Python 3.12 and pip packages onto the Linux container
RUN apt-get update && apt-get install -y python3 python3-pip

WORKDIR /app

# 3. Copy package structures and install dependencies for BOTH root and server layers
COPY package*.json ./
RUN npm install

COPY server/package*.json ./server/
RUN cd server && npm install

# 4. Copy the rest of the workspace source files
COPY . .

# 5. Install Python ML requirements inside the container
RUN pip3 install --break-system-packages numpy nltk tensorflow setuptools==69.5.1

EXPOSE 8080

# 6. Fire up your production server sequence
CMD ["npm", "run", "start:prod"]
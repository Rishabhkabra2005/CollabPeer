# 1. Base image containing Node.js
FROM node:20

# 2. Install Python 3.12 for ML pipeline execution
RUN apt-get update && apt-get install -y python3 python3-pip

WORKDIR /app

# 3. Copy root and server dependencies
COPY package*.json ./
RUN npm install

COPY server/package*.json ./server/
RUN cd server && npm install

# 4. Copy client structures and install React modules
COPY client/package*.json ./client/
RUN cd client && npm install

# 5. Copy the entire project repository source code
COPY . .

# 6. Compile the React production build folder layout inside the container
RUN cd client && npm run build

# 7. Install Python ML pipeline requirements
RUN pip3 install --break-system-packages numpy nltk tensorflow setuptools==69.5.1

EXPOSE 8080

# 8. Run the production deployment backend instance
CMD ["npm", "run", "start:prod"]
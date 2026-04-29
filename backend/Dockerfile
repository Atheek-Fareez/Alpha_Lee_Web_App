# Start from a lightweight Python image
FROM python:3.10-slim

# Install system dependencies including curl to fetch Node.js
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Install Node.js (Version 20.x is a stable LTS release)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

# Set the working directory to /app
WORKDIR /app

# Step 1: Copy only Python dependencies first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Step 2: Copy only Node dependencies
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Step 3: Copy the rest of the backend source code
COPY . .

# Expose port 3000 (standard for Express unless otherwise specified)
EXPOSE 3000

# Start the Node server (This uses the 'start' script in package.json)
CMD ["npm", "start"]

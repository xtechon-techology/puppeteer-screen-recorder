FROM node:20

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    xvfb \
    x11vnc \
    x11-apps \
    fluxbox

# Install Puppeteer dependencies
RUN apt-get install -y libglib2.0-0 libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libxkbcommon0 libpango-1.0-0 libcairo2 libasound2 fonts-ipafont-gothic x11-utils xdg-utils


# Set working directory
WORKDIR /app

# Copy the project files
COPY . .

# Install dependencies
RUN npm install

# Start Xvfb in background and then run node script
# CMD ["sh", "-c", "Xvfb :0 -screen 0 1920x1080x24 & node search_v5.js"]

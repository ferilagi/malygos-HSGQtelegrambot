FROM node:current-alpine3.16

# Buat App Directori
WORKDIR /usr/src/app

# Install semua dependency yang dibutuhkan
COPY package*.json ./

RUN npm install

# Menyalin semua file ke image container
COPY . .

# Expose Port di container
EXPOSE 3000

CMD [ "node", "app.js" ]


# Gunakan base image Node.js versi 18 yang ramping
FROM node:18-slim

# Tetapkan direktori kerja di dalam kontainer
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json terlebih dahulu untuk caching
COPY package*.json ./

# Install semua dependensi produksi
RUN npm install --only=production

# Salin sisa kode aplikasi ke dalam direktori kerja
COPY . .

# Beri tahu kontainer cara menjalankan aplikasi saat dimulai
CMD [ "node", "server.js" ]
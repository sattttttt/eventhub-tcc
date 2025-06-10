# Gunakan base image Node.js versi 18 yang ramping
FROM node:18-slim

# Tetapkan direktori kerja di dalam kontainer
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json terlebih dahulu
COPY package*.json ./

# Salin SEMUA sisa file dari lokal, TERMASUK node_modules yang salah
COPY . .

# --- LANGKAH PERBAIKAN DI SINI ---
# Hapus secara paksa folder node_modules yang baru saja disalin dari lokal Anda
RUN rm -rf node_modules

# Sekarang, jalankan npm install untuk membuat node_modules baru yang bersih
# dan kompatibel dengan lingkungan Linux di dalam kontainer
RUN npm install --only=production

# Beri tahu kontainer cara menjalankan aplikasi saat dimulai
CMD [ "node", "server.js" ]
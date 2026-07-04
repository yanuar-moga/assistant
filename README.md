# PANDA ASSISTANT - Panduan Implementasi Lengkap

## 1. Persiapan Google Spreadsheet
1. Unduh berkas `panda_assistant_database.xlsx` yang telah disediakan di atas.
2. Buka [Google Sheets](https://sheets.google.com) dan buat spreadsheet baru.
3. Klik **File** > **Import** > **Upload**, lalu pilih file `.xlsx` tersebut.
4. Salin **ID Spreadsheet** Anda dari URL browser (deretan karakter panjang antara `/d/` dan `/edit`).

## 2. Pemasangan Google Apps Script (Backend)
1. Di dalam Google Spreadsheet Anda, klik menu **Extensions** > **Apps Script**.
2. Buat file baru sesuai struktur `.gs` di atas (`Code.gs`, `Config.gs`, `Chat.gs`, dll.).
3. Tempel kode dari masing-masing file yang ada pada dokumentasi ini.
4. Buka `Config.gs` dan ganti nilai `ID_SPREADSHEET_ANDA` dengan ID yang telah dicari sebelumnya.
5. Untuk Password Manager, klik **Project Settings** (ikon roda gigi) > **Script Properties** > Tambah Property dengan properti bernama `AES_KEY` dan isikan kunci acak aman Anda.

## 3. Deploy sebagai Web Application
1. Di kanan atas editor Apps Script, klik **Deploy** > **New deployment**.
2. Pilih jenis penyebaran: **Web app**.
3. Atur konfigurasi:
   - **Execute as:** `Me (email anda)`
   - **Who has access:** `Anyone`
4. Klik **Deploy**, beri otorisasi akses Google akun jika diminta.
5. Salin tautan **Web App URL** yang dihasilkan dan tempel ke variabel `baseUrl` pada berkas frontend `js/api.js`.

## 4. Integrasi ke GitHub Pages
1. Unggah seluruh direktori kode frontend Anda (`index.html`, `/css`, `/js`, `manifest.json`) ke repositori GitHub.
2. Masuk ke **Settings** repositori > **Pages**.
3. Di bawah **Build and deployment**, ubah Source menjadi **Deploy from a branch** dan pilih branch `main` atau `master`.
4. Simpan, halaman web premium Anda akan aktif dalam beberapa menit.

## 5. Cara Menambahkan Karakter & Slash Command Baru Tanpa Ubah Kode
- **Tambah Karakter Baru (Misal: Robot):** Cukup buat folder aset gambar bergerak di `/assets/assistants/robot/idle.gif` dan tambahkan satu baris data baru pada lembar sheet **Assistants** di Google Spreadsheet Anda dengan ID `Robot`.
- **Tambah Slash Command Baru:** Buka lembar sheet **Commands**, tambahkan baris baru (contoh: `/dapodik`). Sistem otomatis mengidentifikasi autocomplete perintah ini pada perangkat klien.

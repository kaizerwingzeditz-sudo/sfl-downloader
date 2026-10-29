# SFL Downloader

Antarmuka mobile-friendly untuk mencoba resolve link SFL.gl menjadi URL tujuan akhir.

## Penting: jangan buka `index.html` langsung di HP

Jika alamat browser terlihat seperti `content://...` atau file lokal, halaman HTML memang bisa tampil tetapi endpoint `/api/resolve` tidak tersedia. Karena itu, permintaan akan gagal jika dibuka dari folder Download. Website ini membutuhkan backend serverless.

## Deploy di Vercel (disarankan)

1. Ekstrak ZIP project ini.
2. Unggah **seluruh isi folder `sfl-downloader`** ke repository GitHub baru. Pastikan folder `api/` dan file `vercel.json` ikut terunggah.
3. Masuk ke https://vercel.com/ lalu pilih **Add New → Project**.
4. Import repository GitHub tersebut. Biarkan pengaturan default; tidak perlu build command.
5. Tekan **Deploy**.
6. Buka URL HTTPS yang diberikan Vercel (misalnya `nama-project.vercel.app`) dan coba satu link publik `https://sfl.gl/...`. Jangan buka `index.html` dari folder Download.

## Cara kerja

Frontend mengirim `{ "url": "https://sfl.gl/..." }` ke endpoint internal `/api/resolve`. Fungsi `api/resolve.js` memvalidasi host input, lalu meneruskan permintaan ke resolver pihak ketiga di `https://www.kevinhosting.my.id/api/tools/sfl`.

## Catatan

- Resolver pihak ketiga bisa berubah, membatasi permintaan, atau tidak tersedia sewaktu-waktu.
- Jika mendapat pesan `Backend /api/resolve tidak ditemukan`, project belum di-deploy dengan konfigurasi yang tepat atau hosting tidak menjalankan serverless functions.
- Jika mendapat pesan resolver pihak ketiga tidak tersedia, backend sudah dihubungi tetapi layanan resolver di luar project kemungkinan bermasalah.
- Jangan memasukkan link privat atau data sensitif. Periksa domain tujuan sebelum membuka atau mengunduh file.
- Ini adalah project pribadi/prototipe dan bukan produk resmi SFL.gl.

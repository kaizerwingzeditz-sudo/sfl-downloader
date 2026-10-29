# SFL Downloader

Antarmuka mobile-friendly untuk mencoba resolve link SFL.gl menjadi URL tujuan akhir.

## Susunan file WAJIB di root repository

```
index.html
package.json
README.md
api/
  resolve.js
```

Jangan bungkus semua file itu di dalam folder tambahan bernama `sfl-downloader/` di repository GitHub. File `api/resolve.js` harus benar-benar berada di folder `api` yang sejajar dengan `index.html`.

## Deploy ke Vercel dari HP

1. Ekstrak ZIP ini.
2. Di repository GitHub, unggah `index.html`, `package.json`, dan `README.md` ke halaman utama repository.
3. Buat file baru melalui **Add file → Create new file**, isi nama/path `api/resolve.js`, lalu salin seluruh isi file `api/resolve.js` dari ZIP ke situ dan commit. Dengan begitu, folder `api` dibuat pada lokasi yang benar.
4. Di Vercel, buka project → Deployments → lakukan redeploy setelah commit GitHub selesai. Kalau project belum terhubung ke GitHub, pilih Add New → Project lalu impor repository itu.
5. Buka URL `https://....vercel.app`, jangan buka `index.html` sebagai file lokal.

File `vercel.json` sengaja tidak disertakan karena pengaturan `functions` lama memunculkan error `unused_function` ketika Vercel tidak menemukan file API pada lokasi yang diharapkan. Vercel akan mendeteksi fungsi secara otomatis dari `api/resolve.js`.

## Cara kerja dan batasan

Frontend mengirim URL ke endpoint internal `/api/resolve`. Fungsi backend memvalidasi bahwa URL berasal dari `sfl.gl`, lalu meminta resolver pihak ketiga. Keberhasilan tetap bergantung pada layanan resolver eksternal; layanan itu dapat berubah, membatasi permintaan, atau tidak tersedia.

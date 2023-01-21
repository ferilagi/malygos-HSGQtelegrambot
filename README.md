# malygos-HSGQtelegrambot
# Node.js

telegram bot for olt hsgq // bot telegram untuk olt hsgq (untuk sementara hanya epon)

dibuat dengan Node.js

## Installasi

Download atau Clone dengan `download as zip` atau `git clone`:
```console
$ git clone ferilagi/malygos-HSGQtelegrambot
```

Masuk ke directory `malygos-HSGQtelegrambot`:
```console
$ cd malygos-HSGQtelegrambot
```

Lakukan perintah npm install, *harus terisntall node.js* :
```console
$ npm install
```

Copy .env-example menjadi .env:
```console
$ cp .env-example .env
```
Ubah variable di `.env` agar sesuai dengan ipaddress, username, dan password olt anda.

Jalankan aplikasi dengan perintah:
```console
$ node app.js
```
atau
```console
$ npm start
```

## Perintah

Setelah aplikasi berjalan, buka aplikasi telegram lalu ketik perintah :
```console
/start
```
jika berhasil maka akan muncul balasan `Selamat Datang`.


Untuk Inisialisasi, ketik perintah :
```console
/password
```
Setelah itu akan muncul masukkan password dan jawab dengan password
yang telah anda masukkan di file `.env` pada bagian `PASS_CHAT`.
jika berhasil maka akan muncul balasan `Authentikasi Berhasil`.

Perintah untuk menampilkan info port dan onu:
```console
/info
```

Perintah untuk menampilkan detail onu:
```console
/onu {parameter}
```
untuk {parameter} bisa disikin dengan macaddress / nama onu contoh:
```console
/onu 00:1B:44:11:3A:B7
```
atau
```console
/onu modem-budi
```


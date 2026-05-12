# Aplikasi Computer Based Test (CBT)

Aplikasi ini adalah platform ujian berbasis komputer (CBT) interaktif yang memfasilitasi pembuatan soal dan proses evaluasi nilai antara guru dan murid secara _real-time_.

🌐 **Live Demo:** https://computer-based-test-lilac.vercel.app/

## 🛠️ Cara Kerja Sistem

Aplikasi ini memiliki dua alur utama yang saling terhubung:

1. **Alur Guru (Teacher Dashboard)**
   Guru masuk ke dalam sistem menggunakan akun yang sudah terdaftar. Melalui _dashboard_, guru dapat membuat ujian baru, mengatur waktu, dan memasukkan butir-butir soal. Setelah ujian berhasil dibuat, sistem akan secara otomatis menghasilkan sebuah **Kode Ujian** yang unik.

2. **Alur Murid (Student Portal)**
   Murid tidak perlu repot membuat akun. Murid cukup membuka halaman utama aplikasi, lalu memasukkan data diri (Nama, NIS, Kelas) beserta **Kode Ujian** yang telah diberikan oleh guru. Setelah itu, murid dapat langsung masuk ke halaman pengerjaan soal.

## Alur Penggunaan Website CBT (Computer Based Test)

Sistem ujian berbasis komputer ini dirancang untuk memberikan pengalaman evaluasi yang praktis, mulus, dan otomatis. Aplikasi ini membagi alur kerja menjadi dua sisi utama: **Guru** (sebagai penyelenggara) dan **Murid** (sebagai peserta ujian).

Berikut adalah alur lengkap penggunaan aplikasi:

### 👨‍🏫 Fase Persiapan (Alur Guru)

1. **Membuat Ujian:** Guru masuk ke _dashboard_ utama dan membuat sesi ujian baru dengan menentukan detail dasar seperti judul ujian dan rentang waktu ujian.
2. **Menyiapkan Soal Ujian:** Guru memasukkan daftar pertanyaan ke dalam sistem, lengkap dengan opsi pilihan ganda dan penentuan kunci jawaban yang benar untuk kebutuhan penilaian otomatis (_auto-grading_).
3. **Membagikan Kode Ujian:** Setelah ujian berstatus siap, sistem akan menghasilkan sebuah **Kode Ujian** unik. Guru kemudian membagikan kode tersebut kepada murid-murid di kelas.

### 👨‍🎓 Fase Pelaksanaan (Alur Murid)

4. **Memasukkan Data Diri & Kode:** Murid tidak perlu repot membuat akun. Murid cukup membuka halaman utama ujian, lalu mengisi form identitas singkat (Nama, NIS, Kelas) dan memasukkan **Kode Ujian** yang diberikan oleh guru.
5. **Mengerjakan Ujian:** Murid diarahkan ke panel pengerjaan soal yang interaktif. Di sini, murid dapat menjawab soal, melihat sisa waktu, menggunakan navigasi daftar soal, serta menandai soal dengan status "Ragu-ragu" jika ingin ditinjau kembali nanti.
6. **Menyelesaikan Ujian:** Setelah semua soal dijawab atau waktu pengerjaan telah habis, murid menekan tombol "Selesai". Sistem _backend_ akan secara otomatis mencocokkan jawaban murid dengan kunci jawaban dan langsung merekam nilai akhirnya di dalam _database_.

### 📊 Fase Evaluasi (Hasil Akhir)

7. **Mengunduh Rekap Nilai:** Guru dapat memantau jumlah pengumpul secara _real-time_. Setelah ujian selesai, guru cukup menekan tombol unduh pada _dashboard_ untuk mendapatkan laporan rekapitulasi nilai seluruh murid dalam format **Excel (.xlsx)**. Laporan ini mencakup NIS, Nama, Kelas, Waktu Pengerjaan, dan Nilai Akhir murid.

## 🔑 Akun Percobaan (Demo Account)

Jika Anda ingin meninjau fitur-fitur di dalam _dashboard_ guru (seperti membuat ujian, melihat soal, atau mengunduh rekap nilai), Anda dapat menggunakan akun percobaan berikut:

- **Email:** `guruteladan@gmail.com`
- **Password:** `guruteladan123`

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Aplikasi Computer Based Test (CBT)

Aplikasi ini adalah platform ujian berbasis komputer (CBT) interaktif yang memfasilitasi pembuatan soal dan proses evaluasi nilai antara guru dan murid secara _real-time_.

🌐 **Live Demo:** https://computer-based-test-lilac.vercel.app/

## 🛠️ Cara Kerja Sistem

Aplikasi ini memiliki dua alur utama yang saling terhubung:

1. **Alur Guru (Teacher Dashboard)**
   Guru masuk ke dalam sistem menggunakan akun yang sudah terdaftar. Melalui _dashboard_, guru dapat membuat ujian baru, mengatur waktu, dan memasukkan butir-butir soal. Setelah ujian berhasil dibuat, sistem akan secara otomatis menghasilkan sebuah **Kode Ujian** yang unik.

2. **Alur Murid (Student Portal)**
   Murid tidak perlu repot membuat akun. Murid cukup membuka halaman utama aplikasi, lalu memasukkan data diri (Nama, NIS, Kelas) beserta **Kode Ujian** yang telah diberikan oleh guru. Setelah itu, murid dapat langsung masuk ke halaman pengerjaan soal.

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

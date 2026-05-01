"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const BuatUjianAction = async (
  judul: string,
  waktu_mulai: string,
  waktu_selesai: string,
) => {
  const supabase = await createClient();

  const getIdGuru = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return user?.id;
  };

  const generateKodeRandom = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  let kodeUjian = generateKodeRandom();
  let kodeUnik = false;

  while (!kodeUnik) {
    const { data } = await supabase
      .from("Ujian")
      .select("pin")
      .eq("pin", kodeUjian)
      .maybeSingle();

    if (!data) {
      // Jika data tidak ditemukan, berarti PIN aman dan belum dipakai
      kodeUnik = true;
    } else {
      // Jika ternyata sudah ada, buat ulang PIN yang baru dan ulang looping-nya
      kodeUjian = generateKodeRandom();
    }
  }

  if (new Date(waktu_selesai) <= new Date(waktu_mulai)) {
    return { message: "waktu selesai ujian terjadi sebelum mulai" };
  }

  // 3. Simpan ke Database
  const idGuru = await getIdGuru();
  const { error } = await supabase.from("Ujian").insert([
    {
      guru_id: idGuru,
      judul: judul,
      kode_ujian: kodeUjian,
      waktu_mulai: waktu_mulai,
      waktu_selesai: waktu_selesai,
    },
  ]);

  if (error) {
    return { message: error, kodeUjian: null };
  } else {
    return { message: "Success", kodeUjian: kodeUjian };
  }
};

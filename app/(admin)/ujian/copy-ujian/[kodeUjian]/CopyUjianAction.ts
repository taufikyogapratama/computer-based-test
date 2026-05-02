"use server";

import { createClient } from "@/lib/supabase/server";

// Parameter kodeUjian adalah kode ujian yang dicopu soal-nya
export const copyUjian = async (kodeUjian: string, kodeUjianBaru: string) => {
  /* 
  1. Buat ujian baru. (udah)
  2. dari kode ujian diambil id ujian
  3. Ambil semua item soal yang memiliki id yang sema dengan id ujian yang ingin dicopy soalnya.
  4. Insert soal soal tadi ke db dengan idUjian yang tadi baru saja dibuat
  */
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Ujian")
    .select("id")
    .eq("kode_ujian", kodeUjian)
    .maybeSingle();

  if (error) {
    return {
      success: false,
      message: `Error database: ${error.message}`,
    };
  }

  if (!data) {
    return {
      success: false,
      message: "Kode ujian tidak ditemukan!",
    };
  }

  // Ubah kodeUjianBaru jadi idUjianbaru
  const { data: idUjian, error: errIdUjian } = await supabase
    .from("Ujian")
    .select("id")
    .eq("kode_ujian", kodeUjianBaru)
    .maybeSingle();

  if (errIdUjian) {
    return {
      success: false,
      message: `Error database: ${errIdUjian.message}`,
    };
  }

  if (!idUjian) {
    return {
      success: false,
      message: "Id ujian baru tidak ditemukan!",
    };
  }

  const { data: soalSumber, error: errorAmbil } = await supabase
    .from("Soal")
    .select("*")
    .eq("ujian_id", data.id);

  if (errorAmbil) {
    // return { success: false, message: errorAmbil.message };
    return { success: false, message: "masalah ambil soal" };
  }

  if (!soalSumber || soalSumber.length === 0) {
    return {
      success: false,
      message: "Ujian sumber tidak memiliki soal untuk diduplikasi.",
    };
  }

  const soalBaru = soalSumber.map((soal) => ({
    ujian_id: idUjian.id,
    teks_soal: soal.teks_soal,
    opsi_a: soal.opsi_a,
    opsi_b: soal.opsi_b,
    opsi_c: soal.opsi_c,
    opsi_d: soal.opsi_d,
    opsi_e: soal.opsi_e,
    kunci_jawaban: soal.kunci_jawaban,
  }));

  const { error: errorInsert } = await supabase.from("Soal").insert(soalBaru);

  if (errorInsert) {
    return { success: false, message: errorInsert.message };
    // return { success: false, message: "Maslah insert soal" };
  }

  return {
    success: true,
    message: `Berhasil menduplikasi ${soalBaru.length} soal ke ujian baru!`,
  };
};

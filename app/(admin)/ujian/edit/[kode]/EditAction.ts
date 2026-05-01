"use server";
import { createClient } from "@/lib/supabase/server";

const getIdUjian = async (kodeUjian: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Ujian")
    .select("id")
    .eq("kode_ujian", kodeUjian)
    .maybeSingle();

  if (error) {
    console.error("DEBUG getIdUjian - ERROR:", error.message);
    return null;
  }

  if (!data) {
    console.log("DEBUG getIdUjian - KODE TIDAK DITEMUKAN:", kodeUjian);
    return null;
  }

  console.log("DEBUG getIdUjian - BERHASIL MENEMUKAN ID:", data.id);
  return data.id;
};

export const getSoal = async (kodeUjian: string) => {
  console.log("DEBUG getSoal - MENCARI KODE:", kodeUjian);

  const id_ujian = await getIdUjian(kodeUjian);

  if (!id_ujian) {
    console.log("DEBUG getSoal - BERHENTI KARENA ID UJIAN NULL");
    return [];
  }

  console.log("DEBUG getSoal - MENCARI SOAL UNTUK UJIAN ID:", id_ujian);

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(
    "DEBUG getSoal - USER YANG LOGIN:",
    user ? user.id : "TIDAK ADA/ANONIM",
  );

  const { data: daftarSoal, error } = await supabase
    .from("Soal")
    .select("*")
    .eq("ujian_id", id_ujian)
    .order("id", { ascending: true });

  if (error) {
    console.error("DEBUG getSoal - ERROR AMBIL SOAL:", error.message);
    return [];
  }

  console.log(
    "DEBUG getSoal - JUMLAH SOAL DITEMUKAN:",
    daftarSoal?.length || 0,
  );
  return daftarSoal || [];
};

export const simpanSoal = async (kodeUjian: string, soalData: any) => {
  const id_ujian = await getIdUjian(kodeUjian);

  if (!id_ujian) {
    return { success: false, message: "ID Ujian tidak ditemukan" };
  }

  const supabase = await createClient();

  if (soalData.id) {
    const { error } = await supabase
      .from("Soal")
      .update({
        teks_soal: soalData.teks_soal,
        opsi_a: soalData.opsi_a,
        opsi_b: soalData.opsi_b,
        opsi_c: soalData.opsi_c,
        opsi_d: soalData.opsi_d,
        opsi_e: soalData.opsi_e,
        kunci_jawaban: soalData.kunci_jawaban,
      })
      .eq("id", soalData.id)
      .eq("ujian_id", id_ujian);

    if (error) return { success: false, message: error.message };
    return { success: true, message: "Soal berhasil diperbarui!" };
  } else {
    const { error } = await supabase.from("Soal").insert({
      ujian_id: id_ujian,
      teks_soal: soalData.teks_soal,
      opsi_a: soalData.opsi_a,
      opsi_b: soalData.opsi_b,
      opsi_c: soalData.opsi_c,
      opsi_d: soalData.opsi_d,
      opsi_e: soalData.opsi_e,
      kunci_jawaban: soalData.kunci_jawaban,
    });

    if (error) return { success: false, message: error.message };
    return { success: true, message: "Soal baru berhasil ditambahkan!" };
  }
};

export const hapusSoal = async (id_soal: number) => {
  const supabase = await createClient();
  const { error } = await supabase.from("Soal").delete().eq("id", id_soal);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Soal berhasil dihapus!" };
};

export const getMetadataUjian = async (kodeUjian: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Ujian")
    .select("judul, waktu_mulai, waktu_selesai")
    .eq("kode_ujian", kodeUjian)
    .maybeSingle();

  if (error || !data) {
    return null;
  }
  return data;
};

export const updateMetadataUjian = async (
  kodeUjian: string,
  updateData: any,
) => {
  const id_ujian = await getIdUjian(kodeUjian);
  if (!id_ujian) return { success: false, message: "ID Ujian tidak ditemukan" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("Ujian")
    .update(updateData)
    .eq("id", id_ujian);

  if (error) {
    return { success: false, message: error.message };
  }
  return { success: true, message: "Informasi ujian berhasil diperbarui!" };
};

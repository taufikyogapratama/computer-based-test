"use server";
import { createClient } from "@/lib/supabase/server";

export const loginUjian = async (
  nama: string,
  nis: string,
  kelas: string,
  kode: string,
) => {
  const supabase = await createClient();

  const { data: ujian, error: errUjian } = await supabase
    .from("Ujian")
    .select("*")
    .eq("kode_ujian", kode)
    .maybeSingle();

  if (errUjian || !ujian)
    return { success: false, message: "Kode ujian tidak ditemukan!" };

  const waktuSekarang = new Date().getTime();
  const parseWaktuWIB = (waktuStr: string) => {
    let formatAman = waktuStr.replace(" ", "T");

    formatAman = formatAman.replace("Z", "") + "+07:00";

    return new Date(formatAman).getTime();
  };

  const waktuMulai = parseWaktuWIB(ujian.waktu_mulai);
  const waktuSelesai = parseWaktuWIB(ujian.waktu_selesai);

  if (waktuSekarang < waktuMulai)
    return { success: false, message: "Ujian belum dimulai!" };
  if (waktuSekarang > waktuSelesai)
    return { success: false, message: "Waktu ujian sudah berakhir!" };

  const { data: sesiLama } = await supabase
    .from("Sesi_Murid")
    .select("id, waktu_kumpul")
    .eq("ujian_id", ujian.id)
    .eq("nis", nis)
    .maybeSingle();

  if (sesiLama) {
    if (sesiLama.waktu_kumpul)
      return { success: false, message: "Anda sudah menyelesaikan ujian ini." };
    return { success: true, sesiId: sesiLama.id, ujianId: ujian.id };
  }

  const { data: sesiBaru, error: errSesi } = await supabase
    .from("Sesi_Murid")
    .insert([
      {
        ujian_id: ujian.id,
        nama_murid: nama,
        nis: nis,
        kelas: kelas,
        waktu_mulai: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (errSesi)
    return {
      success: false,
      message: "Gagal membuat sesi: " + errSesi.message,
    };
  return { success: true, sesiId: sesiBaru.id, ujianId: ujian.id };
};

export const getDataCbt = async (kodeUjian: string, sesiId: number) => {
  const supabase = await createClient();

  const { data: ujian } = await supabase
    .from("Ujian")
    .select("*")
    .eq("kode_ujian", kodeUjian)
    .single();
  const { data: soal } = await supabase
    .from("Soal")
    .select("*")
    .eq("ujian_id", ujian?.id)
    .order("id");
  const { data: jawaban } = await supabase
    .from("Jawaban_Murid")
    .select("*")
    .eq("sesi_id", sesiId);

  return { ujian, soal: soal || [], jawaban: jawaban || [] };
};

export const simpanJawabanKeDb = async (
  sesiId: number,
  soalId: number,
  jawabanPilihan: string,
) => {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("Jawaban_Murid")
    .select("id")
    .eq("sesi_id", sesiId)
    .eq("soal_id", soalId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("Jawaban_Murid")
      .update({ jawaban_dipilih: jawabanPilihan })
      .eq("id", existing.id);
  } else {
    await supabase
      .from("Jawaban_Murid")
      .insert([
        { sesi_id: sesiId, soal_id: soalId, jawaban_dipilih: jawabanPilihan },
      ]);
  }
};

// export const akhiriSesiDb = async (sesiId: number) => {
//   const supabase = await createClient();
//   await supabase
//     .from("Sesi_Murid")
//     .update({ waktu_kumpul: new Date().toISOString() })
//     .eq("id", sesiId);
//   return { success: true };
// };

export const akhiriSesiDb = async (sesiId: number) => {
  const supabase = await createClient();

  const { data: sesi } = await supabase
    .from("Sesi_Murid")
    .select("ujian_id")
    .eq("id", sesiId)
    .single();

  if (!sesi) return { success: false, message: "Sesi tidak ditemukan" };

  const { data: daftarSoal } = await supabase
    .from("Soal")
    .select("id, kunci_jawaban")
    .eq("ujian_id", sesi.ujian_id);

  const { data: jawabanMurid } = await supabase
    .from("Jawaban_Murid")
    .select("soal_id, jawaban_dipilih")
    .eq("sesi_id", sesiId);

  let jumlahBenar = 0;
  const totalSoal = daftarSoal?.length || 0;

  if (totalSoal > 0 && jawabanMurid) {
    const mapJawaban = new Map(
      jawabanMurid.map((j) => [j.soal_id, j.jawaban_dipilih]),
    );

    daftarSoal?.forEach((soal) => {
      const jawabanUser = mapJawaban.get(soal.id);

      if (jawabanUser && jawabanUser === soal.kunci_jawaban) {
        jumlahBenar++;
      }
    });
  }

  const nilaiAkhir = totalSoal > 0 ? (jumlahBenar / totalSoal) * 100 : 0;

  const nilaiBulat = parseFloat(nilaiAkhir.toFixed(2));

  const { error } = await supabase
    .from("Sesi_Murid")
    .update({
      waktu_kumpul: new Date().toISOString(),
      nilai_akhir: nilaiBulat,
    })
    .eq("id", sesiId);

  if (error) return { success: false, message: error.message };
  return { success: true };
};

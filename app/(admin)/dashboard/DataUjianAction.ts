"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TableCell } from "@/components/ui/table";

export const GetUjian = async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect("/");
  }

  const { data: daftarUjian, error } = await supabase
    .from("Ujian")
    .select("id, judul, kode_ujian, waktu_mulai, waktu_selesai")
    .eq("guru_id", user.id)
    .order("waktu_mulai", { ascending: false });

  if (error) {
    console.error("Gagal mengambil data ujian:", error.message);
    return [];
  }
  if (!daftarUjian) return [];

  const ujianDenganJumlah = await Promise.all(
    daftarUjian.map(async (ujian) => {
      const { count } = await supabase
        .from("Sesi_Murid")
        .select("*", { count: "exact", head: true })
        .eq("ujian_id", ujian.id);

      return {
        ...ujian,
        jumlah_pengumpul: count || 0,
      };
    }),
  );

  return ujianDenganJumlah;
};

export const DeleteUjian = async (id_ujian: string) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { error } = await supabase
    .from("Ujian")
    .delete()
    .eq("id", id_ujian)
    .eq("guru_id", user.id);

  if (error) {
    return { message: error.message };
  }
  return { message: "success" };
};

export const getRekapNilai = async (idUjian: number) => {
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getUser();
  const userId = authData.user?.id;

  const { data: ujian } = await supabase
    .from("Ujian")
    .select("judul, guru_id")
    .eq("id", idUjian)
    .single();

  if (!ujian || ujian.guru_id !== userId) {
    return {
      success: false,
      message: "Akses Ditolak!",
      data: null,
      judul: null,
    };
  }

  const { data: sesiMurid, error } = await supabase
    .from("Sesi_Murid")
    .select("nis, nama_murid, kelas, waktu_mulai, waktu_kumpul, nilai_akhir")
    .eq("ujian_id", idUjian)
    .order("kelas", { ascending: true })
    .order("nama_murid", { ascending: true });

  if (error)
    return { success: false, message: error.message, data: null, judul: null };

  return {
    success: true,
    data: sesiMurid,
    judul: ujian.judul,
  };
};

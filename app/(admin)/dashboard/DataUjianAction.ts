"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const GetUjian = async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect("/");
  }

  // Tambahkan 'id' ke dalam select untuk dijadikan unique key di React
  const { data: daftarUjian, error } = await supabase
    .from("Ujian")
    .select("id, judul, kode_ujian, waktu_mulai, waktu_selesai")
    .eq("guru_id", user.id)
    .order("waktu_mulai", { ascending: false });

  if (error) {
    console.error("Gagal mengambil data ujian:", error.message);
    return [];
  }

  return daftarUjian || [];
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

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "./Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard Guru",
  description: "Tempat guru memenejemen ujian",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    redirect("/");
  }

  const getNameGuru = async (id: string) => {
    const { data, error } = await supabase
      .from("Guru")
      .select("nama")
      .eq("id", id)
      .single();

    if (error) {
      return;
    }

    return data?.nama;
  };

  const namaGuru = await getNameGuru(user?.id || "");

  async function signOut() {
    "use server";
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    console.log(error);
  }

  return (
    <div>
      <header>
        <Navbar nameGuru={namaGuru} signOut={signOut} />
      </header>
      {children}
    </div>
  );
}

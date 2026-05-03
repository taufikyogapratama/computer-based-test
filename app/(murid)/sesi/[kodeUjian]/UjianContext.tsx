"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getDataCbt, simpanJawabanKeDb, akhiriSesiDb } from "./MuridAction";
import { useRouter } from "next/navigation";

type UjianContextType = {
  soal: any[];
  ujian: any | null;
  currentIndex: number;
  jawaban: Record<number, string>;
  raguRagu: Record<number, boolean>;
  sesiId: number | null;
  waktuSisa: string;
  setCurrentIndex: (idx: number) => void;
  pilihJawaban: (soalId: number, jwb: string) => void;
  toggleRagu: (soalId: number) => void;
  selesaikanUjian: () => void;
};

const UjianContext = createContext<UjianContextType | undefined>(undefined);

export const UjianProvider = ({
  children,
  kodeUjian,
}: {
  children: React.ReactNode;
  kodeUjian: string;
}) => {
  const router = useRouter();
  const [ujian, setUjian] = useState<any>(null);
  const [soal, setSoal] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jawaban, setJawaban] = useState<Record<number, string>>({});
  const [raguRagu, setRaguRagu] = useState<Record<number, boolean>>({});
  const [sesiId, setSesiId] = useState<number | null>(null);
  const [waktuSisa, setWaktuSisa] = useState("--:--");

  useEffect(() => {
    // Ambil sesi_id dari LocalStorage berdasarkan kode ujian
    const localSesi = localStorage.getItem(`sesi_ujian_${kodeUjian}`);
    if (!localSesi) {
      alert("Sesi tidak ditemukan. Silakan login kembali.");
      router.push("/");
      return;
    }

    const sId = parseInt(localSesi);
    setSesiId(sId);

    const localRagu = localStorage.getItem(`ragu_${sId}`);
    if (localRagu) setRaguRagu(JSON.parse(localRagu));

    getDataCbt(kodeUjian, sId).then((res) => {
      setUjian(res.ujian);
      setSoal(res.soal);

      const jwbMap: Record<number, string> = {};
      res.jawaban.forEach((j: any) => {
        jwbMap[j.soal_id] = j.jawaban_dipilih;
      });
      setJawaban(jwbMap);
    });
  }, [kodeUjian]);

  useEffect(() => {
    if (!ujian) return;
    const interval = setInterval(() => {
      const target = new Date(ujian.waktu_selesai).getTime();
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(interval);
        setWaktuSisa("00:00");
        selesaikanUjian();
      } else {
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setWaktuSisa(
          `${hours > 0 ? hours + ":" : ""}${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
        );
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [ujian]);

  const pilihJawaban = async (soalId: number, jwb: string) => {
    setJawaban((prev) => ({ ...prev, [soalId]: jwb }));
    if (sesiId) await simpanJawabanKeDb(sesiId, soalId, jwb);
  };

  const toggleRagu = (soalId: number) => {
    const newRagu = { ...raguRagu, [soalId]: !raguRagu[soalId] };
    setRaguRagu(newRagu);
    if (sesiId) localStorage.setItem(`ragu_${sesiId}`, JSON.stringify(newRagu));
  };

  const selesaikanUjian = async () => {
    if (sesiId) {
      await akhiriSesiDb(sesiId);
      localStorage.removeItem(`sesi_ujian_${kodeUjian}`);
      localStorage.removeItem(`ragu_${sesiId}`);
      alert("Ujian Selesai! Jawaban Anda telah direkam.");
      router.push("/");
    }
  };

  return (
    <UjianContext.Provider
      value={{
        soal,
        ujian,
        currentIndex,
        setCurrentIndex,
        jawaban,
        raguRagu,
        sesiId,
        waktuSisa,
        pilihJawaban,
        toggleRagu,
        selesaikanUjian,
      }}
    >
      {children}
    </UjianContext.Provider>
  );
};

export const useUjian = () => {
  const context = useContext(UjianContext);
  if (!context) throw new Error("useUjian must be used within UjianProvider");
  return context;
};

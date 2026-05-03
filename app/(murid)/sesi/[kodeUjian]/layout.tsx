"use client";
import { ModeToggle } from "@/components/modeToggle";
import { Separator } from "@/components/ui/separator";
import Aside from "./Aside";
import { UjianProvider, useUjian } from "./UjianContext";
import { useParams } from "next/navigation";

const HeaderUI = () => {
  const { ujian, waktuSisa } = useUjian();
  return (
    <header className="flex justify-between items-center px-5 py-5">
      <p className="font-bold text-lg">{ujian?.judul || "Memuat..."}</p>
      <div className="flex items-center gap-4">
        <ModeToggle />
        <p
          className={`font-mono text-lg font-bold ${waktuSisa === "00:00" ? "text-red-500" : ""}`}
        >
          {waktuSisa}
        </p>
      </div>
    </header>
  );
};

export default function SesiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const kodeUjian = params.kodeUjian as string;

  return (
    <UjianProvider kodeUjian={kodeUjian}>
      <HeaderUI />
      <Separator />
      <div className="mt-6 flex flex-wrap gap-12 w-full items-start px-4">
        <Aside />
        <main className="flex-1">{children}</main>
      </div>
    </UjianProvider>
  );
}

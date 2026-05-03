"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModeToggle } from "@/components/modeToggle";
import { loginUjian } from "./(murid)/sesi/[kodeUjian]/MuridAction";

type props = { user: boolean; changeUser: (newUser: boolean) => void };

const UjianUi = (props: props) => {
  const router = useRouter();
  const nama = useRef<HTMLInputElement>(null);
  const nis = useRef<HTMLInputElement>(null);
  const kelas = useRef("A");
  const kode = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const valKode = kode.current?.value as string;

    // Panggil Action Server
    const res = await loginUjian(
      nama.current?.value as string,
      nis.current?.value as string,
      kelas.current,
      valKode,
    );

    if (res.success && res.sesiId) {
      // Simpan Sesi ID ke LocalStorage
      localStorage.setItem(`sesi_ujian_${valKode}`, res.sesiId.toString());
      // Redirect ke halaman sesi
      router.push(`/sesi/${valKode}`);
    } else {
      setErrorMsg(res.message || "Gagal masuk ujian");
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="absolute top-3 right-4">
        <ModeToggle />
      </div>
      <section>
        <form onSubmit={handleSubmit}>
          <FieldGroup className="w-80">
            <FieldLegend className="text-center">Mengerjakan Ujian</FieldLegend>
            <Field>
              <FieldLabel htmlFor="nama">Nama</FieldLabel>
              <Input
                type="text"
                ref={nama}
                id="nama"
                required
                className="border rounded px-1"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="kelas">Kelas</FieldLabel>
              <Select
                defaultValue="A"
                required
                onValueChange={(val) => {
                  kelas.current = val;
                }}
              >
                <SelectTrigger id="kelas">
                  <SelectValue placeholder="A-F" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                    <SelectItem value="F">F</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="nis">NIS</FieldLabel>
              <Input
                type="number"
                ref={nis}
                id="nis"
                required
                className="border rounded px-1"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="kode">Kode Ujian</FieldLabel>
              <Input
                type="text"
                ref={kode}
                id="kode"
                required
                className="border rounded px-1"
              />
            </Field>

            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

            <Field
              orientation="horizontal"
              className="flex justify-between mt-4"
            >
              <Button type="submit" disabled={loading} className="rounded-md">
                {loading ? "Memproses..." : "Mulai"}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => props.changeUser(!props.user)}
                className="rounded-md"
              >
                Login Guru
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </section>
    </div>
  );
};
export default UjianUi;

"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { BuatUjianAction } from "./BuatUjianAction";
import { useRef, useState } from "react";
import { redirect } from "next/navigation";

const BuatUjian = () => {
  const [error, setError] = useState(false);
  const judul = useRef<HTMLInputElement>(null);
  const waktu_mulai = useRef<HTMLInputElement>(null);
  const waktu_selesai = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const valJudul = judul.current?.value as string;
    const valWaktuMulai = waktu_mulai.current?.value as string;
    const valWaktuSelesai = waktu_selesai.current?.value as string;
    const result = await BuatUjianAction(
      valJudul,
      valWaktuMulai,
      valWaktuSelesai,
    );

    if (result?.message === "Success") {
      redirect("/dashboard");
    } else if (result.message === "waktu selesai ujian terjadi sebelum mulai") {
      setError(true);
    } else {
      console.log(result?.message);
    }
  };
  return (
    <main className="w-full flex justify-center mt-11">
      <form onSubmit={handleSubmit}>
        <FieldGroup className="w-72">
          <Field>
            <FieldLabel htmlFor="judul">Judul</FieldLabel>

            <Input
              type="teks"
              name="judul"
              id="judul"
              ref={judul}
              required
              className="border rounded px-1"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="waktu-mulai">Waktu Mulai Ujian</FieldLabel>
              <Input
                type="datetime-local"
                id="waktu-mulai"
                ref={waktu_mulai}
                name="waktu_mulai"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="waktu-selesai">
                Waktu Selesai Ujian
              </FieldLabel>
              <Input
                type="datetime-local"
                id="waktu-selesai"
                ref={waktu_selesai}
                name="waktu_selesai"
                required
              />
            </Field>
          </div>
          {error ? (
            <FieldError>
              Waktu selesai harus lebih besar dari waktu mulai!
            </FieldError>
          ) : (
            false
          )}
          <Button type="submit">Buat</Button>
        </FieldGroup>
      </form>
    </main>
  );
};

export default BuatUjian;

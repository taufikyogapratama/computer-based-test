"use client";
import React, { useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
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

type props = {
  user: boolean;
  changeUser: (newUser: boolean) => void;
};

type data = {
  nama: string;
  nim: string;
  // kelas: "A" | "B" | "C" | "D" | "E" | "F";
  kelas: string;
  kode: string;
};

const UjianUi = (props: props) => {
  const nama = useRef<HTMLInputElement>(null);
  const nim = useRef<HTMLInputElement>(null);
  const kelas = useRef("A");
  const kode = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: data = {
      nama: nama.current?.value as string,
      nim: nim.current?.value as string,
      kelas: kelas.current,
      kode: kode.current?.value as string,
    };
    console.log(data);
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
                type="teks"
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
              <FieldLabel htmlFor="nim">NIM</FieldLabel>
              <Input
                type="number"
                ref={nim}
                id="nim"
                required
                className="border rounded px-1"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="kode">Kode</FieldLabel>
              <Input
                type="teks"
                ref={kode}
                id="kode"
                required
                className="border rounded px-1"
              />
            </Field>
            <Field orientation="horizontal" className="flex justify-between">
              <Button type="submit" className="rounded-md">
                Mulai
              </Button>
              <Button
                variant="outline"
                onClick={() => props.changeUser(!props.user)}
                className="rounded-md"
              >
                Login Sebagai Guru
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </section>
    </div>
  );
};

export default UjianUi;

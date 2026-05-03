"use client";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useUjian } from "./UjianContext";

const HalamanJawab = () => {
  const {
    soal,
    currentIndex,
    setCurrentIndex,
    jawaban,
    pilihJawaban,
    raguRagu,
    toggleRagu,
    selesaikanUjian,
  } = useUjian();

  if (soal.length === 0) return <p>Memuat soal...</p>;

  const currentSoal = soal[currentIndex];
  const isRagu = raguRagu[currentSoal.id];
  const isTerakhir = currentIndex === soal.length - 1;

  const konfirmasiSelesai = () => {
    if (
      confirm(
        "Apakah Anda yakin ingin menyelesaikan ujian? Jawaban tidak bisa diubah lagi.",
      )
    ) {
      selesaikanUjian();
    }
  };

  return (
    <div className="relative min-h-[70vh]">
      <p className="mb-5 text-lg font-medium">Soal No. {currentIndex + 1}</p>
      <p className="mb-5">{currentSoal.teks_soal}</p>

      <form>
        <FieldSet className="w-full">
          <RadioGroup
            value={jawaban[currentSoal.id] || ""}
            onValueChange={(val) => pilihJawaban(currentSoal.id, val)}
          >
            {["A", "B", "C", "D", "E"].map((opsi) => {
              const fieldName = `opsi_${opsi.toLowerCase()}`;
              if (!currentSoal[fieldName]) return null;

              return (
                <Field orientation="horizontal" key={opsi} className="mb-2">
                  <RadioGroupItem value={opsi} id={`opsi-${opsi}`} />
                  <FieldLabel
                    htmlFor={`opsi-${opsi}`}
                    className="font-normal text-base cursor-pointer"
                  >
                    {opsi}. {currentSoal[fieldName]}
                  </FieldLabel>
                </Field>
              );
            })}
          </RadioGroup>
        </FieldSet>
      </form>

      <div className="absolute bottom-4 w-full">
        <div className="flex flex-wrap gap-4 justify-between items-center pr-4">
          <ButtonGroup>
            <Button
              variant="outline"
              className="text-base rounded-md"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(currentIndex - 1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Sebelumnya
            </Button>

            <Button
              variant={isRagu ? "default" : "outline"}
              className={`text-base ${isRagu ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}`}
              onClick={() => toggleRagu(currentSoal.id)}
            >
              Ragu-ragu
            </Button>

            <Button
              variant="outline"
              className="text-base rounded-md"
              disabled={isTerakhir}
              onClick={() => setCurrentIndex(currentIndex + 1)}
            >
              Selanjutnya <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </ButtonGroup>

          <Button
            className="bg-green-600 hover:bg-green-700 text-white rounded-md text-base px-8"
            onClick={konfirmasiSelesai}
          >
            Selesai
          </Button>
        </div>
      </div>
    </div>
  );
};
export default HalamanJawab;

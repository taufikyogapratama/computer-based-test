"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import {
  getSoal,
  simpanSoal,
  hapusSoal,
  getMetadataUjian,
  updateMetadataUjian,
} from "./EditAction";
import { Plus, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { useParams } from "next/navigation";

const emptySoal = {
  teks_soal: "",
  opsi_a: "",
  opsi_b: "",
  opsi_c: "",
  opsi_d: "",
  opsi_e: "",
  kunci_jawaban: "A",
};

const EditUjian = () => {
  const params = useParams();
  const kodeUjian = params.kode as string;
  const [soal, setSoal] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>(emptySoal);
  const [originalData, setOriginalData] = useState<any>(emptySoal);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [metaUjian, setMetaUjian] = useState({
    judul: "Memuat...",
    waktu_mulai: "",
    waktu_selesai: "",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editField, setEditField] = useState<
    "judul" | "waktu_mulai" | "waktu_selesai" | null
  >(null);
  const [tempMetaValue, setTempMetaValue] = useState("");

  const loadDataSoal = async () => {
    const meta = await getMetadataUjian(kodeUjian);
    if (meta) setMetaUjian(meta);

    const result = await getSoal(kodeUjian);
    setSoal(result);

    if (result.length > 0 && !isCreating && currentIndex === null) {
      handlePilihSoal(result[0], 0);
    } else if (result.length === 0) {
      handleModeTambah();
    }
  };

  useEffect(() => {
    loadDataSoal();
  }, []);

  const handlePilihSoal = (soalItem: any, index: number) => {
    setFormData(soalItem);
    setOriginalData(soalItem);
    setCurrentIndex(index);
    setIsCreating(false);
  };

  const handleModeTambah = () => {
    setFormData(emptySoal);
    setOriginalData(emptySoal);
    setCurrentIndex(null);
    setIsCreating(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await simpanSoal(kodeUjian, formData);

    if (res.success) {
      await loadDataSoal();
      if (isCreating) handleModeTambah();
      else setOriginalData(formData);
    } else {
      alert("Gagal: " + res.message);
    }
    setIsSaving(false);
  };

  const handleHapus = async () => {
    if (!formData.id) return;
    const yakin = window.confirm("Apakah Anda yakin ingin menghapus soal ini?");
    if (!yakin) return;

    setIsSaving(true);
    const res = await hapusSoal(formData.id);

    if (res.success) {
      const updatedSoal = await getSoal(kodeUjian);
      setSoal(updatedSoal);

      if (updatedSoal.length > 0) {
        const nextIndex =
          currentIndex !== null && currentIndex > 0 ? currentIndex - 1 : 0;
        handlePilihSoal(updatedSoal[nextIndex], nextIndex);
      } else {
        handleModeTambah();
      }
    } else {
      alert("Gagal menghapus: " + res.message);
    }
    setIsSaving(false);
  };

  const bukaDialog = (
    field: "judul" | "waktu_mulai" | "waktu_selesai",
    valueSaatIni: string,
  ) => {
    setEditField(field);

    if (field !== "judul" && valueSaatIni) {
      setTempMetaValue(valueSaatIni.substring(0, 16));
    } else {
      setTempMetaValue(valueSaatIni || "");
    }

    setIsDialogOpen(true);
  };

  const simpanMetadata = async () => {
    if (!editField) return;
    setIsSaving(true);

    const updatePayload = { [editField]: tempMetaValue };
    const res = await updateMetadataUjian(kodeUjian, updatePayload);

    if (res.success) {
      setMetaUjian((prev) => ({ ...prev, ...updatePayload }));
      setIsDialogOpen(false);
    } else {
      alert("Gagal mengubah: " + res.message);
    }
    setIsSaving(false);
  };

  const formatTanggal = (isoString: string) => {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleString("id-ID", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const isModified = JSON.stringify(formData) !== JSON.stringify(originalData);
  const showSimpanButton = isCreating || isModified;

  return (
    <div className="mt-6 flex flex-wrap gap-12 w-full items-start">
      {/* AREA KIRI: METADATA DAN NAVIGASI */}
      <aside className="w-80 shrink-0">
        <section className="metadata-ujian">
          {/* JUDUL */}
          <div className="flex gap-2 items-center justify-between">
            <p className="truncate">
              Judul: <strong>{metaUjian.judul}</strong>
            </p>
            <Button
              size="xs"
              variant="default"
              className="rounded-md shrink-0"
              onClick={() => bukaDialog("judul", metaUjian.judul)}
            >
              Edit
            </Button>
          </div>

          <div className="flex gap-2 items-center justify-between my-1">
            <p className="truncate">
              Mulai: {formatTanggal(metaUjian.waktu_mulai)}
            </p>
            <Button
              size="xs"
              variant="default"
              className="rounded-md shrink-0"
              onClick={() => bukaDialog("waktu_mulai", metaUjian.waktu_mulai)}
            >
              Edit
            </Button>
          </div>

          <div className="flex gap-2 items-center justify-between">
            <p className="truncate">
              Selesai: {formatTanggal(metaUjian.waktu_selesai)}
            </p>
            <Button
              size="xs"
              variant="default"
              className="rounded-md shrink-0"
              onClick={() =>
                bukaDialog("waktu_selesai", metaUjian.waktu_selesai)
              }
            >
              Edit
            </Button>
          </div>
          <Separator className="mt-4" />
        </section>

        <section className="daftar-soal mt-4 flex flex-col items-center">
          <p className="text-xl font-semibold text-center mb-3">Daftar Soal</p>
          <div className="soal-soal grid grid-cols-5 gap-3 h-72 overflow-y-auto pr-2 custom-scrollbar content-start justify-items-center w-full">
            {soal.map((item, index) => (
              <div
                key={item.id || index}
                onClick={() => handlePilihSoal(item, index)}
                className={`w-12 h-12 flex items-center justify-center font-semibold rounded-lg shadow-sm transition-colors cursor-pointer active:scale-95 
                  ${
                    currentIndex === index
                      ? "bg-amber-400 text-black border-2 border-black"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <Button
            onClick={handleModeTambah}
            variant="outline"
            className="w-full mt-4 border-dashed border-2 hover:bg-indigo-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Soal Baru
          </Button>
        </section>
      </aside>

      <main className="flex-1">
        {!isCreating && currentIndex !== null && (
          <p className="mb-5 font-bold text-lg">Soal no {currentIndex + 1}</p>
        )}

        {isCreating && (
          <p className="mb-5 font-bold text-lg text-indigo-600">
            Buat Soal Baru
          </p>
        )}

        <form className="w-full" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="teks_soal">Pertanyaan</FieldLabel>
              <Textarea
                id="teks_soal"
                value={formData.teks_soal}
                onChange={handleChange}
                required
                className="min-h-[100px]"
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="opsi_a">Opsi A</FieldLabel>
                <Input
                  type="text"
                  id="opsi_a"
                  value={formData.opsi_a}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="opsi_b">Opsi B</FieldLabel>
                <Input
                  type="text"
                  id="opsi_b"
                  value={formData.opsi_b}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="opsi_c">Opsi C</FieldLabel>
                <Input
                  type="text"
                  id="opsi_c"
                  value={formData.opsi_c}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="opsi_d">Opsi D</FieldLabel>
                <Input
                  type="text"
                  id="opsi_d"
                  value={formData.opsi_d}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="opsi_e">Opsi E</FieldLabel>
                <Input
                  type="text"
                  id="opsi_e"
                  value={formData.opsi_e}
                  onChange={handleChange}
                  required
                />
              </Field>
            </div>

            <div className="flex items-end justify-between gap-4 mt-6">
              <Field className="w-48">
                <FieldLabel htmlFor="kunci_jawaban">Jawaban Benar: </FieldLabel>
                <Select
                  value={formData.kunci_jawaban}
                  onValueChange={(val) =>
                    setFormData({ ...formData, kunci_jawaban: val })
                  }
                  required
                >
                  <SelectTrigger id="kunci_jawaban">
                    <SelectValue placeholder="Pilih Jawaban" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="E">E</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <div className="flex gap-3">
                {!isCreating && formData.id && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleHapus}
                    disabled={isSaving}
                    className="rounded-md"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus
                  </Button>
                )}

                {showSimpanButton && (
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-md bg-green-600 hover:bg-green-700 text-white min-w-[120px]"
                  >
                    {isSaving
                      ? "Memproses..."
                      : isCreating
                        ? "Simpan Soal Baru"
                        : "Simpan Perubahan"}
                  </Button>
                )}
              </div>
            </div>
          </FieldGroup>
        </form>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Edit{" "}
              {editField === "judul"
                ? "Judul Ujian"
                : editField === "waktu_mulai"
                  ? "Waktu Mulai"
                  : "Waktu Selesai"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex items-center space-x-2 py-4">
            <Input
              type={editField === "judul" ? "text" : "datetime-local"}
              value={tempMetaValue}
              onChange={(e) => setTempMetaValue(e.target.value)}
              className="w-full"
            />
          </div>

          <DialogFooter className="sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={simpanMetadata}
              disabled={isSaving || !tempMetaValue}
            >
              {isSaving ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditUjian;

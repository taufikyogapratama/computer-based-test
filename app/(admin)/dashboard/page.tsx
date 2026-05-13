"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

import {
  MoreVertical,
  Copy,
  Download,
  Trash2,
  SquarePen,
  AlertCircleIcon,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { GetUjian, DeleteUjian, getRekapNilai } from "./DataUjianAction";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type dataType = {
  id: string;
  judul: string;
  kode_ujian: string;
  waktu_mulai: string;
  waktu_selesai: string;
  jumlah_pengumpul: number;
};

import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

const Dashboard = () => {
  const router = useRouter();
  const [dataUjian, setDataUjian] = useState<dataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unSubmited, setUnSubmited] = useState("hidden");
  useEffect(() => {
    const fetchUjian = async () => {
      try {
        const data = await GetUjian();
        setDataUjian(data);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchUjian();
  }, []);

  const handleDelete = async (id_ujian: string) => {
    const result = await DeleteUjian(id_ujian);
    if (result.message !== "success") {
      console.log(result.message);
    }
    setDataUjian((prevData) =>
      prevData.filter((ujian) => ujian.id !== id_ujian),
    );
  };

  const handleEdit = (kode: string) => {
    router.push(`ujian/edit/${kode}`);
  };

  const handleCopy = (kode: string) => {
    router.push(`ujian/copy-ujian/${kode}`);
  };

  const handleDownload = async (id: string) => {
    try {
      const res = await getRekapNilai(Number(id));

      if (!res.success || !res.data) {
        // alert(`Gagal mengunduh data: ${res.message}`);
        return `Gagal mengunduh data: ${res.message}`;
      }

      if (res.data.length === 0) {
        // alert("Belum ada murid yang mengerjakan ujian ini.");
        setUnSubmited("");
        setTimeout(() => {
          setUnSubmited("hidden");
        }, 4000);
        return;
      }

      const formattedData = res.data.map((row: any) => ({
        NIS: row.nis,
        "Nama Lengkap": row.nama_murid,
        Kelas: row.kelas,
        "Waktu Mulai": row.waktu_mulai
          ? new Date(row.waktu_mulai).toLocaleString("id-ID")
          : "-",
        "Waktu Selesai": row.waktu_kumpul
          ? new Date(row.waktu_kumpul).toLocaleString("id-ID")
          : "Belum Selesai",
        "Nilai Akhir": row.nilai_akhir !== null ? row.nilai_akhir : "Belum Ada",
      }));

      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Nilai");

      const namaFile = `Rekap_${res.judul || "Ujian"}.xlsx`;
      XLSX.writeFile(workbook, namaFile);
    } catch (error) {
      console.error("Error download Excel:", error);
      alert("Terjadi kesalahan saat mengunduh data.");
    }
  };

  return (
    <>
      <main className="px-4 mt-4">
        <div className="text-xl mb-3 px-2 flex justify-between items-center">
          <h1 className="font-bold">Daftar Ujian</h1>
          <Button
            variant="default"
            className="bg-green-500 rounded-md text-white hover:bg-green-600"
          >
            <Link href="/ujian/buat-ujian">Buat Ujian</Link>
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25 text-mainColor">Judul Ujian</TableHead>
              <TableHead className="text-mainColor">Kode</TableHead>
              <TableHead className="text-mainColor">Waktu</TableHead>
              <TableHead className="text-mainColor text-right">
                Jumlah Pengumpul
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  Memuat data ujian...
                </TableCell>
              </TableRow>
            ) : dataUjian.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-gray-500"
                >
                  Belum ada ujian yang dibuat
                </TableCell>
              </TableRow>
            ) : (
              dataUjian.map((ujian) => (
                <TableRow key={ujian.id}>
                  <TableCell className="font-medium">{ujian.judul}</TableCell>
                  <TableCell>{ujian.kode_ujian}</TableCell>
                  <TableCell>
                    {new Date(ujian.waktu_mulai).toLocaleString("id-ID")} -{" "}
                    {new Date(ujian.waktu_selesai).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right">
                    {ujian.jumlah_pengumpul}
                  </TableCell>

                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-xl"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleCopy(ujian.kode_ujian)}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Buat ujian baru dengan soal ini
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEdit(ujian.kode_ujian)}
                        >
                          <SquarePen className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDownload(ujian.id)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download rekap nilai
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              variant="destructive"
                              onSelect={(e) => {
                                e.preventDefault();
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent size="sm">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Apakah Anda yakin?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Perubahan yang belum tersimpan tidak akan
                                tersimpan otomatis
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel variant="outline">
                                Batal
                              </AlertDialogCancel>
                              <AlertDialogAction
                                variant="destructive"
                                onClick={() => handleDelete(ujian.id)}
                              >
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </main>
      {/* Alert Alert-an Start */}
      <div className={`absolute top-1 w-full ${unSubmited}`}>
        <Alert variant="destructive" className="max-w-md mx-auto rounded-md">
          <AlertCircleIcon />
          <AlertTitle>Gagal Mengunduh</AlertTitle>
          <AlertDescription>
            Belum ada murid yang mengerjakan ujian ini.
          </AlertDescription>
        </Alert>
      </div>
      {/* Alert Alert-an End */}
    </>
  );
};

export default Dashboard;

"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

import { MoreVertical, Copy, Download, Trash2, SquarePen } from "lucide-react";

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
import { GetUjian, DeleteUjian } from "./DataUjianAction";
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
};

const Dashboard = () => {
  const [dataUjian, setDataUjian] = useState<dataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchUjian = async () => {
      try {
        const data = await GetUjian();
        setDataUjian(data);
      } catch (error) {
        // console.error("Gagal mengambil data:", error);
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

  return (
    <main className="px-4 mt-4">
      <div className="text-xl mb-3 px-2 flex justify-between items-center">
        <h1 className="font-bold">Daftar Ujian</h1>
        <Button
          asChild
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
              <TableCell colSpan={5} className="text-center py-6 text-gray-500">
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
                <TableCell className="text-right">-</TableCell>

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
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Buat ujian baru dengan soal ini
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <SquarePen className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
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
  );
};

export default Dashboard;

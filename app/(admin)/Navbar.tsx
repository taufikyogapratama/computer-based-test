"use client";

import { ModeToggle } from "@/components/modeToggle";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type props = {
  nameGuru: string;
  signOut: () => void;
};

const Navbar = (props: props) => {
  return (
    <nav className="w-screen flex justify-between items-center px-2 md:px-5 py-4 bg-mainColor">
      <p className="text-white text-sm md:text-base">
        Hi {props.nameGuru ? props.nameGuru : "Bapak/Ibu Guru"}
      </p>
      <div className="flex gap-2">
        <ModeToggle />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="rounded-md bg-red-500 text-white">Logout</Button>
          </AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
              <AlertDialogDescription>
                Perubahan yang belum tersimpan tidak akan tersimpan otomatis
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel variant="outline">Batal</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={props.signOut}>
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </nav>
  );
};

export default Navbar;

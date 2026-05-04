import type { Metadata } from "next";
import BreadcrumbUI from "./BreadcrumbUI";

export const metadata: Metadata = {
  title: "Manipulasi Ujian",
  description: "Tempat manipulasi ujian",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-5">
      <BreadcrumbUI />
      {children}
    </div>
  );
}

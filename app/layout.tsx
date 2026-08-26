import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Ayo Belajar", description: "Lembaga Bimbingan Belajar Ayo Belajar" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="id"><body>{children}</body></html>; }

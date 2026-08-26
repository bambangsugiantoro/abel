import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CertificateSheet } from "@/components/certificate-sheet";
import { PrintButton } from "@/components/print-button";

export const dynamic = "force-dynamic";

export default async function CertificatePage({
  params
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const certificate = await db.certificate.findUnique({
    where: { verificationCode: code }
  });

  if (!certificate) notFound();

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 print:bg-white print:p-0">
      <div className="mb-6 flex justify-center print:hidden">
        <PrintButton />
      </div>

      <CertificateSheet certificate={certificate} />
    </main>
  );
}
"use client";

type Data = {
  certificateNo: string;
  verificationCode: string;
  studentName: string;
  programName?: string | null;
  description: string;
  issuedAt: Date | string;
  institutionName: string;
  directorName: string;
  logoUrl?: string | null;
  signatureUrl?: string | null;
};

export function CertificateSheet({
  certificate
}: {
  certificate: Data;
}) {
  const date = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(certificate.issuedAt));

  return (
    <section className="certificate mx-auto min-h-[210mm] w-[297mm] bg-white p-[14mm] text-slate-800 shadow-2xl print:shadow-none">
      <div className="flex min-h-[182mm] flex-col border-[3px] border-emerald-700 p-[12mm] outline outline-[8px] outline-emerald-100">
        <header className="flex items-center justify-between border-b border-emerald-200 pb-5">
          <div className="flex items-center gap-4">
            {certificate.logoUrl ? (
              <img
                src={certificate.logoUrl}
                alt="Logo lembaga"
                className="h-16 w-16 object-contain"
              />
            ) : (
              <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-700 font-serif text-2xl font-bold text-white">
                AB
              </div>
            )}

            <div>
              <p className="text-xs font-bold uppercase tracking-[.25em] text-emerald-700">
                Lembaga Bimbingan Belajar
              </p>
              <h1 className="font-serif text-3xl font-bold text-slate-950">
                {certificate.institutionName}
              </h1>
            </div>
          </div>

          <p className="text-right text-xs text-slate-500">
            No. Sertifikat
            <br />
            <span className="font-semibold text-slate-800">
              {certificate.certificateNo}
            </span>
          </p>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="font-serif text-2xl font-extrabold italic text-emerald-800">
            Penghargaan diberikan kepada:
          </p>

          <h2 className="mt-5 border-b-2 border-emerald-600 px-10 pb-3 font-serif text-5xl font-bold text-slate-950">
            {certificate.studentName}
          </h2>

          {certificate.programName && (
            <p className="mt-6 text-lg font-semibold text-emerald-800">
              {certificate.programName}
            </p>
          )}

          <p className="mt-5 max-w-3xl whitespace-pre-line text-lg leading-relaxed text-slate-700">
            {certificate.description}
          </p>
        </main>

        <footer className="grid grid-cols-2 items-end gap-8 pt-8 text-center">
          <div className="text-sm text-slate-600">
            Diterbitkan pada
            <br />
            <span className="font-semibold text-slate-900">{date}</span>
          </div>

          <div>
            {certificate.signatureUrl ? (
              <img
                src={certificate.signatureUrl}
                alt={`Tanda tangan ${certificate.directorName}`}
                className="mx-auto h-16 w-auto object-contain"
              />
            ) : (
              <div className="h-16" />
            )}

            <div className="mx-auto w-52 border-t border-slate-500 pt-2 text-sm font-bold text-slate-900">
              {certificate.directorName}
            </div>

            <p className="mt-1 text-xs text-slate-500">Direktur</p>
          </div>
        </footer>

        <p className="mt-7 text-center text-[10px] text-slate-400">
          Verifikasi: /sertifikat/{certificate.verificationCode}
        </p>
      </div>
    </section>
  );
}
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
    <section className="certificate mx-auto min-h-[210mm] w-[297mm] overflow-hidden bg-[#fbf7ed] p-[10mm] text-slate-800 shadow-2xl print:shadow-none">
      <div className="relative flex min-h-[190mm] flex-col overflow-hidden border-2 border-[#b58a35] bg-[radial-gradient(circle_at_14%_10%,rgba(255,255,255,0.96),rgba(251,247,237,0.97)_44%,rgba(239,228,201,0.92))] p-[14mm] outline outline-[6px] outline-[#e7d39f]">
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full border-[18px] border-[#d7b664]/20" />
        <div className="pointer-events-none absolute -bottom-28 -right-24 h-80 w-80 rounded-full border-[22px] border-[#d7b664]/20" />
        <div className="pointer-events-none absolute inset-[7mm] border border-[#b58a35]/35" />

        <header className="relative flex items-center justify-between border-b border-[#cba85a]/60 pb-5">
          <div className="flex items-center gap-4">
            {certificate.logoUrl ? (
              <img
                src={certificate.logoUrl}
                alt="Logo lembaga"
                className="h-16 w-16 rounded-full object-contain"
              />
            ) : (
              <div className="grid h-16 w-16 place-items-center rounded-full border-2 border-[#b58a35] bg-[#174a43] font-serif text-2xl font-bold text-[#f7e6ae]">
                AB
              </div>
            )}

            <div>
              <p className="font-serif text-2xl font-extrabold tracking-wide text-[#174a43]">
                {certificate.institutionName}
              </p>
              <div className="mt-1 h-px w-28 bg-[#b58a35]" />
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7f6427]">
              Nomor Sertifikat
            </p>
            <p className="mt-1 font-serif text-sm font-bold text-slate-800">
              {certificate.certificateNo}
            </p>
          </div>
        </header>

        <main className="relative flex flex-1 flex-col items-center justify-center py-8 text-center">
          <p className="font-serif text-xl font-extrabold italic text-[#174a43]">
            Penghargaan diberikan kepada:
          </p>

          <div className="mt-5 flex w-full max-w-[220mm] items-center gap-5">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#b58a35]" />
            <span className="h-2 w-2 rotate-45 border border-[#b58a35] bg-[#f7e6ae]" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#b58a35]" />
          </div>

          <h2 className="mt-5 max-w-[230mm] font-serif text-5xl font-bold leading-tight text-[#173d37]">
            {certificate.studentName}
          </h2>

          <div className="mt-5 h-0.5 w-44 bg-[#b58a35]" />

          {certificate.programName && (
            <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.18em] text-[#8a6928]">
              {certificate.programName}
            </p>
          )}

          <p className="mt-5 max-w-3xl whitespace-pre-line font-serif text-lg leading-relaxed text-slate-700">
            {certificate.description}
          </p>
        </main>

        <footer className="relative grid grid-cols-2 items-end gap-8 border-t border-[#cba85a]/60 pt-7 text-center">
          <div className="text-sm text-slate-600">
            <p className="font-semibold text-[#174a43]">Diterbitkan pada</p>
            <p className="mt-1 font-serif text-base font-bold text-slate-900">{date}</p>
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

            <div className="mx-auto w-52 border-t border-[#8a6928] pt-2 font-serif text-sm font-bold text-slate-900">
              {certificate.directorName}
            </div>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#7f6427]">
              Direktur
            </p>
          </div>
        </footer>

        <p className="relative mt-6 text-center text-[10px] text-slate-500">
          Verifikasi: /sertifikat/{certificate.verificationCode}
        </p>
      </div>
    </section>
  );
}

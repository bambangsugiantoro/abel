import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ProgramPage() {
  const programs = await db.program.findMany({
    where: {
      status: "PUBLISHED"
    },
    orderBy: [
      { sortOrder: "asc" },
      { createdAt: "desc" }
    ]
  });

  return (
    <main className="min-h-screen bg-emerald-50">
      <header className="border-b border-emerald-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-extrabold text-emerald-700">
            ayo belajar
          </Link>

          <Link
            href="/lokasi"
            className="text-sm font-bold text-emerald-800"
          >
            Lokasi Unit
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
          Program Ayo Belajar
        </p>

        <h1 className="mt-3 text-4xl font-bold text-slate-950">
          Program belajar untuk setiap target prestasi
        </h1>

        <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <article
              key={program.id}
              className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-emerald-100"
            >
              {program.imageUrl ? (
                <img
                  src={program.imageUrl}
                  alt={program.title}
                  className="h-52 w-full object-cover"
                />
              ) : (
                <div className="h-52 bg-gradient-to-br from-emerald-700 to-emerald-400" />
              )}

              <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-950">
                  {program.title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {program.shortDesc || program.description}
                </p>

                <a
                  href="#kontak"
                  className="mt-6 inline-block font-bold text-emerald-700"
                >
                  Konsultasi Program →
                </a>
              </div>
            </article>
          ))}
        </div>

        {programs.length === 0 && (
          <div className="mt-10 rounded-3xl border border-dashed border-emerald-200 bg-white p-10 text-center text-slate-500">
            Program akan segera diperbarui oleh Ayo Belajar.
          </div>
        )}
      </main>
    </main>
  );
}
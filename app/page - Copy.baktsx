import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <header className="border-b border-emerald-100 bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-2xl font-extrabold text-emerald-700"
          >
                      </Link>

          <div className="hidden gap-6 text-sm font-semibold text-slate-700 md:flex">
            <a href="#tentang">Tentang</a>

            <Link href="/program">Program</Link>

            <Link href="/lokasi">Lokasi</Link>

            <a href="#kontak">Kontak</a>
          </div>

          <Link
            href="/admin/login"
            className="rounded-xl border border-emerald-200 px-4 py-2 text-sm font-bold text-emerald-800"
          >
            Admin
          </Link>
        </nav>
      </header>

      <section className="bg-gradient-to-br from-white via-emerald-50 to-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-24 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-bold uppercase tracking-[.22em] text-emerald-700">
              Lembaga Bimbingan Belajar
            </p>

            <h1 className="mt-4 text-5xl font-extrabold leading-tight tracking-tight text-slate-950">
              Belajar lebih terarah.{" "}
              <span className="text-emerald-700">Prestasi lebih dekat.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Ayo Belajar mendampingi peserta didik dengan program terukur,
              mentor berkualitas, dan lingkungan belajar yang positif.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/program"
                className="rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white"
              >
                Lihat Program
              </Link>

              <Link
                href="/lokasi"
                className="rounded-xl border border-emerald-200 bg-white px-5 py-3 font-semibold text-emerald-800"
              >
                Temukan Unit
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-xl shadow-emerald-900/5">
            <p className="text-sm font-semibold text-emerald-700">
              Keunggulan Ayo Belajar
            </p>

            <ul className="mt-5 space-y-4 text-slate-700">
              <li>Program belajar sesuai kebutuhan siswa</li>
              <li>Unit yang mudah dijangkau</li>
              <li>Metode belajar asyik dan nyaman </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="tentang" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-bold">
          Belajar dengan pendampingan terbaik
        </h2>

        <p className="mt-4 max-w-3xl leading-7 text-slate-600">
        
        </p>
      </section>

      <footer id="kontak" className="bg-emerald-900 px-6 py-10 text-emerald-50">
        <div className="mx-auto max-w-6xl">
          <p className="text-xl font-bold"></p>

          <p className="mt-2 text-emerald-100">
            Lokasi bimbingan belajar di unit terdekat
          </p>
        </div>
      </footer>
    </main>
  );
}
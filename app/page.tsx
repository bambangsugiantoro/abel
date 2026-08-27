import Link from "next/link";

const whatsappUrl =
  "https://wa.me/6287880724907?text=Halo%20Ayo%20Belajar%2C%20saya%20ingin%20bertanya%20tentang%20program%20belajar.";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-emerald-950/10 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 lg:px-6">
          <Link href="/" className="text-xl font-extrabold tracking-tight text-emerald-800 sm:text-2xl">
            Ayo Belajar
          </Link>

          <div className="hidden items-center gap-6 text-sm font-semibold text-slate-700 md:flex">
            <a className="transition hover:text-emerald-700" href="#tentang">Tentang</a>
            <Link className="transition hover:text-emerald-700" href="/program">Program</Link>
            <Link className="transition hover:text-emerald-700" href="/lokasi">Lokasi</Link>
            <a className="transition hover:text-emerald-700" href="#informasi">Informasi</a>
            <a className="transition hover:text-emerald-700" href="#kontak">Kontak</a>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-800 sm:px-4 sm:text-sm"
          >
            Daftar Sekarang
          </a>
        </nav>
      </header>

      <section className="relative isolate overflow-hidden bg-emerald-950">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700" />
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-yellow-300/15 blur-3xl" />
        <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-cyan-300/15 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.3fr_0.7fr] lg:items-center lg:py-28">
          <div>
            <p className="font-bold uppercase tracking-[0.2em] text-emerald-200">Lembaga Bimbingan Belajar</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Belajar lebih terarah.
              <span className="block text-yellow-300">Prestasi lebih dekat.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-emerald-50 sm:text-lg">
              Ayo Belajar mendampingi peserta didik dengan program terukur, mentor berkualitas, dan lingkungan belajar yang positif untuk mencapai potensi terbaiknya.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/program" className="rounded-xl bg-yellow-300 px-5 py-3 font-bold text-emerald-950 transition hover:bg-yellow-200">
                Lihat Program
              </Link>
              <Link href="/lokasi" className="rounded-xl border border-white/40 bg-white/10 px-5 py-3 font-bold text-white transition hover:bg-white/20">
                Temukan Unit
              </Link>
            </div>
          </div>

          <aside className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
            <p className="text-sm font-bold uppercase tracking-wider text-yellow-300">Pendaftaran Dibuka</p>
            <h2 className="mt-3 text-2xl font-extrabold text-white">Siapkan langkah terbaik untuk masa depan anak.</h2>
            <p className="mt-4 leading-7 text-emerald-50">Konsultasikan kebutuhan belajar putra-putri Anda bersama tim Ayo Belajar.</p>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 font-bold text-emerald-800 transition hover:bg-emerald-50">
              Konsultasi via WhatsApp
            </a>
          </aside>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-7 grid max-w-6xl gap-4 px-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <Link href="/program" className="rounded-xl bg-white p-5 shadow-lg ring-1 ring-slate-200 transition hover:-translate-y-1 hover:ring-emerald-400">
          <p className="text-sm font-bold text-emerald-700">01</p>
          <h2 className="mt-2 text-lg font-extrabold">Program Belajar</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">Pilih program sesuai kebutuhan siswa.</p>
        </Link>
        <Link href="/lokasi" className="rounded-xl bg-white p-5 shadow-lg ring-1 ring-slate-200 transition hover:-translate-y-1 hover:ring-emerald-400">
          <p className="text-sm font-bold text-emerald-700">02</p>
          <h2 className="mt-2 text-lg font-extrabold">Unit Terdekat</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">Temukan lokasi belajar yang mudah dijangkau.</p>
        </Link>
        <a href="#informasi" className="rounded-xl bg-white p-5 shadow-lg ring-1 ring-slate-200 transition hover:-translate-y-1 hover:ring-emerald-400">
          <p className="text-sm font-bold text-emerald-700">03</p>
          <h2 className="mt-2 text-lg font-extrabold">Informasi</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">Pengumuman dan agenda Ayo Belajar.</p>
        </a>
        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="rounded-xl bg-yellow-300 p-5 shadow-lg transition hover:-translate-y-1 hover:bg-yellow-200">
          <p className="text-sm font-bold text-emerald-800">04</p>
          <h2 className="mt-2 text-lg font-extrabold text-emerald-950">Hubungi Kami</h2>
          <p className="mt-1 text-sm leading-6 text-emerald-900">Konsultasi program melalui WhatsApp.</p>
        </a>
      </section>

      <section id="tentang" className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="font-bold uppercase tracking-[0.2em] text-emerald-700">Tentang Ayo Belajar</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">Pendampingan belajar yang terarah dan menyenangkan.</h2>
          </div>
          <div className="space-y-4 text-lg leading-8 text-slate-600">
            <p>Ayo Belajar adalah lembaga bimbingan belajar yang membantu siswa berkembang melalui proses belajar yang terukur, nyaman, dan sesuai kebutuhan masing-masing.</p>
            <p>Kami percaya setiap peserta didik memiliki potensi. Karena itu, pembelajaran dirancang untuk membangun pemahaman, kepercayaan diri, kedisiplinan, dan semangat berprestasi.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-emerald-100 bg-emerald-50">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-14 sm:grid-cols-3 sm:px-6">
          <div>
            <p className="text-4xl font-extrabold text-emerald-800">+</p>
            <p className="mt-2 font-bold text-slate-900">Program Terarah</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">Materi dan pendampingan sesuai kebutuhan belajar.</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-emerald-800">+</p>
            <p className="mt-2 font-bold text-slate-900">Mentor Berkualitas</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">Pengajar yang mendampingi proses belajar siswa.</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-emerald-800">+</p>
            <p className="mt-2 font-bold text-slate-900">Tiga Lokasi</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">Cawan, Bejen, dan Gunungan untuk pilihan belajar yang terjangkau.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="font-bold uppercase tracking-[0.2em] text-emerald-700">Program Pilihan</p>
            <h2 className="mt-3 text-3xl font-extrabold">Temukan program yang tepat.</h2>
          </div>
          <Link href="/program" className="font-bold text-emerald-700 transition hover:text-emerald-900">Lihat semua program →</Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-bold text-emerald-700">PROGRAM 01</p>
            <h3 className="mt-3 text-xl font-extrabold">Pendampingan Akademik</h3>
            <p className="mt-3 leading-7 text-slate-600">Bimbingan untuk memperkuat pemahaman materi pelajaran dan membangun kebiasaan belajar yang baik.</p>
          </article>
          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-bold text-emerald-700">PROGRAM 02</p>
            <h3 className="mt-3 text-xl font-extrabold">Persiapan Ujian</h3>
            <p className="mt-3 leading-7 text-slate-600">Latihan terarah dan strategi belajar untuk membantu siswa menghadapi evaluasi akademik.</p>
          </article>
          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-bold text-emerald-700">PROGRAM 03</p>
            <h3 className="mt-3 text-xl font-extrabold">Kelas Pengembangan</h3>
            <p className="mt-3 leading-7 text-slate-600">Program pembelajaran yang membantu siswa tumbuh percaya diri dan siap menghadapi tantangan.</p>
          </article>
        </div>
      </section>

      <section id="informasi" className="bg-slate-950 px-5 py-20 text-white sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="font-bold uppercase tracking-[0.2em] text-yellow-300">Informasi Ayo Belajar</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
            <h2 className="max-w-2xl text-3xl font-extrabold sm:text-4xl">Pengumuman dan informasi untuk siswa serta orang tua.</h2>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="rounded-xl border border-white/30 px-5 py-3 font-bold transition hover:bg-white hover:text-slate-950">Tanya Informasi</a>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <article className="rounded-xl border border-white/15 bg-white/5 p-6">
              <p className="text-sm font-bold text-yellow-300">PENGUMUMAN</p>
              <h3 className="mt-3 text-xl font-bold">Pendaftaran peserta didik dibuka</h3>
              <p className="mt-3 leading-7 text-slate-300">Hubungi tim Ayo Belajar untuk informasi kelas, jadwal, dan lokasi yang tersedia.</p>
            </article>
            <article className="rounded-xl border border-white/15 bg-white/5 p-6">
              <p className="text-sm font-bold text-yellow-300">INFORMASI</p>
              <h3 className="mt-3 text-xl font-bold">Konsultasi kebutuhan belajar</h3>
              <p className="mt-3 leading-7 text-slate-300">Diskusikan kebutuhan pendampingan belajar putra-putri Anda bersama kami.</p>
            </article>
            <article className="rounded-xl border border-white/15 bg-white/5 p-6">
              <p className="text-sm font-bold text-yellow-300">LOKASI</p>
              <h3 className="mt-3 text-xl font-bold">Tiga unit Ayo Belajar</h3>
              <p className="mt-3 leading-7 text-slate-300">Cawan Widodomartani, Bejen Bantul Kota, serta Gunungan Pleret Bantul.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="kontak" className="bg-emerald-800 px-5 py-16 text-white sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="font-bold uppercase tracking-[0.2em] text-emerald-200">Hubungi Kami</p>
            <h2 className="mt-3 text-3xl font-extrabold">Mari mulai perjalanan belajar yang lebih baik.</h2>
            <p className="mt-4 max-w-2xl leading-7 text-emerald-50">Lokasi Ayo Belajar tersedia di Cawan, Widodomartani; Bejen, Bantul Kota; serta Gunungan, Pleret, Bantul.</p>
          </div>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-xl bg-yellow-300 px-6 py-4 font-extrabold text-emerald-950 transition hover:bg-yellow-200">
            WhatsApp: 087880724907
          </a>
        </div>
      </section>

      <footer className="bg-emerald-950 px-5 py-7 text-sm text-emerald-100 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3">
          <p>© {new Date().getFullYear()} Ayo Belajar. Semua hak dilindungi.</p>
          <Link href="/admin/login" className="transition hover:text-white">Admin</Link>
        </div>
      </footer>
    </main>
  );
}

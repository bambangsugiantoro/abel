"use client";

import { useEffect, useState } from "react";

type Program = {
  id: string;
  title: string;
  slug: string;
  shortDesc?: string | null;
  description: string;
  imageUrl?: string | null;
  status: "DRAFT" | "PUBLISHED";
  sortOrder: number;
};

const blankProgram = {
  title: "",
  slug: "",
  shortDesc: "",
  description: "",
  imageUrl: "",
  status: "DRAFT",
  sortOrder: 0
};

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [form, setForm] = useState<any>(blankProgram);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadPrograms() {
    const response = await fetch("/api/admin/programs");

    if (response.ok) {
      setPrograms(await response.json());
    }
  }

  useEffect(() => {
    loadPrograms();
  }, []);

  function setField(key: string, value: string | number) {
    setForm((current: any) => ({
      ...current,
      [key]: value
    }));
  }

  async function saveProgram(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/admin/programs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        sortOrder: Number(form.sortOrder)
      })
    });

    setLoading(false);

    if (!response.ok) {
      setMessage(
        "Program gagal disimpan. Pastikan slug benar dan URL gambar menggunakan HTTPS."
      );
      return;
    }

    setMessage("Program berhasil disimpan.");
    setForm(blankProgram);
    await loadPrograms();
  }

  async function deleteProgram(id: string) {
    const confirmed = window.confirm(
      "Hapus program ini? Tindakan ini tidak dapat dibatalkan."
    );

    if (!confirmed) return;

    const response = await fetch(`/api/admin/programs?id=${id}`, {
      method: "DELETE"
    });

    setMessage(
      response.ok
        ? "Program berhasil dihapus."
        : "Program gagal dihapus. Hanya Super Admin yang dapat menghapus."
    );

    await loadPrograms();
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <a href="/admin" className="font-bold text-emerald-700">
          ← Kembali ke Dashboard
        </a>

        <div className="mt-5">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
            Content Management
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            Kelola Program Belajar
          </h1>
          <p className="mt-2 text-slate-600">
            Tambah, edit, terbitkan, atau hapus program beserta narasi dan URL gambar.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <form
            onSubmit={saveProgram}
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <h2 className="text-xl font-bold">
              {form.id ? "Edit Program" : "Tambah Program"}
            </h2>

            {message && (
              <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">
                {message}
              </p>
            )}

            <div className="mt-5 grid gap-4">
              <label className="text-sm font-bold">
                Nama Program
                <input
                  required
                  value={form.title}
                  onChange={(event) => setField("title", event.target.value)}
                  placeholder="Contoh: Intensif Persiapan UTBK"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </label>

              <label className="text-sm font-bold">
                Slug Program
                <input
                  required
                  value={form.slug}
                  onChange={(event) => setField("slug", event.target.value)}
                  placeholder="contoh-intensif-utbk"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3"
                />
                <span className="mt-1 block text-xs font-normal text-slate-500">
                  Gunakan huruf kecil, angka, dan tanda minus saja.
                </span>
              </label>

              <label className="text-sm font-bold">
                Ringkasan
                <textarea
                  value={form.shortDesc}
                  onChange={(event) =>
                    setField("shortDesc", event.target.value)
                  }
                  rows={3}
                  placeholder="Ringkasan singkat yang tampil pada kartu program."
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </label>

              <label className="text-sm font-bold">
                Narasi Lengkap
                <textarea
                  required
                  value={form.description}
                  onChange={(event) =>
                    setField("description", event.target.value)
                  }
                  rows={7}
                  placeholder="Jelaskan tujuan, peserta, metode belajar, jadwal, dan keunggulan program."
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </label>

              <label className="text-sm font-bold">
                URL Gambar Program
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(event) => setField("imageUrl", event.target.value)}
                  placeholder="https://res.cloudinary.com/.../gambar.jpg"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3"
                />
                <span className="mt-1 block text-xs font-normal text-slate-500">
                  Gunakan URL gambar HTTPS dari Cloudinary atau Vercel Blob.
                </span>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="text-sm font-bold">
                  Status
                  <select
                    value={form.status}
                    onChange={(event) => setField("status", event.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Terbitkan</option>
                  </select>
                </label>

                <label className="text-sm font-bold">
                  Urutan Tampil
                  <input
                    type="number"
                    min="0"
                    value={form.sortOrder}
                    onChange={(event) =>
                      setField("sortOrder", event.target.value)
                    }
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3"
                  />
                </label>
              </div>

              <button
                disabled={loading}
                className="rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white hover:bg-emerald-800 disabled:opacity-60"
              >
                {loading ? "Menyimpan..." : "Simpan Program"}
              </button>
            </div>
          </form>

          <section>
            <h2 className="text-xl font-bold text-slate-950">
              Daftar Program
            </h2>

            <div className="mt-5 grid gap-4">
              {programs.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-slate-500">
                  Belum ada program. Tambahkan program pertama dari formulir di samping.
                </div>
              )}

              {programs.map((program) => (
                <article
                  key={program.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
                >
                  {program.imageUrl && (
                    <img
                      src={program.imageUrl}
                      alt={program.title}
                      className="h-40 w-full object-cover"
                    />
                  )}

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                          {program.status === "PUBLISHED" ? "TERBIT" : "DRAFT"}
                        </p>
                        <h3 className="mt-1 text-xl font-bold">{program.title}</h3>
                      </div>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        Urutan {program.sortOrder}
                      </span>
                    </div>

                    {program.shortDesc && (
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {program.shortDesc}
                      </p>
                    )}

                    <div className="mt-5 flex gap-3">
                      <button
                        onClick={() => setForm(program)}
                        className="rounded-lg border border-emerald-200 px-4 py-2 text-sm font-bold text-emerald-800"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteProgram(program.id)}
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-700"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
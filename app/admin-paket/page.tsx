'use client';

import React, { useState, useEffect } from 'react';

export default function AdminPaketPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [shortDesc, setShortDesc] = useState('');

  const ADMIN_PASS = 'AyoBelajar2026';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASS) {
      setIsAuth(true);
      fetchPrograms();
    } else {
      setAuthError('Password salah!');
    }
  };

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/paket');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPrograms(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId('');
    setTitle('');
    setPrice('');
    setShortDesc('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const body = isEditing 
      ? { id: currentId, title, price: Number(price), shortDesc }
      : { title, price: Number(price), shortDesc };

    const res = await fetch('/api/admin/paket', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      alert(isEditing ? 'Paket berhasil diubah!' : 'Paket baru berhasil ditambahkan!');
      resetForm();
      fetchPrograms();
    } else {
      alert(data.error || 'Gagal menyimpan paket');
    }
  };

  const handleEdit = (prog: any) => {
    setIsEditing(true);
    setCurrentId(prog.id);
    setTitle(prog.title || '');
    setPrice(prog.price || 0);
    setShortDesc(prog.shortDesc || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus paket ini? Siswa tidak akan bisa memilih paket ini lagi.')) return;
    const res = await fetch(`/api/admin/paket?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchPrograms();
    } else {
      alert('Gagal menghapus paket');
    }
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-sm w-full bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Login Admin Bimbel</h2>
          {authError && <p className="mb-3 text-xs text-red-600 bg-red-50 p-2 rounded text-center">{authError}</p>}
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-600">Password Admin</label>
              <input
                type="password"
                required
                placeholder="Masukkan password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="mt-1 w-full p-2.5 border rounded-lg text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm transition"
            >
              Buka Pengelola Paket
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div>
            <h1 className="text-xl font-black text-gray-800">Pengelola Paket Bimbel</h1>
            <p className="text-xs text-gray-500">Tambah, ubah harga, atau hapus paket bimbel</p>
          </div>
          <button
            onClick={() => setIsAuth(false)}
            className="px-3 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
          >
            Logout
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-base font-bold text-gray-800 mb-4">
            {isEditing ? '✏️ Edit Paket' : '➕ Tambah Paket Bimbel Baru'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700">Nama Paket</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Paket Konsultasi Belajar"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full p-2.5 border rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Harga (Rp)</label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 10000"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="mt-1 w-full p-2.5 border rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700">Keterangan / Benefit Singkat</label>
              <textarea
                rows={2}
                placeholder="Contoh: Bimbingan tatap muka, konsultasi PR, latihan soal..."
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                className="mt-1 w-full p-2.5 border rounded-lg text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm transition"
              >
                {isEditing ? 'Simpan Perubahan' : 'Terbitkan Paket'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 bg-gray-200 text-gray-700 font-bold rounded-lg text-sm"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 text-sm">Daftar Paket Aktif</h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
              {programs.length} Paket
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase border-b">
                <tr>
                  <th className="p-4">Nama Paket</th>
                  <th className="p-4">Harga</th>
                  <th className="p-4">Keterangan</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {programs.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-800">{p.title}</td>
                    <td className="p-4 font-black text-emerald-600">
                      Rp {(Number(p.price) || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="p-4 text-gray-500 text-xs max-w-xs truncate">{p.shortDesc || '-'}</td>
                    <td className="p-4 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded font-semibold text-xs hover:bg-amber-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="px-2.5 py-1 bg-red-100 text-red-700 rounded font-semibold text-xs hover:bg-red-200"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {programs.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="text-center p-8 text-gray-400 text-xs">
                      Belum ada paket bimbel yang ditambahkan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

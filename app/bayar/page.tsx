'use client';

import React, { useState, useEffect } from 'react';

function getCheckoutUrl(response: any): string {
  if (!response) return '';
  let url = '';
  const search = (item: any) => {
    if (!item) return;
    if (
      typeof item === 'string' &&
      item.startsWith('http') &&
      (item.includes('checkout') || item.includes('pymnt') || item.includes('pay') || item.includes('invoice'))
    ) {
      if (!url) url = item;
    } else if (typeof item === 'object') {
      for (const k of Object.keys(item)) search(item[k]);
    }
  };
  search(response);
  return url;
}

export default function HalamanKasirMewah() {
  const [daftarPaket, setDaftarPaket] = useState<any[]>([]);
  const [paketPilihan, setPaketPilihan] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);

  // Panel Admin
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState<number | ''>('');
  const [newDesc, setNewDesc] = useState('');
  const [saving, setSaving] = useState(false);

  const loadPaket = async () => {
    try {
      const res = await fetch('/api/paket', { cache: 'no-store' });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setDaftarPaket(data);
        setPaketPilihan(data[0]);
      } else {
        setDaftarPaket([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadPaket();
  }, []);

  const handleBuatQRIS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paketPilihan) return alert('Silakan pilih program terlebih dahulu');

    setLoading(true);
    try {
      const res = await fetch('/api/bayar-qris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: 'Customer Premium',
          whatsapp: '08123456789',
          paket: paketPilihan.title,
          nominal: Number(paketPilihan.price),
        }),
      });

      const data = await res.json();
      const checkoutUrl = getCheckoutUrl(data);

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        alert(data.error || 'Gagal membuat QRIS');
        setLoading(false);
      }
    } catch {
      alert('Gagal menghubungi gateway pembayaran');
      setLoading(false);
    }
  };

  const handleTambahPaket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return alert('Nama dan nominal biaya wajib diisi');

    setSaving(true);
    try {
      const res = await fetch('/api/paket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          price: Number(newPrice),
          shortDesc: newDesc,
          adminKey: passInput,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert('Program berhasil ditambahkan!');
        setNewTitle('');
        setNewPrice('');
        setNewDesc('');
        loadPaket();
      } else {
        alert(data.error || 'Gagal menambahkan');
      }
    } catch {
      alert('Gagal menghubungi server');
    } finally {
      setSaving(false);
    }
  };

  const handleHapusPaket = async (id: string) => {
    if (!confirm('Hapus program ini dari katalog?')) return;
    try {
      const res = await fetch(`/api/paket?id=${id}&adminKey=${passInput}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        loadPaket();
      } else {
        alert(data.error || 'Gagal menghapus');
      }
    } catch {
      alert('Gagal menghapus');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50/60 via-slate-50 to-emerald-50/40 text-slate-800 py-12 px-4 flex items-center justify-center font-sans antialiased selection:bg-amber-200">
      <div className="max-w-md w-full space-y-5">
        
        {/* KARTU UTAMA MEWAH (CERAH) */}
        <div className="bg-white/95 backdrop-blur-2xl border border-white/80 rounded-3xl p-7 sm:p-8 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.08),0_1px_3px_rgba(0,0,0,0.05)] relative overflow-hidden ring-1 ring-slate-900/5">
          {/* Aksen Kilau Mewah di Atas */}
          <div className="absolute -top-20 -right-20 w-44 h-44 bg-gradient-to-br from-amber-300/25 to-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-gradient-to-tr from-emerald-300/20 to-teal-300/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-7 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-bold uppercase tracking-widest mb-3 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Sistem Pembayaran Instan
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Checkout QRIS</h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">Pilih program pelatihan & selesaikan transaksi resmi</p>
          </div>

          <form onSubmit={handleBuatQRIS} className="space-y-6 relative z-10">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">PILIH PROGRAM TERSEDIA</span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  {daftarPaket.length} Program
                </span>
              </div>

              {loadingData ? (
                <div className="p-8 border border-slate-200 bg-slate-50/50 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-500">
                  <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-semibold">Memuat katalog resmi...</span>
                </div>
              ) : daftarPaket.length === 0 ? (
                <div className="p-8 border border-dashed border-slate-300 bg-slate-50 rounded-2xl text-center">
                  <p className="text-xs font-semibold text-slate-600">Belum ada program aktif.</p>
                  <p className="text-[11px] text-slate-400 mt-1">Buka panel pengelola di bawah untuk menambah paket.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {daftarPaket.map((p) => {
                    const isSelected = paketPilihan?.id === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setPaketPilihan(p)}
                        className={`group relative p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-gradient-to-r from-emerald-50/90 to-teal-50/70 border-emerald-600 shadow-md shadow-emerald-600/10'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-sm'
                        }`}
                      >
                        <div className="space-y-1 max-w-[65%]">
                          <p className={`text-sm font-bold tracking-tight transition ${isSelected ? 'text-emerald-950' : 'text-slate-800'}`}>
                            {p.title}
                          </p>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] uppercase font-bold tracking-wide text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                              {p.shortDesc || 'Reguler'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-base font-black tracking-tight ${isSelected ? 'text-emerald-700' : 'text-slate-900'}`}>
                            Rp {(Number(p.price) || 0).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Ringkasan Biaya Mewah */}
            {paketPilihan && (
              <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-2 shadow-inner">
                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>Program</span>
                  <span className="font-bold text-slate-800 truncate max-w-[65%] text-right">{paketPilihan.title}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>Metode Transaksi</span>
                  <span className="font-bold text-slate-800">QRIS Dinamis (Otomatis)</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-xs font-black text-slate-600 uppercase tracking-wider">Total Pembayaran</span>
                  <span className="text-2xl font-black text-emerald-700 tracking-tight">
                    Rp {(Number(paketPilihan.price) || 0).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            )}

            {/* Tombol Eksekutif Emas/Zamrud */}
            <button
              type="submit"
              disabled={loading || daftarPaket.length === 0}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-2xl shadow-lg shadow-emerald-700/25 active:scale-[0.99] transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Mempersiapkan QRIS...</span>
                </>
              ) : (
                <span>Buka QRIS Sekarang ⚡</span>
              )}
            </button>
          </form>
        </div>

        {/* ADMIN TOGGLE */}
        <div className="text-center">
          <button
            onClick={() => setShowAdmin(!showAdmin)}
            className="text-xs text-slate-400 hover:text-slate-700 font-bold transition"
          >
            {showAdmin ? '✕ Tutup Pengelola' : '⚙️ Kelola Katalog Program (Admin)'}
          </button>
        </div>

        {/* MODAL / PANEL ADMIN (CERAH) */}
        {showAdmin && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl relative z-10">
            {!isAdminAuth ? (
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600">Autentikasi Admin</h3>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="Masukkan sandi..."
                    value={passInput}
                    onChange={(e) => setPassInput(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  />
                  <button
                    onClick={() => {
                      if (passInput === 'abelcawangununganbejen') setIsAdminAuth(true);
                      else alert('Sandi admin salah!');
                    }}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition"
                  >
                    Buka
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-black uppercase tracking-wider text-emerald-700">➕ Tambah Program Baru</h3>
                </div>

                <form onSubmit={handleTambahPaket} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600">Nama Program / Pelatihan</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: PELATIHAN PENGEMBANG WEB PRATAMA"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600">Biaya / Harga (Rp)</label>
                    <input
                      type="number"
                      required
                      placeholder="Contoh: 3000000"
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600">Keterangan / Durasi</label>
                    <input
                      type="text"
                      placeholder="Contoh: 2 HARI"
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-sm disabled:opacity-50"
                  >
                    {saving ? 'Menyimpan...' : 'Simpan & Publikasikan'}
                  </button>
                </form>

                <h3 className="text-xs font-black uppercase tracking-wider text-slate-600 pt-3 border-t border-slate-100">
                  Katalog Aktif
                </h3>
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {daftarPaket.map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    >
                      <div className="max-w-[70%]">
                        <p className="font-bold text-slate-800 truncate">{p.title}</p>
                        <p className="text-emerald-700 font-extrabold">Rp {(Number(p.price) || 0).toLocaleString('id-ID')}</p>
                      </div>
                      <button
                        onClick={() => handleHapusPaket(p.id)}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg text-[10px] transition border border-red-200"
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

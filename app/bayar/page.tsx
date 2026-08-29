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

export default function HalamanKasirModern() {
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
    if (!paketPilihan) return alert('Silakan pilih salah satu program terlebih dahulu');

    setLoading(true);
    try {
      const res = await fetch('/api/bayar-qris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: 'Pelanggan POS',
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
      alert('Gagal terhubung ke gateway pembayaran');
      setLoading(false);
    }
  };

  const handleTambahPaket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return alert('Nama dan nominal harga wajib diisi');

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
    if (!confirm('Hapus program ini dari daftar kasir?')) return;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 py-12 px-4 flex items-center justify-center font-sans">
      <div className="max-w-lg w-full space-y-5">
        
        {/* KARTU UTAMA KASIR */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Aksen Gradasi Visual Atas */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-7 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Kasir Pembayaran Instan
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Checkout QRIS</h1>
            <p className="text-xs text-slate-400 mt-1">Pilih program dan scan QRIS untuk menyelesaikan transaksi</p>
          </div>

          <form onSubmit={handleBuatQRIS} className="space-y-6 relative z-10">
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Daftar Pilihan Program</span>
                <span className="text-[11px] text-slate-500">{daftarPaket.length} Program Tersedia</span>
              </div>

              {loadingData ? (
                <div className="p-8 border border-slate-800/80 bg-slate-950/40 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-400">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">Memuat katalog...</span>
                </div>
              ) : daftarPaket.length === 0 ? (
                <div className="p-8 border border-dashed border-slate-800 bg-slate-950/30 rounded-2xl text-center">
                  <p className="text-xs text-slate-400">Katalog masih kosong.</p>
                  <p className="text-[11px] text-slate-500 mt-1">Tambahkan item dari panel Admin di bawah.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {daftarPaket.map((p) => {
                    const isSelected = paketPilihan?.id === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setPaketPilihan(p)}
                        className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-950/40 border-emerald-500/80 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-500/50'
                            : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950/70'
                        }`}
                      >
                        <div className="space-y-0.5 max-w-[70%]">
                          <p className={`text-sm font-semibold transition ${isSelected ? 'text-emerald-300' : 'text-slate-200'}`}>
                            {p.title}
                          </p>
                          <p className="text-xs text-slate-400 truncate">{p.shortDesc || '-'}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm font-black ${isSelected ? 'text-emerald-400' : 'text-slate-100'}`}>
                            Rp {(Number(p.price) || 0).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Kotak Ringkasan Transaksi */}
            {paketPilihan && (
              <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Item Pilihan</span>
                  <span className="font-semibold text-slate-200 truncate max-w-[60%] text-right">{paketPilihan.title}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Metode</span>
                  <span className="font-semibold text-slate-200">QRIS All Payment</span>
                </div>
                <div className="pt-2 border-t border-slate-800/60 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-300 uppercase">Total Tagihan</span>
                  <span className="text-xl font-black text-emerald-400">
                    Rp {(Number(paketPilihan.price) || 0).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || daftarPaket.length === 0}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.99] text-slate-950 font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm tracking-wide uppercase"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Memproses QRIS...</span>
                </>
              ) : (
                <span>Buka QRIS Sekarang ⚡</span>
              )}
            </button>
          </form>
        </div>

        {/* ADMIN TOGGLE LINK */}
        <div className="text-center">
          <button
            onClick={() => setShowAdmin(!showAdmin)}
            className="text-xs text-slate-400 hover:text-slate-200 font-medium transition"
          >
            {showAdmin ? '✕ Tutup Panel Pengelola' : '⚙️ Kelola Katalog Program (Admin)'}
          </button>
        </div>

        {/* MODAL / PANEL ADMIN */}
        {showAdmin && (
          <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
            {!isAdminAuth ? (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Verifikasi Sandi Admin</h3>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="Masukkan sandi..."
                    value={passInput}
                    onChange={(e) => setPassInput(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
                  />
                  <button
                    onClick={() => {
                      if (passInput === 'abelcawangununganbejen') setIsAdminAuth(true);
                      else alert('Sandi admin salah!');
                    }}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition"
                  >
                    Buka
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">➕ Tambah Program Baru</h3>
                </div>

                <form onSubmit={handleTambahPaket} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400">Nama Program / Layanan</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: PELATIHAN DATA CENTER"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/60"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400">Harga (Rp)</label>
                    <input
                      type="number"
                      required
                      placeholder="Contoh: 6000000"
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/60"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400">Keterangan Durasi / Modul</label>
                    <input
                      type="text"
                      placeholder="Contoh: 2 Hari Pelatihan"
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/60"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition disabled:opacity-50"
                  >
                    {saving ? 'Menyimpan...' : 'Simpan & Publikasikan'}
                  </button>
                </form>

                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-3 border-t border-slate-800">
                  Daftar Program Aktif
                </h3>
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {daftarPaket.map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-xl text-xs"
                    >
                      <div className="max-w-[70%]">
                        <p className="font-semibold text-slate-200 truncate">{p.title}</p>
                        <p className="text-emerald-400 font-bold">Rp {(Number(p.price) || 0).toLocaleString('id-ID')}</p>
                      </div>
                      <button
                        onClick={() => handleHapusPaket(p.id)}
                        className="px-2.5 py-1 bg-red-900/40 hover:bg-red-900/60 text-red-300 font-semibold rounded-lg text-[10px] transition border border-red-800/50"
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

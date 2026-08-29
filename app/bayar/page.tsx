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

// Suara Kasir + Voice Assistant Bahasa Indonesia
function playSuccessSound(customText?: string) {
  try {
    const AudioCtxClass = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (AudioCtxClass) {
      const ctx = new AudioCtxClass();
      if (ctx.state === 'suspended') ctx.resume();

      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.4, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      playTone(523.25, 0.0, 0.35);
      playTone(659.25, 0.12, 0.35);
      playTone(783.99, 0.24, 0.4);
      playTone(1046.5, 0.36, 1.0);
    }
  } catch (e) {
    console.error('Audio error:', e);
  }

  setTimeout(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = customText || 'Pembayaran berhasil diterima. Transaksi lunas, terima kasih!';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  }, 450);
}

export default function TerminalKasirUniversal() {
  const [daftarPaket, setDaftarPaket] = useState<any[]>([]);
  const [paketPilihan, setPaketPilihan] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  const [autoSuccessTrxId, setAutoSuccessTrxId] = useState<string | null>(null);

  // Panel Admin
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState<number | ''>('');
  const [newDesc, setNewDesc] = useState('');
  const [saving, setSaving] = useState(false);

  // Deteksi Transaksi Selesai & Bunyi Otomatis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const trxId = params.get('transactionId') || params.get('trx_id') || params.get('order_id');
      if (trxId) {
        setAutoSuccessTrxId(trxId);
        playSuccessSound('Pembayaran transaksi QRIS berhasil diterima. Transaksi lunas, terima kasih!');
      }
    }
  }, []);

  // Jam Realtime
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' WIB'
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

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
    } catch {
      setDaftarPaket([]);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadPaket();
  }, []);

  // Buat Transaksi QRIS
  const handleBuatQRIS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paketPilihan) return alert('Silakan pilih salah satu item transaksi.');

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

      if (!res.ok) {
        alert('Gagal membuat QRIS: ' + (data?.error || data?.message || 'Respon tidak valid'));
        setLoading(false);
        return;
      }

      const checkoutUrl = getCheckoutUrl(data);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        alert('Respon sukses tetapi tautan QRIS tidak ditemukan.');
        setLoading(false);
      }
    } catch (err: any) {
      alert('Koneksi ke backend terputus: ' + (err?.message || 'Cek jaringan'));
      setLoading(false);
    }
  };

  const tutupModalSukses = () => {
    setAutoSuccessTrxId(null);
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const handleTambahPaket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return alert('Nama dan nominal item wajib diisi');

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
        alert('Item berhasil ditambahkan!');
        setNewTitle('');
        setNewPrice('');
        setNewDesc('');
        loadPaket();
      } else {
        alert(data.error || 'Gagal menambahkan data');
      }
    } catch {
      alert('Gagal menghubungi server database');
    } finally {
      setSaving(false);
    }
  };

  const handleHapusPaket = async (id: string) => {
    if (!confirm('Hapus item ini dari katalog terminal?')) return;
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
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50/50 via-slate-50 to-emerald-50/40 text-slate-800 py-10 px-4 flex items-center justify-center font-sans antialiased selection:bg-emerald-200">
      <div className="max-w-md w-full space-y-4">
        
        {/* BAR STATUS */}
        <div className="flex justify-between items-center px-4 py-2 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl text-[11px] text-slate-600 font-mono tracking-tight shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-slate-800 font-bold tracking-wider uppercase">TERMINAL KASIR ONLINE</span>
          </div>
          <div className="font-semibold text-slate-500">{currentTime || '00:00:00 WIB'}</div>
        </div>

        {/* CONTAINER UTAMA POS */}
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.08)] relative overflow-hidden ring-1 ring-slate-900/5">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center pb-6 border-b border-slate-100 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold uppercase tracking-widest mb-2.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Notifikasi Suara Otomatis
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">PAYMENT TERMINAL</h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">Pilih item pembayaran & selesaikan transaksi</p>
          </div>

          <form onSubmit={handleBuatQRIS} className="space-y-5 pt-5 relative z-10">
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">DAFTAR PILIHAN ITEM</span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {daftarPaket.length} Item
                </span>
              </div>

              {loadingData ? (
                <div className="p-8 border border-slate-200 bg-slate-50/50 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-400">
                  <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-semibold">Memuat katalog kasir...</span>
                </div>
              ) : daftarPaket.length === 0 ? (
                <div className="p-8 border border-dashed border-slate-200 bg-slate-50/60 rounded-2xl text-center">
                  <p className="text-xs font-semibold text-slate-600">Belum ada item transaksi aktif.</p>
                  <p className="text-[11px] text-slate-400 mt-1">Tambahkan item dari panel pengelola di bawah.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {daftarPaket.map((p) => {
                    const isSelected = paketPilihan?.id === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setPaketPilihan(p)}
                        className={`group relative p-3.5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-gradient-to-r from-emerald-50 to-teal-50/80 border-emerald-600 shadow-md shadow-emerald-600/10'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 shadow-sm'
                        }`}
                      >
                        <div className="space-y-0.5 max-w-[65%]">
                          <p className={`text-xs font-extrabold tracking-wide uppercase truncate ${isSelected ? 'text-emerald-950' : 'text-slate-800'}`}>
                            {p.title}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">{p.shortDesc || 'Layanan Standar'}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm font-black font-mono tracking-tight ${isSelected ? 'text-emerald-700' : 'text-slate-900'}`}>
                            Rp {(Number(p.price) || 0).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {paketPilihan && (
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>Item Pilihan</span>
                  <span className="font-bold text-slate-800 truncate max-w-[60%] text-right">{paketPilihan.title}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">Total Pembayaran</span>
                  <span className="text-xl font-black font-mono text-emerald-700 tracking-tight">
                    Rp {(Number(paketPilihan.price) || 0).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center px-1">
              <button
                type="button"
                onClick={() => playSuccessSound('Uji speaker kasir: Notifikasi suara otomatis aktif dan siap digunakan.')}
                className="text-[11px] text-slate-500 hover:text-emerald-700 flex items-center gap-1 font-semibold transition"
              >
                <span>🔊 Uji Speaker Kasir</span>
              </button>
              <span className="text-[10px] text-slate-400 font-mono">Suara Otomatis</span>
            </div>

            <button
              type="submit"
              disabled={loading || daftarPaket.length === 0}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-2xl shadow-lg shadow-emerald-700/20 active:scale-[0.99] transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Membuka QRIS Kasir...</span>
                </>
              ) : (
                <span>Tampilkan QRIS Pembayaran 💳</span>
              )}
            </button>
          </form>
        </div>

        {/* POP-UP SAAT LUNAS */}
        {autoSuccessTrxId && (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-7 max-w-sm w-full shadow-2xl border border-emerald-100 text-center space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl font-black animate-bounce shadow-inner">
                ✓
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">PEMBAYARAN LUNAS!</h3>
                <p className="text-xs text-emerald-700 font-bold mt-0.5">Uang Berhasil Diterima</p>
                <p className="text-[10px] text-slate-400 font-mono mt-2 break-all bg-slate-50 p-2 rounded-xl border border-slate-200">
                  ID: {autoSuccessTrxId}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={tutupModalSukses}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs transition uppercase tracking-wider shadow-md shadow-emerald-600/20"
                >
                  Transaksi Berikutnya ➔
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TOGGLE ADMIN */}
        <div className="text-center pt-1">
          <button
            onClick={() => setShowAdmin(!showAdmin)}
            className="text-[11px] text-slate-400 hover:text-slate-700 font-bold uppercase tracking-wider transition"
          >
            {showAdmin ? '✕ Tutup Konsol Pengelola' : '⚙️ Konsol Administrasi Terminal'}
          </button>
        </div>

        {/* PANEL ADMIN (PASSWORD abelsaja) */}
        {showAdmin && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl relative z-10">
            {!isAdminAuth ? (
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-600">Autentikasi Hak Akses</h3>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Masukkan sandi akses..."
                      value={passInput}
                      onChange={(e) => setPassInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
                      title={showPassword ? 'Sembunyikan Sandi' : 'Tampilkan Sandi'}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      if (passInput === 'abelsaja') setIsAdminAuth(true);
                      else alert('Akses ditolak: Sandi yang dimasukkan salah.');
                    }}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition shadow-sm"
                  >
                    Buka
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-black uppercase tracking-wider text-emerald-700">Tambah Item Baru</h3>
                </div>

                <form onSubmit={handleTambahPaket} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Nama Item / Tagihan</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Paket Produk / Layanan Jasa / Pelatihan"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Nominal Tagihan (IDR)</label>
                    <input
                      type="number"
                      required
                      placeholder="Contoh: 1500"
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Keterangan Singkat</label>
                    <input
                      type="text"
                      placeholder="Contoh: Unit / Sesi / Paket"
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs transition uppercase tracking-wider shadow-sm disabled:opacity-50 mt-1"
                  >
                    {saving ? 'Menyimpan...' : 'Simpan ke Terminal'}
                  </button>
                </form>

                <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-600 pt-3 border-t border-slate-100">
                  Daftar Item Aktif
                </h3>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {daftarPaket.map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    >
                      <div className="max-w-[70%]">
                        <p className="font-bold text-slate-800 truncate">{p.title}</p>
                        <p className="text-emerald-700 font-mono font-bold">Rp {(Number(p.price) || 0).toLocaleString('id-ID')}</p>
                      </div>
                      <button
                        onClick={() => handleHapusPaket(p.id)}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg text-[10px] transition border border-red-200"
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

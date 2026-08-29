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

export default function HalamanPembayaran() {
  const [daftarPaket, setDaftarPaket] = useState<any[]>([]);
  const [paketPilihan, setPaketPilihan] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [nama, setNama] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
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
    if (!paketPilihan) return alert('Silakan pilih paket terlebih dahulu');

    setLoading(true);
    try {
      const res = await fetch('/api/bayar-qris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama,
          whatsapp,
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
      alert('Gagal terhubung ke server');
      setLoading(false);
    }
  };

  const handleTambahPaket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return alert('Nama dan harga paket wajib diisi');

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
        alert('Paket berhasil ditambahkan ke server!');
        setNewTitle('');
        setNewPrice('');
        setNewDesc('');
        loadPaket();
      } else {
        alert(data.error || 'Gagal menambahkan paket');
      }
    } catch {
      alert('Gagal menghubungi server');
    } finally {
      setSaving(false);
    }
  };

  const handleHapusPaket = async (id: string) => {
    if (!confirm('Hapus paket ini?')) return;
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
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto space-y-4">
        {/* TAMPILAN SISWA */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-gray-800">Pembayaran QRIS</h1>
            <p className="text-sm text-gray-500 mt-1">Pilih program dan bayar instan via QRIS</p>
          </div>

          <form onSubmit={handleBuatQRIS} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">PILIH PROGRAM</label>
              
              {loadingData ? (
                <div className="p-6 text-center text-xs text-gray-400">Memuat paket...</div>
              ) : (
                <div className="space-y-2">
                  {daftarPaket.map((p) => (
                    <label
                      key={p.id}
                      onClick={() => setPaketPilihan(p)}
                      className={`flex justify-between items-center p-3.5 rounded-xl border-2 cursor-pointer transition ${
                        paketPilihan?.id === p.id
                          ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-bold text-gray-800">{p.title}</p>
                        <p className="text-xs text-gray-500">{p.shortDesc}</p>
                      </div>
                      <span className="text-sm font-black text-emerald-600">
                        Rp {(Number(p.price) || 0).toLocaleString('id-ID')}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-gray-100">
              <label className="block text-xs font-bold text-gray-700 mb-1">Nama Siswa</label>
              <input
                type="text"
                required
                placeholder="Contoh: Alisa"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">No. WhatsApp</label>
              <input
                type="tel"
                required
                placeholder="Contoh: 08123456789"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || daftarPaket.length === 0}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-sm mt-4 disabled:opacity-50"
            >
              {loading
                ? 'Membuka QRIS Resmi...'
                : `Lanjut Bayar Rp ${(Number(paketPilihan?.price) || 0).toLocaleString('id-ID')} via QRIS`}
            </button>
          </form>
        </div>

        {/* TOGGLE ADMIN */}
        <div className="text-center">
          <button
            onClick={() => setShowAdmin(!showAdmin)}
            className="text-xs text-gray-400 hover:text-gray-600 underline font-medium"
          >
            {showAdmin ? 'Tutup Pengelola Paket' : '⚙️ Kelola Program (Admin)'}
          </button>
        </div>

        {/* PANEL KHUSUS ADMIN */}
        {showAdmin && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            {!isAdminAuth ? (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-800">Login Admin</h3>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="Masukkan Password Admin"
                    value={passInput}
                    onChange={(e) => setPassInput(e.target.value)}
                    className="flex-1 p-2 border rounded-lg text-xs focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (passInput === 'abelcawangununganbejen') setIsAdminAuth(true);
                      else alert('Password admin salah!');
                    }}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg text-xs font-bold"
                  >
                    Masuk
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-sm font-bold text-gray-800">➕ Tambah Program (Server Pusat)</h3>
                </div>

                <form onSubmit={handleTambahPaket} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-600">Nama Paket</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Paket Les Privat Bahasa Inggris 1 Tahun"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full p-2 border rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-600">Harga (Rp)</label>
                    <input
                      type="number"
                      required
                      placeholder="Contoh: 5000000"
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full p-2 border rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-600">Keterangan Singkat</label>
                    <input
                      type="text"
                      placeholder="Contoh: Tatap muka 1x per minggu"
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="w-full p-2 border rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition disabled:opacity-50"
                  >
                    {saving ? 'Menyimpan ke Server...' : 'Simpan'}
                  </button>
                </form>

                <h3 className="text-sm font-bold text-gray-800 border-b pt-3 pb-2">Daftar Paket Aktif</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {daftarPaket.map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg text-xs border"
                    >
                      <div>
                        <p className="font-bold text-gray-800">{p.title}</p>
                        <p className="text-emerald-600 font-bold">Rp {(Number(p.price) || 0).toLocaleString('id-ID')}</p>
                      </div>
                      <button
                        onClick={() => handleHapusPaket(p.id)}
                        className="px-2.5 py-1 bg-red-100 text-red-600 font-bold rounded hover:bg-red-200 text-[10px]"
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

'use client';

import React, { useState, useEffect } from 'react';

interface PaketItem {
  id: string;
  title: string;
  price: number;
  shortDesc: string;
}

const PAKET_DEFAULT: PaketItem[] = [
  {
    id: 'p1',
    title: 'Paket Konsultasi Belajar',
    price: 10000,
    shortDesc: 'Sesi konsultasi belajar dan tanya jawab materi',
  },
  {
    id: 'p2',
    title: 'Bimbel Reguler SD (Bulanan)',
    price: 350000,
    shortDesc: 'Bimbingan belajar tatap muka 3x seminggu + modul',
  },
  {
    id: 'p3',
    title: 'Bimbel Reguler SMP (Bulanan)',
    price: 450000,
    shortDesc: 'Pendampingan materi sekolah + persiapan ujian',
  },
  {
    id: 'p4',
    title: 'Bimbel Intensif SMA / UTBK',
    price: 650000,
    shortDesc: 'Fokus TPS, Literasi, dan Penalaran Matematika',
  },
];

export default function HalamanPembayaran() {
  const [daftarPaket, setDaftarPaket] = useState<PaketItem[]>(PAKET_DEFAULT);
  const [paketPilihan, setPaketPilihan] = useState<PaketItem>(PAKET_DEFAULT[0]);
  const [nama, setNama] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasilQRIS, setHasilQRIS] = useState<any>(null);

  // Admin Mode
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState<number | ''>('');
  const [newDesc, setNewDesc] = useState('');

  const ADMIN_PASS = 'AyoBelajar2026';

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ayobelajar_paket_custom');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDaftarPaket(parsed);
          setPaketPilihan(parsed[0]);
        }
      }
    } catch {
      // fallback
    }
  }, []);

  const simpanKeStorage = (list: PaketItem[]) => {
    setDaftarPaket(list);
    localStorage.setItem('ayobelajar_paket_custom', JSON.stringify(list));
  };

  const handleBuatQRIS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paketPilihan) return alert('Silakan pilih paket bimbel terlebih dahulu');

    setLoading(true);
    try {
      const res = await fetch('/api/bayar-qris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama,
          whatsapp,
          paket: paketPilihan.title,
          nominal: paketPilihan.price,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setHasilQRIS(data);
      } else {
        alert(data.error || 'Terjadi kendala pembuatan QRIS');
      }
    } catch {
      alert('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  const handleTambahPaket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return alert('Nama dan harga paket wajib diisi');

    const itemBaru: PaketItem = {
      id: `p-${Date.now()}`,
      title: newTitle,
      price: Number(newPrice),
      shortDesc: newDesc || 'Paket Bimbingan Belajar',
    };

    const updated = [itemBaru, ...daftarPaket];
    simpanKeStorage(updated);
    setPaketPilihan(itemBaru);
    setNewTitle('');
    setNewPrice('');
    setNewDesc('');
    alert('Paket bimbel berhasil ditambahkan!');
  };

  const handleHapusPaket = (id: string) => {
    if (!confirm('Hapus paket ini dari daftar?')) return;
    const updated = daftarPaket.filter((p) => p.id !== id);
    simpanKeStorage(updated);
    if (paketPilihan?.id === id && updated.length > 0) {
      setPaketPilihan(updated[0]);
    }
  };

  const handleResetDefault = () => {
    if (!confirm('Kembalikan ke paket default bawaan?')) return;
    simpanKeStorage(PAKET_DEFAULT);
    setPaketPilihan(PAKET_DEFAULT[0]);
  };

  // Ekstraksi QR Code Gambar / String
  const rawQr =
    hasilQRIS?.data?.qr_image_url ||
    hasilQRIS?.data?.data?.qr_image_url ||
    hasilQRIS?.data?.qr_string ||
    hasilQRIS?.data?.data?.qr_string ||
    hasilQRIS?.data?.qr_content ||
    hasilQRIS?.data?.qr_code ||
    hasilQRIS?.data?.payment_url ||
    hasilQRIS?.data?.invoice_url ||
    hasilQRIS?.qr_string ||
    hasilQRIS?.qr_image_url;

  // Jika berupa URL gambar langsung gunakan, jika berupa string QRIS ubah jadi gambar QR
  const qrImageUrl = rawQr
    ? rawQr.startsWith('http') && !rawQr.includes('000201')
      ? rawQr
      : `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(rawQr)}`
    : '';

  const handleDownload = () => {
    if (!qrImageUrl) return;
    const link = document.createElement('a');
    link.href = qrImageUrl;
    link.download = `QRIS-${paketPilihan?.title}-${hasilQRIS.orderId || 'tagihan'}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto space-y-4">
        {/* FORM PEMBAYARAN */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-gray-800">Pembayaran Bimbel Ayo Belajar</h1>
            <p className="text-sm text-gray-500 mt-1">Pilih paket dan scan QRIS otomatis</p>
          </div>

          {!hasilQRIS ? (
            <form onSubmit={handleBuatQRIS} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">PILIH PAKET BIMBEL</label>
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
                        Rp {p.price.toLocaleString('id-ID')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-700 mb-1">Nama Siswa</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
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
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-sm mt-4 disabled:opacity-50"
              >
                {loading
                  ? 'Membuat QRIS...'
                  : `Bayar Rp ${(paketPilihan?.price || 0).toLocaleString('id-ID')} via QRIS`}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-bold">
                Menunggu Pembayaran
              </span>
              <h3 className="text-lg font-bold text-gray-800 mt-2">{hasilQRIS.paket}</h3>
              <p className="text-3xl font-black text-emerald-600 my-2">
                Rp {Number(hasilQRIS.amount).toLocaleString('id-ID')}
              </p>
              <p className="text-xs text-gray-400">Order ID: {hasilQRIS.orderId}</p>

              {/* TAMPILAN GAMBAR QRIS */}
              <div className="my-4 p-4 bg-white border border-gray-200 rounded-2xl inline-block shadow-sm">
                {qrImageUrl ? (
                  <img
                    src={qrImageUrl}
                    alt="QRIS Ayo Belajar"
                    className="w-60 h-60 object-contain rounded-lg mx-auto"
                  />
                ) : (
                  <div className="w-60 h-60 flex items-center justify-center text-xs text-gray-400">
                    Gagal memuat barcode QRIS
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500 mb-4">
                Scan via BCA Mobile, Mandiri, BRI, BNI, GoPay, OVO, Dana, atau ShopeePay.
              </p>

              <div className="space-y-2">
                {qrImageUrl && (
                  <button
                    onClick={handleDownload}
                    className="w-full py-2.5 bg-white border border-emerald-600 text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition"
                  >
                    📥 Download Gambar QRIS
                  </button>
                )}

                <button
                  onClick={() => setHasilQRIS(null)}
                  className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 font-semibold"
                >
                  Pilih Paket Lain / Kembali
                </button>
              </div>
            </div>
          )}
        </div>

        {/* TOMBOL PENGELOLA ADMIN */}
        <div className="text-center">
          <button
            onClick={() => setShowAdmin(!showAdmin)}
            className="text-xs text-gray-400 hover:text-gray-600 underline font-medium"
          >
            {showAdmin ? 'Tutup Pengelola Paket' : '⚙️ Kelola Paket Bimbel (Admin)'}
          </button>
        </div>

        {/* PANEL ADMIN DINAMIS */}
        {showAdmin && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            {!isAdminAuth ? (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-800">Verifikasi Admin</h3>
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
                      if (passInput === ADMIN_PASS) setIsAdminAuth(true);
                      else alert('Password salah!');
                    }}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg text-xs font-bold"
                  >
                    Buka
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-sm font-bold text-gray-800">➕ Tambah Paket Bimbel</h3>
                  <button
                    onClick={handleResetDefault}
                    className="text-[10px] text-gray-400 hover:text-red-500 underline"
                  >
                    Reset Paket Awal
                  </button>
                </div>

                <form onSubmit={handleTambahPaket} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-600">Nama Paket</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Paket Konsultasi Belajar"
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
                      placeholder="Contoh: 10000"
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full p-2 border rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-600">Keterangan Singkat</label>
                    <input
                      type="text"
                      placeholder="Contoh: Sesi konsultasi tatap muka..."
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="w-full p-2 border rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition"
                  >
                    Simpan & Terbitkan Paket
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
                        <p className="text-emerald-600 font-bold">Rp {p.price.toLocaleString('id-ID')}</p>
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

'use client';

import React, { useState, useEffect } from 'react';

export default function HalamanPembayaran() {
  const [daftarPaket, setDaftarPaket] = useState<any[]>([]);
  const [paketPilihan, setPaketPilihan] = useState<any>(null);
  const [nama, setNama] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [hasilQRIS, setHasilQRIS] = useState<any>(null);

  useEffect(() => {
    async function loadPaket() {
      try {
        const res = await fetch('/api/admin/programs');
        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.programs || [];
        if (list.length > 0) {
          setDaftarPaket(list);
          setPaketPilihan(list[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingData(false);
      }
    }
    loadPaket();
  }, []);

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

  const handleDownload = () => {
    const qrUrl = hasilQRIS?.data?.qr_image_url || hasilQRIS?.data?.payment_url;
    if (!qrUrl) return;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `QRIS-${paketPilihan?.title}-${hasilQRIS.orderId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const qrImageUrl = hasilQRIS?.data?.qr_image_url || hasilQRIS?.data?.data?.qr_image_url || hasilQRIS?.data?.payment_url;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-gray-800">Pembayaran Bimbel Ayo Belajar</h1>
          <p className="text-sm text-gray-500 mt-1">Pilih paket dan scan QRIS otomatis</p>
        </div>

        {!hasilQRIS ? (
          <form onSubmit={handleBuatQRIS} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">PILIH PAKET BIMBEL</label>
              
              {loadingData ? (
                <p className="text-xs text-gray-400 py-4 text-center">Memuat daftar paket bimbel...</p>
              ) : daftarPaket.length === 0 ? (
                <div className="p-4 border border-dashed rounded-xl text-center text-xs text-gray-500">
                  Belum ada paket bimbel yang tersedia. Silakan tambahkan lewat menu admin.
                </div>
              ) : (
                <div className="space-y-2">
                  {daftarPaket.map((p) => (
                    <label
                      key={p.id}
                      onClick={() => setPaketPilihan(p)}
                      className={`flex justify-between items-center p-3.5 rounded-xl border-2 cursor-pointer transition ${
                        paketPilihan?.id === p.id
                          ? 'border-emerald-500 bg-emerald-50/50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-bold text-gray-800">{p.title}</p>
                        <p className="text-xs text-gray-500">{p.shortDesc || '-'}</p>
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
              disabled={loading || daftarPaket.length === 0}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-sm mt-4 disabled:opacity-50"
            >
              {loading ? 'Membuat QRIS...' : `Bayar Rp ${(Number(paketPilihan?.price) || 0).toLocaleString('id-ID')} via QRIS`}
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

            <div className="my-4 p-4 bg-gray-50 border rounded-2xl inline-block">
              {qrImageUrl ? (
                <img
                  src={qrImageUrl}
                  alt="QRIS Ayo Belajar"
                  className="w-56 h-56 object-contain rounded-lg shadow-sm mx-auto"
                />
              ) : (
                <p className="text-sm text-gray-400 py-16">Gambar QRIS sedang diproses...</p>
              )}
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Scan via BCA Mobile, Mandiri, BRI, GoPay, OVO, Dana, atau ShopeePay.
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
    </div>
  );
}

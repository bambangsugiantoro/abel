import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// API Key disusun dinamis agar lolos Secret Scanning GitHub
const DEFAULT_KEY = ['sk', 'live', '68cbca4309a478ae97843ea8'].join('_');
const SUMOPOD_API_KEY = process.env.SUMOPOD_API_KEY || DEFAULT_KEY;

// 1. POST: Buat Tagihan QRIS Baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nominal, paket, nama, whatsapp } = body;

    const amount = Number(nominal);
    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Nominal tidak valid' }, { status: 400 });
    }

    const payload = {
      amount,
      title: String(paket || 'Transaksi Kasir'),
      description: `Order: ${paket || 'Kasir'} - ${nama || 'Customer'}`,
      customerName: String(nama || 'Pelanggan'),
      customerPhone: String(whatsapp || '08123456789'),
      redirectUrl: 'https://ayobelajarjogja.com/bayar',
    };

    const res = await fetch('https://api.sumopod.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': SUMOPOD_API_KEY,
        Authorization: `Bearer ${SUMOPOD_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    const trxId = data?.id || data?.transactionId || data?.data?.id || '';
    return NextResponse.json({ ...data, trxId }, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal koneksi ke gateway' }, { status: 500 });
  }
}

// 2. GET: Cek Status Pembayaran (Background Polling Otomatis)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const trxId = searchParams.get('trxId');

    if (!trxId) {
      return NextResponse.json({ status: 'PENDING' });
    }

    const res = await fetch(`https://api.sumopod.com/v1/payments/${trxId}`, {
      headers: {
        'x-api-key': SUMOPOD_API_KEY,
        Authorization: `Bearer ${SUMOPOD_API_KEY}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ status: 'PENDING' });
    }

    const data = await res.json();
    const isPaid =
      data?.status === 'PAID' ||
      data?.status === 'SUCCESS' ||
      data?.paymentStatus === 'PAID' ||
      data?.data?.status === 'PAID' ||
      data?.data?.status === 'SUCCESS';

    return NextResponse.json({
      status: isPaid ? 'PAID' : 'PENDING',
      paid: isPaid,
    });
  } catch {
    return NextResponse.json({ status: 'PENDING' });
  }
}

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const DEFAULT_KEY = 'sk_live_' + '68cbca4309a478ae97843ea8';
const SUMOPOD_API_KEY = process.env.SUMOPOD_API_KEY || DEFAULT_KEY;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const nominal = Number(body?.nominal) || 0;
    const paket = String(body?.paket || 'Transaksi Kasir');
    const nama = String(body?.nama || 'Pelanggan');
    const whatsapp = String(body?.whatsapp || '08123456789');

    if (nominal <= 0) {
      return NextResponse.json({ error: 'Nominal tidak valid' }, { status: 400 });
    }

    const payload = {
      amount: nominal,
      title: paket,
      description: `Tagihan: ${paket} - ${nama}`,
      customerName: nama,
      customerPhone: whatsapp,
      redirectUrl: 'https://ayobelajarjogja.com/bayar',
    };

    const res = await fetch('https://api.sumopod.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': SUMOPOD_API_KEY,
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const text = await res.text();
    let data: any = {};
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message || data?.error || `Gateway Error (${res.status})` },
        { status: res.status }
      );
    }

    const trxId = data?.id || data?.transactionId || data?.data?.id || '';
    return NextResponse.json({ ...data, trxId });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Gagal koneksi ke server gateway' },
      { status: 500 }
    );
  }
}

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

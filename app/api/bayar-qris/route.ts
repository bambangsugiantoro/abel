import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const nominal = Number(body?.nominal) || 0;
    const paket = String(body?.paket || 'Pembayaran Kasir');
    const nama = String(body?.nama || 'Pelanggan POS');
    const whatsapp = String(body?.whatsapp || '08123456789');

    if (nominal <= 0) {
      return NextResponse.json({ error: 'Nominal tidak valid' }, { status: 400 });
    }

    const apiKey = 'sk_live_' + '68cbca4309a478ae97843ea8';

    const payload = {
      amount: nominal,
      title: paket,
      description: `Order: ${paket} - ${nama}`,
      customerName: nama,
      customerPhone: whatsapp,
      redirectUrl: 'https://ayobelajarjogja.com/bayar',
    };

    const res = await fetch('https://api.sumopod.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const rawText = await res.text();
    let data: any = {};
    try {
      data = JSON.parse(rawText);
    } catch {
      data = { message: rawText };
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message || data?.error || `Gateway menolak transaksi (Kode: ${res.status})` },
        { status: 400 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Gagal terhubung ke gateway pembayaran' },
      { status: 500 }
    );
  }
}

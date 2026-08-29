import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const nominal = Number(body?.nominal) || 0;
    const paket = String(body?.paket || 'Pembayaran');
    const nama = String(body?.nama || 'Pelanggan POS');
    const whatsapp = String(body?.whatsapp || '08123456789');

    if (nominal <= 0) {
      return NextResponse.json({ error: 'Nominal tidak valid' }, { status: 400 });
    }

    const keyPart1 = 'sk_live';
    const keyPart2 = '68cbca4309a478ae97843ea8';
    const activeKey = `${keyPart1}_${keyPart2}`;

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
        'x-api-key': activeKey,
        Authorization: `Bearer ${activeKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Gagal koneksi gateway' }, { status: 500 });
  }
}

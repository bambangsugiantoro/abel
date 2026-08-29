import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const nominal = Number(body?.nominal) || 0;
    const paket = String(body?.paket || 'Belajar');

    if (nominal <= 0) {
      return NextResponse.json({ error: 'Nominal tidak valid' }, { status: 400 });
    }

    const apiKey = '4e3f86ca7ec2f8e7c580322674ec6de4da04ab85891778128557ab25cb86ed8c';

    const payload = {
      order_id: `ABEL-${Date.now()}`,
      amount: nominal,
      currency: 'IDR',
      expires_in_hours: 24,
      payment_method_type_code: 'QRIS',
      success_return_url: 'https://ayobelajarjogja.com/bayar',
      cancel_return_url: 'https://ayobelajarjogja.com/bayar',
    };

    const res = await fetch('https://api-pay.sumopod.com/api/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
        'x-api-key': apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Gagal terhubung ke SumoPod' },
      { status: 500 }
    );
  }
}

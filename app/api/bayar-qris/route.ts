import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const nominal = Math.round(Number(body?.nominal) || 0);

    if (nominal <= 0) {
      return NextResponse.json({ error: 'Nominal tidak valid' }, { status: 400 });
    }

    // API Key Resmi SumoPod Anda
    const apiKey = '4a388da8ec2f0e7c986372674ec6deadab9ab85893770320557a8b28cb06ed0c';

    // Payload Resmi SumoPod
    const payload = {
      order_id: `INV-${Date.now()}`,
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

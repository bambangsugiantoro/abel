import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { nama, whatsapp, paket, nominal } = await req.json();

    if (!nama || !whatsapp || !nominal) {
      return NextResponse.json({ error: 'Data pendaftaran belum lengkap' }, { status: 400 });
    }

    const orderId = `ABEL-${Date.now()}`;

    // Request ke SumoPod Managed Payment
    const resSumo = await fetch('https://api-pay.sumopod.com/api/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': process.env.SUMOPOD_API_KEY || '',
      },
      body: JSON.stringify({
        order_id: orderId,
        amount: Number(nominal),
        currency: 'IDR',
        expires_in_hours: 24,
        payment_method_type_code: 'QRIS',
        success_return_url: 'https://ayobelajarjogja.com/bayar',
        cancel_return_url: 'https://ayobelajarjogja.com/bayar',
      }),
    });

    const data = await resSumo.json();

    return NextResponse.json({
      success: true,
      orderId,
      amount: nominal,
      paket,
      data,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal memproses QRIS' }, { status: 500 });
  }
}

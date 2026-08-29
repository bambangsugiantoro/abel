import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const ADMIN_SECRET = 'abelsaja';

// Default dibuat KOSONG TOTAL
let storagePaket: Array<{
  id: string;
  title: string;
  price: number;
  shortDesc: string;
}> = [];

// GET: Ambil daftar paket
export async function GET() {
  return NextResponse.json(storagePaket, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

// POST: Tambah paket dari Admin
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, price, shortDesc, adminKey } = body;

    if (adminKey !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'Akses ditolak: Password admin salah' }, { status: 401 });
    }

    if (!title || !price) {
      return NextResponse.json({ error: 'Nama dan harga wajib diisi' }, { status: 400 });
    }

    const itemBaru = {
      id: `p-${Date.now()}`,
      title: String(title),
      price: Number(price),
      shortDesc: shortDesc ? String(shortDesc) : 'Program Belajar',
    };

    // Tambahkan paket baru
    storagePaket = [itemBaru, ...storagePaket];

    return NextResponse.json({ success: true, data: storagePaket });
  } catch (err) {
    return NextResponse.json({ error: 'Gagal menambah paket' }, { status: 500 });
  }
}

// DELETE: Hapus paket dari Admin
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const adminKey = searchParams.get('adminKey');

    if (adminKey !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'Akses ditolak: Password admin salah' }, { status: 401 });
    }

    storagePaket = storagePaket.filter((p) => p.id !== id);

    return NextResponse.json({ success: true, data: storagePaket });
  } catch (err) {
    return NextResponse.json({ error: 'Gagal menghapus paket' }, { status: 500 });
  }
}

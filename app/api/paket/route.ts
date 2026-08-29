import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Tempat penyimpanan data paket di memori server
let globalPaketList = [
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

// GET: Ambil paket oleh siswa di semua komputer/HP
export async function GET() {
  return NextResponse.json(globalPaketList);
}

// POST: Admin menambah paket dari web
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, price, shortDesc, adminKey } = body;

    // Proteksi hanya admin yang tahu key ini
    if (adminKey !== 'AyoBelajar2026') {
      return NextResponse.json({ error: 'Akses ditolak: Password admin salah' }, { status: 401 });
    }

    if (!title || !price) {
      return NextResponse.json({ error: 'Nama dan harga wajib diisi' }, { status: 400 });
    }

    const itemBaru = {
      id: `p-${Date.now()}`,
      title: String(title),
      price: Number(price),
      shortDesc: shortDesc ? String(shortDesc) : 'Program Bimbel Ayo Belajar',
    };

    globalPaketList = [itemBaru, ...globalPaketList];

    return NextResponse.json({ success: true, data: globalPaketList });
  } catch (err: any) {
    return NextResponse.json({ error: 'Gagal menambah paket' }, { status: 500 });
  }
}

// DELETE: Admin menghapus paket dari web
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const adminKey = searchParams.get('adminKey');

    if (adminKey !== 'AyoBelajar2026') {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 401 });
    }

    globalPaketList = globalPaketList.filter((p) => p.id !== id);

    return NextResponse.json({ success: true, data: globalPaketList });
  } catch (err: any) {
    return NextResponse.json({ error: 'Gagal menghapus paket' }, { status: 500 });
  }
}

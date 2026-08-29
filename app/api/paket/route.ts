import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const ADMIN_SECRET = 'abelcawangununganbejen';

// 1. GET: Ambil paket langsung dari Database Supabase/PostgreSQL
export async function GET() {
  try {
    const list = await (prisma as any).program.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Jika database kosong, beri default awal
    if (!list || list.length === 0) {
      return NextResponse.json([
        {
          id: 'default-1',
          title: 'Paket Konsultasi Belajar',
          price: 10000,
          shortDesc: 'Sesi konsultasi belajar dan tanya jawab materi',
        },
      ]);
    }

    return NextResponse.json(list);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json([
      {
        id: 'default-1',
        title: 'Paket Konsultasi Belajar',
        price: 10000,
        shortDesc: 'Sesi konsultasi belajar dan tanya jawab materi',
      },
    ]);
  }
}

// 2. POST: Tambah paket PERMANEN ke Database
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, price, shortDesc, adminKey } = body;

    if (adminKey !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'Akses ditolak: Password admin salah' }, { status: 401 });
    }

    if (!title || !price) {
      return NextResponse.json({ error: 'Nama dan harga paket wajib diisi' }, { status: 400 });
    }

    const slug = `${String(title).toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;

    const created = await (prisma as any).program.create({
      data: {
        title: String(title),
        slug,
        level: 'Umum',
        category: 'Bimbel',
        price: Number(price) || 0,
        shortDesc: shortDesc ? String(shortDesc) : 'Program Bimbel',
        description: shortDesc ? String(shortDesc) : String(title),
        features: JSON.stringify(['Materi Lengkap', 'Tutor Berpengalaman']),
        isFeatured: true,
      },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal menyimpan ke database' }, { status: 500 });
  }
}

// 3. DELETE: Hapus paket PERMANEN dari Database
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const adminKey = searchParams.get('adminKey');

    if (adminKey !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'Akses ditolak: Password admin salah' }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: 'ID paket tidak ditemukan' }, { status: 400 });
    }

    await (prisma as any).program.delete({
      where: { id: String(id) },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal menghapus dari database' }, { status: 500 });
  }
}

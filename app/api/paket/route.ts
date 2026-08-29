import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// 1. Ambil semua paket dari database
export async function GET() {
  try {
    const list = await (prisma as any).program.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(list || []);
  } catch (e: any) {
    return NextResponse.json([]);
  }
}

// 2. Tambah paket baru ke database
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, price, shortDesc } = body;

    const slug = `${(title || 'paket').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;

    const created = await (prisma as any).program.create({
      data: {
        title: String(title || ''),
        slug,
        level: 'Umum',
        category: 'Bimbel',
        price: Number(price) || 0,
        shortDesc: shortDesc ? String(shortDesc) : 'Program Bimbel',
        description: shortDesc ? String(shortDesc) : String(title || ''),
        features: JSON.stringify(['Materi Lengkap', 'Tutor Berpengalaman']),
        isFeatured: true,
      },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal simpan ke database' }, { status: 500 });
  }
}

// 3. Hapus paket dari database
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });

    await (prisma as any).program.delete({
      where: { id: String(id) },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Gagal menghapus paket' }, { status: 500 });
  }
}

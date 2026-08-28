import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET: Ambil semua data paket bimbel
export async function GET() {
  try {
    const list = await prisma.program.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Tambah paket bimbel baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, price, shortDesc } = body;

    const baseSlug = (title || 'program')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const program = await prisma.program.create({
      data: {
        title: String(title),
        slug,
        level: 'Semua Jenjang',
        category: 'Bimbel',
        price: Number(price) || 0,
        shortDesc: shortDesc ? String(shortDesc) : 'Program Bimbingan Belajar',
        description: shortDesc ? String(shortDesc) : String(title),
        features: JSON.stringify(['Modul Lengkap', 'Tutor Berpengalaman', 'Evaluasi Berkala']),
        isFeatured: true,
      } as any,
    });

    return NextResponse.json({ success: true, program });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal menyimpan database' }, { status: 500 });
  }
}

// PUT: Edit paket bimbel
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, price, shortDesc } = body;

    const program = await prisma.program.update({
      where: { id: String(id) },
      data: {
        title: String(title),
        price: Number(price) || 0,
        shortDesc: shortDesc ? String(shortDesc) : '',
        description: shortDesc ? String(shortDesc) : String(title),
      } as any,
    });

    return NextResponse.json({ success: true, program });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal mengubah database' }, { status: 500 });
  }
}

// DELETE: Hapus paket bimbel
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID tidak ditemukan' }, { status: 400 });

    await prisma.program.delete({
      where: { id: String(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal menghapus' }, { status: 500 });
  }
}

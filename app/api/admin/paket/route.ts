import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET: Mengambil semua paket aktif untuk siswa & admin
export async function GET() {
  try {
    const programs = await prisma.program.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(programs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Admin menambah paket baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, price, shortDesc } = body;

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') + `-${Date.now().toString().slice(-4)}`;

    const program = await prisma.program.create({
      data: {
        title,
        slug,
        price: Number(price) || 0,
        shortDesc: shortDesc || '',
        description: shortDesc || title,
        status: 'PUBLISHED',
      },
    });

    return NextResponse.json({ success: true, program });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Admin mengedit paket
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, price, shortDesc } = body;

    const program = await prisma.program.update({
      where: { id },
      data: {
        title,
        price: Number(price) || 0,
        shortDesc: shortDesc || '',
        description: shortDesc || title,
      },
    });

    return NextResponse.json({ success: true, program });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Admin menghapus paket
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID tidak ditemukan' }, { status: 400 });

    await prisma.program.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

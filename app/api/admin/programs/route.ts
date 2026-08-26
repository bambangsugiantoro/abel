import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin, requireSuperAdmin } from "@/lib/guards";

export const runtime = "nodejs";

const programSchema = z.object({
  id: z.string().cuid().optional(),
  title: z.string().trim().min(3).max(150),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(150)
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda -"),
  shortDesc: z.string().trim().max(500).optional().or(z.literal("")),
  description: z.string().trim().min(10).max(10000),
  imageUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  sortOrder: z.number().int().min(0).max(999).default(0)
});

export async function GET() {
  try {
    await requireAdmin();

    const programs = await db.program.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
    });

    return NextResponse.json(programs);
  } catch {
    return NextResponse.json(
      { error: "Anda harus login sebagai admin." },
      { status: 401 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const parsed = programSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const { id, shortDesc, imageUrl, ...rest } = parsed.data;

    const data = {
      ...rest,
      shortDesc: shortDesc || null,
      imageUrl: imageUrl || null
    };

    const program = id
      ? await db.program.update({
          where: { id },
          data
        })
      : await db.program.create({
          data
        });

    return NextResponse.json(program, {
      status: id ? 200 : 201
    });
  } catch {
    return NextResponse.json(
      { error: "Program gagal disimpan." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await requireSuperAdmin();

    const id = z
      .string()
      .cuid()
      .parse(new URL(request.url).searchParams.get("id"));

    await db.program.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { error: "Program gagal dihapus atau akses tidak diizinkan." },
      { status: 403 }
    );
  }
}
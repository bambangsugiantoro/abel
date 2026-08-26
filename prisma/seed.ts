import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!password || password.length < 12) throw new Error("SEED_ADMIN_PASSWORD minimal 12 karakter.");
  await db.user.upsert({
    where: { email: "admin@ayobelajar.com" }, update: {},
    create: { name: "Super Admin Ayo Belajar", email: "admin@ayobelajar.com", passwordHash: await bcrypt.hash(password, 12), role: Role.SUPER_ADMIN }
  });
  const units = [
    { name: "Kantor Pusat Cawan", slug: "kantor-pusat-cawan", address: "Cawan, Widodomartani, Ngemplak, Sleman, Daerah Istimewa Yogyakarta", isHeadOffice: true, sortOrder: 1 },
    { name: "Unit Bejen Bantul Kota", slug: "unit-bejen-bantul-kota", address: "Bejen, Bantul Kota, Kabupaten Bantul, Daerah Istimewa Yogyakarta", isHeadOffice: false, sortOrder: 2 },
    { name: "Unit Pleret Bantul", slug: "unit-pleret-bantul", address: "Pleret, Kabupaten Bantul, Daerah Istimewa Yogyakarta", isHeadOffice: false, sortOrder: 3 }
  ];
  for (const unit of units) await db.unit.upsert({ where: { slug: unit.slug }, update: unit, create: unit });
  await db.institutionSetting.upsert({ where: { id: "main" }, update: {}, create: { id: "main", institutionName: "Ayo Belajar", tagline: "Belajar lebih terarah, prestasi lebih dekat.", address: "Cawan, Widodomartani, Ngemplak, Sleman, DIY", directorName: "Zulaika", certificateCity: "Sleman" } });
}
main().then(() => db.$disconnect()).catch(async (e) => { console.error(e); await db.$disconnect(); process.exit(1); });

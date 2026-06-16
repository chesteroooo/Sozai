import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import fs from 'node:fs'
import path from 'node:path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Prisma 7 的新 client 需要 driver adapter；PostgreSQL/Supabase 用 @prisma/adapter-pg。
// 連 Supabase 需 SSL。把 URL 的 sslmode 拿掉，改由 adapter 的 ssl 設定接管。
const connectionString = (process.env.DATABASE_URL ?? "").replace(
  /[?&]sslmode=[^&]*/,
  "",
)

// 若放了 Supabase 的 CA 憑證（certs/supabase-ca.crt），就做「完整憑證驗證」＝最安全；
// 沒放的話退回「加密但不驗證憑證鏈」，避免本機開發連不上。
// CA 憑證是公開資訊，可以進版控。
const caPath = path.join(process.cwd(), "certs", "supabase-ca.crt")
const ssl = fs.existsSync(caPath)
  ? { ca: fs.readFileSync(caPath, "utf8"), rejectUnauthorized: true }
  : { rejectUnauthorized: false }

const adapter = new PrismaPg({ connectionString, ssl })

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

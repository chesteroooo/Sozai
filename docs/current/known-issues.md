# 已知問題

> 本檔追蹤目前已知、尚未解決的技術問題與待確認事項。

## 技術棧版本（已決定：保留最新版）
初版 docs 規劃為 Next.js 14 + 經典 Prisma，但 `create-next-app@latest` 實際安裝的是：
- Next.js **16.2.9** / React **19.2.4** / TailwindCSS **v4**
- Prisma **7.8.0**
- Auth.js **v5**（next-auth@beta 5.0.0-beta.x）+ @auth/prisma-adapter

決定保留最新版，docs 的版本字樣已同步更新。注意以下慣例與 Next 14 / 舊版不同。

## Prisma 7 慣例
- 使用新版 `prisma-client` generator，client 產生在 `src/generated/prisma/`（已被 .gitignore，不進版控）。
- import 路徑為 `@/generated/prisma/client`（見 `src/lib/db.ts`），**不是** `@prisma/client`。
- `DATABASE_URL` 設定在 `prisma.config.ts`（透過 `.env` 載入），`schema.prisma` 的 datasource 不再放 url。
- Prisma 7 的 client 需要 **driver adapter**（不再自動讀 env 連線）：已裝 `@prisma/adapter-pg`，`src/lib/db.ts` 用 `new PrismaPg(DATABASE_URL)` 建 adapter 後傳進 `PrismaClient`。
- 改完 schema 後要跑 `npx prisma generate` 才會更新 client。

## NextAuth → Auth.js v5
- 用 next-auth@beta（v5）搭配 @auth/prisma-adapter。
- v5 設定方式與 v4 不同（`auth.ts` 匯出 handlers / `auth()`），實作登入時請依 v5 文件，勿套用 v4 寫法。

## 待設定（尚未完成）
- [ ] 真正的 `DATABASE_URL`（目前 `.env` 是 placeholder）
- [ ] Supabase 專案與連線測試
- [ ] Google OAuth client id / secret（`AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`）
- [ ] Prisma schema 尚無任何 model（generator 目前產生空 client）

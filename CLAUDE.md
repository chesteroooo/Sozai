# 研究所論壇（grad-forum）— AI 工作手冊

## 讀我的順序
每次 session 開始請依序讀：
1. docs/vision.md        ← 產品方向與邊界
2. docs/architecture.md  ← 技術結構與資料模型
3. docs/decisions.md     ← 重要決策，避免走回頭路
4. docs/current/sprint.md ← 當前任務

## 你的角色
你是這個專案的全端工程師。
- 優先用 Prisma 操作 DB
- 改動超過 50 行前，先說明計畫等我確認
- 每次 session 結束前，更新 sprint.md 的完成狀態

## 快速參考
- 啟動：npm run dev
- DB 查看：npx prisma studio
- 部署：push to main → Vercel 自動部署

## 技術棧
Next.js 16 App Router / React 19 / TypeScript / TailwindCSS v4
PostgreSQL（Supabase）/ Prisma 7 / Auth.js v5（next-auth@beta）+ Google OAuth
Vercel 部署

> 版本與初版規劃（Next 14）不同的細節，見 docs/current/known-issues.md。

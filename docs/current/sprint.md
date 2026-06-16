# 當前迭代（Week 1）

## 本週目標
完成專案初始化與 Prisma Schema

## 待辦
- [x] Prisma schema 寫完（School/Dept/Prof/Post/User/ResearchField）
- [x] Supabase 建好 DB，連線測試通過（用 `prisma db push` 建表，尚未導入 migration 歷史）
- [x] Google OAuth 登入可用
- [x] 首頁靜態版（不需要資料，先把 layout 做出來）

## 下週預計
- 系所頁 API + 前端
- 教授頁 API + 前端

## 給 AI 的注意事項
- 所有 DB 操作走 Prisma，不要直接寫 raw SQL
- 改超過 50 行前先說計畫
- ResearchField 和 Professor 是多對多，用 ProfessorField join table

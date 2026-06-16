# 當前迭代（Week 1）

## 本週目標
完成專案初始化與 Prisma Schema

## 待辦
- [x] Prisma schema 寫完（School/Dept/Prof/Post/User/ResearchField）
- [x] Supabase 建好 DB，連線測試通過（用 `prisma db push` 建表，尚未導入 migration 歷史）
- [x] Google OAuth 登入可用
- [x] 首頁靜態版（不需要資料，先把 layout 做出來）

## 已完成（Week 1 後續進度）
- [x] 首頁接 DB（熱門系所/研究方向）+ 種子資料（npm run db:seed）
- [x] Post 結構化欄位（year/applicationType/outcome/meta）+ 索引
- [x] 身分/匿名策略（ADR-004）：User.displayName、Post.isAnonymous
- [x] 系所頁 /dept/[id]（教授列表 + 文章 + faceted 篩選）
- [x] 教授頁 /prof/[id]、研究方向頁 /field/[slug]
- [x] 共用元件抽離（SiteHeader / PostListItem / lib/labels）

## 接下來
- [ ] 發文頁 /write：登入才能發、類型驅動結構化表單 + 匿名開關
- [ ] 檢舉 / 下架機制（ADR-006）
- [ ] 學生 email 驗證徽章（Phase 2）

## 給 AI 的注意事項
- 所有 DB 操作走 Prisma，不要直接寫 raw SQL
- 改超過 50 行前先說計畫
- ResearchField 和 Professor 是多對多，用 ProfessorField join table

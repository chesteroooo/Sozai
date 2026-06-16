# 系統架構

## 技術選型
- 前端/後端：Next.js 16 App Router（SSR 對 SEO 關鍵）
- 資料庫：PostgreSQL（Supabase 托管）
- ORM：Prisma
- 認證：NextAuth.js + Google OAuth
- 部署：Vercel

## 資料模型（第一版）
School（學校）
  id, name, shortName, logoUrl

Department（系所）
  id, name, schoolId, description

Professor（教授）
  id, name, deptId, researchAreas String[], labName, labUrl

ResearchField（研究方向）
  id, name, slug, description
  → 多對多關聯 Professor

Post（文章）
  id, title, content, type, authorId, deptId, profId, tags String[]
  isAnonymous（預設 true：前台顯示「匿名」，authorId 仍存真實作者）
  year, applicationType, outcome, meta Json（結構化篩選欄位，撐起精準查詢）
  type: 'admission_review' | 'exam_note' | 'qa' | 'field_guide'
  applicationType: 'recommendation' | 'exam' | 'application' | 'other'
  outcome: 'admitted' | 'waitlisted' | 'rejected'

User
  id, name, displayName（公開暱稱）, email, image, role

## 頁面結構
/                    首頁（搜尋 + 熱門系所 + 熱門研究方向）
/school/[id]         學校頁
/dept/[id]           系所頁（教授列表 + 近期文章）
/prof/[id]           教授頁（研究方向 + 相關文章）
/field/[slug]        研究方向頁（哪些系所/教授做這個）
/post/[id]           文章頁
/write               發文

## 搜尋策略
現階段：PostgreSQL LIKE + pg_trgm
未來（MAU > 5 萬）：考慮 Algolia

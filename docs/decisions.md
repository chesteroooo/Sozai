# 架構決策紀錄（ADR）

## ADR-001：不自建密碼登入
日期：2026-06
決定：只支援 Google OAuth（NextAuth.js）
原因：降低資安風險與維護成本
後果：沒有 Google 帳號的用戶無法使用，可接受

## ADR-002：Post 用單一 model + type 欄位
日期：2026-06
決定：心得/口試題/問答/領域導覽 都放同一張表，用 type 區分
原因：搜尋邏輯統一，避免跨表 JOIN
後果：查詢時必須加 type filter

## ADR-003：加入 ResearchField 層
日期：2026-06
決定：在 School→Dept→Prof 之外，加一個 ResearchField 維度
原因：用戶可能從「我對影像辨識有興趣」出發找系所，
      不一定從學校往下找
後果：Professor 與 ResearchField 是多對多，需要 join table

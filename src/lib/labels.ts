// 各 enum 的中文顯示對照（多頁共用）

export const POST_TYPE_LABEL: Record<string, string> = {
  admission_review: "錄取心得",
  exam_note: "考試 / 考古題",
  qa: "問答",
  field_guide: "領域導覽",
};

export const OUTCOME_LABEL: Record<string, string> = {
  admitted: "錄取",
  waitlisted: "備取",
  rejected: "未錄取",
};

export const OUTCOME_STYLE: Record<string, string> = {
  admitted: "bg-emerald-100 text-emerald-700",
  waitlisted: "bg-amber-100 text-amber-700",
  rejected: "bg-slate-200 text-slate-600",
};

export const APP_TYPE_LABEL: Record<string, string> = {
  recommendation: "推甄",
  exam: "考試",
  application: "申請",
  other: "其他",
};

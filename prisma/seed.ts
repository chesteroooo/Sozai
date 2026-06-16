import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// 與 src/lib/db.ts 相同的連線設定（CA 憑證 → 完整 TLS 驗證）。
const connectionString = (process.env.DATABASE_URL ?? "").replace(
  /[?&]sslmode=[^&]*/,
  "",
);
const caPath = path.join(process.cwd(), "certs", "supabase-ca.crt");
const ssl = fs.existsSync(caPath)
  ? { ca: fs.readFileSync(caPath, "utf8"), rejectUnauthorized: true }
  : { rejectUnauthorized: false };
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString, ssl }) });

// ⚠️ 以下皆為「示範用假資料」，人名為虛構，僅供排版與流程驗證。

const schools = [
  { id: "ntu", name: "國立臺灣大學", shortName: "NTU" },
  { id: "nycu", name: "國立陽明交通大學", shortName: "NYCU" },
  { id: "nthu", name: "國立清華大學", shortName: "NTHU" },
  { id: "nccu", name: "國立政治大學", shortName: "NCCU" },
  { id: "ncku", name: "國立成功大學", shortName: "NCKU" },
];

const departments = [
  { id: "ntu-csie", name: "資訊工程學系", schoolId: "ntu", description: "AI、系統、理論全面發展，台灣資工龍頭，推甄競爭最激烈。" },
  { id: "nycu-csie", name: "資訊工程學系", schoolId: "nycu", description: "硬體與系統見長，與新竹半導體產業連結深。" },
  { id: "nthu-cs", name: "資訊工程學系", schoolId: "nthu", description: "理論與 AI 研究紮實，新竹生活圈，與業界合作密切。" },
  { id: "nccu-mis", name: "資訊管理學系", schoolId: "nccu", description: "管理與資訊跨域，商管資源豐富，適合想走產業的人。" },
  { id: "ncku-csie", name: "資訊工程學系", schoolId: "ncku", description: "南部資工重鎮，產學合作多，生活成本友善。" },
  { id: "ntu-im", name: "資訊管理學系", schoolId: "ntu", description: "商管 × 資訊，管科所熱門選擇，量化與商業分析並重。" },
];

const fields = [
  { id: "machine-learning", slug: "machine-learning", name: "機器學習", description: "監督式/非監督式學習、深度學習等。" },
  { id: "computer-vision", slug: "computer-vision", name: "計算機視覺", description: "影像辨識、物件偵測、影像生成等。" },
  { id: "nlp", slug: "nlp", name: "自然語言處理", description: "語言模型、文本理解與生成。" },
  { id: "data-science", slug: "data-science", name: "資料科學", description: "資料分析、統計建模、商業分析。" },
  { id: "security", slug: "security", name: "資訊安全", description: "系統安全、密碼學、網路防禦。" },
  { id: "networks", slug: "networks", name: "計算機網路", description: "網路協定、無線網路、邊緣運算。" },
  { id: "distributed-systems", slug: "distributed-systems", name: "分散式系統", description: "雲端、共識演算法、大規模系統。" },
  { id: "hci", slug: "hci", name: "人機互動", description: "使用者經驗、互動設計、可用性研究。" },
];

const professors = [
  { id: "p1", name: "陳志明", deptId: "ntu-csie", researchAreas: ["機器學習", "計算機視覺"], labName: "視覺智慧實驗室" },
  { id: "p2", name: "林怡君", deptId: "ntu-csie", researchAreas: ["自然語言處理", "資料科學"], labName: "語言與知識實驗室" },
  { id: "p3", name: "王俊傑", deptId: "nycu-csie", researchAreas: ["資訊安全", "計算機網路"], labName: "網路安全實驗室" },
  { id: "p4", name: "李欣樺", deptId: "nthu-cs", researchAreas: ["機器學習", "分散式系統"], labName: "大規模學習實驗室" },
  { id: "p5", name: "張哲瑋", deptId: "nccu-mis", researchAreas: ["資料科學", "人機互動"], labName: "資料與互動實驗室" },
  { id: "p6", name: "黃郁芳", deptId: "ncku-csie", researchAreas: ["計算機視覺", "資料科學"], labName: "影像分析實驗室" },
];

const profFields = [
  { professorId: "p1", fieldId: "machine-learning" },
  { professorId: "p1", fieldId: "computer-vision" },
  { professorId: "p2", fieldId: "nlp" },
  { professorId: "p2", fieldId: "data-science" },
  { professorId: "p3", fieldId: "security" },
  { professorId: "p3", fieldId: "networks" },
  { professorId: "p4", fieldId: "machine-learning" },
  { professorId: "p4", fieldId: "distributed-systems" },
  { professorId: "p5", fieldId: "data-science" },
  { professorId: "p5", fieldId: "hci" },
  { professorId: "p6", fieldId: "computer-vision" },
  { professorId: "p6", fieldId: "data-science" },
];

const seedUser = {
  id: "seed-user",
  name: "Sozai 編輯",
  displayName: "Sozai 編輯",
  email: "seed@sozai.local",
  role: "admin" as const,
};

const posts = [
  {
    id: "post1",
    title: "台大資工推甄心得：書審與面試全紀錄",
    content: "分享我準備台大資工推甄的完整過程……",
    type: "admission_review" as const,
    tags: ["推甄", "面試", "書審"],
    isAnonymous: false,
    year: 2024,
    applicationType: "recommendation" as const,
    outcome: "admitted" as const,
    meta: { "面試形式": "個人面試", "準備時長": "3 個月", "在校排名": "前 10%", "有研究經驗": true },
    authorId: "seed-user",
    deptId: "ntu-csie",
  },
  {
    id: "post2",
    title: "台大資工演算法考古題整理",
    content: "整理近五年資工所演算法常考題型……",
    type: "exam_note" as const,
    tags: ["考試", "演算法"],
    isAnonymous: false,
    year: 2024,
    applicationType: "exam" as const,
    meta: { "用書": ["演算法導論", "計算機概論"], "科目": "演算法" },
    authorId: "seed-user",
    deptId: "ntu-csie",
  },
  {
    id: "post3",
    title: "政大資管書審資料準備重點",
    content: "資管所書審重視動機與專案經驗……",
    type: "admission_review" as const,
    tags: ["書審", "資管"],
    isAnonymous: false,
    year: 2024,
    applicationType: "recommendation" as const,
    outcome: "admitted" as const,
    meta: { "書審重點": "專案經驗與讀書計畫" },
    authorId: "seed-user",
    deptId: "nccu-mis",
  },
  {
    id: "post4",
    title: "陽明交大資工面試常見問題",
    content: "面試時老師最常問的幾個方向……",
    type: "qa" as const,
    tags: ["面試"],
    isAnonymous: false,
    year: 2023,
    applicationType: "recommendation" as const,
    outcome: "waitlisted" as const,
    meta: { "面試形式": "團體面試" },
    authorId: "seed-user",
    deptId: "nycu-csie",
  },
  {
    id: "post5",
    title: "計算機視覺領域入門指南",
    content: "想做影像辨識？這篇帶你認識整個領域……",
    type: "field_guide" as const,
    tags: ["領域導覽", "計算機視覺"],
    isAnonymous: false,
    authorId: "seed-user",
    profId: "p1",
  },
];

async function main() {
  for (const s of schools) {
    await prisma.school.upsert({ where: { id: s.id }, update: s, create: s });
  }
  for (const d of departments) {
    await prisma.department.upsert({ where: { id: d.id }, update: d, create: d });
  }
  for (const f of fields) {
    await prisma.researchField.upsert({ where: { id: f.id }, update: f, create: f });
  }
  for (const p of professors) {
    await prisma.professor.upsert({ where: { id: p.id }, update: p, create: p });
  }
  for (const pf of profFields) {
    await prisma.professorField.upsert({
      where: { professorId_fieldId: { professorId: pf.professorId, fieldId: pf.fieldId } },
      update: {},
      create: pf,
    });
  }
  await prisma.user.upsert({ where: { id: seedUser.id }, update: seedUser, create: seedUser });
  for (const post of posts) {
    await prisma.post.upsert({ where: { id: post.id }, update: post, create: post });
  }

  const counts = {
    schools: await prisma.school.count(),
    departments: await prisma.department.count(),
    professors: await prisma.professor.count(),
    fields: await prisma.researchField.count(),
    posts: await prisma.post.count(),
  };
  console.log("✅ seed 完成：", counts);
}

main()
  .catch((e) => {
    console.error("❌ seed 失敗：", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

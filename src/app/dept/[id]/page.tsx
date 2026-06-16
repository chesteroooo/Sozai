import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { PostListItem } from "@/components/PostListItem";
import { POST_TYPE_LABEL, OUTCOME_LABEL } from "@/lib/labels";

const POST_TYPES = ["admission_review", "exam_note", "qa", "field_guide"] as const;
const OUTCOMES = ["admitted", "waitlisted", "rejected"] as const;

type SP = { [key: string]: string | string[] | undefined };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dept = await prisma.department.findUnique({
    where: { id },
    include: { school: true },
  });
  if (!dept) return { title: "找不到系所 — Sozai" };
  return {
    title: `${dept.school.name} ${dept.name} — 好所在 Sozai`,
    description: dept.description ?? undefined,
  };
}

export default async function DeptPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SP>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  const dept = await prisma.department.findUnique({
    where: { id },
    include: {
      school: true,
      professors: {
        orderBy: { name: "asc" },
        include: { _count: { select: { posts: true } } },
      },
    },
  });
  if (!dept) notFound();

  // 解析篩選參數（驗證後才用，避免亂值打進查詢）
  const sv = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined);
  const typeParam = POST_TYPES.includes(sv("type") as never)
    ? (sv("type") as (typeof POST_TYPES)[number])
    : undefined;
  const outcomeParam = OUTCOMES.includes(sv("outcome") as never)
    ? (sv("outcome") as (typeof OUTCOMES)[number])
    : undefined;
  const yearStr = sv("year");
  const yearParam = yearStr && /^\d{4}$/.test(yearStr) ? Number(yearStr) : undefined;

  const posts = await prisma.post.findMany({
    where: {
      deptId: dept.id,
      ...(typeParam ? { type: typeParam } : {}),
      ...(outcomeParam ? { outcome: outcomeParam } : {}),
      ...(yearParam ? { year: yearParam } : {}),
    },
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  // 該系所文章出現過的年度（給年度篩選用）
  const yearRows = await prisma.post.findMany({
    where: { deptId: dept.id, year: { not: null } },
    select: { year: true },
    distinct: ["year"],
    orderBy: { year: "desc" },
  });
  const years = yearRows.map((r) => r.year!).filter((y) => y != null);

  const current: Record<string, string | undefined> = {
    type: typeParam,
    outcome: outcomeParam,
    year: yearParam ? String(yearParam) : undefined,
  };
  const hrefWith = (key: "type" | "outcome" | "year", value?: string) => {
    const next = { ...current, [key]: value };
    const qs = new URLSearchParams(
      Object.entries(next).filter(([, v]) => v) as [string, string][],
    ).toString();
    return `/dept/${dept.id}${qs ? `?${qs}` : ""}`;
  };
  const hasFilter = Boolean(typeParam || outcomeParam || yearParam);

  const chip =
    "rounded-full border px-3 py-1 text-sm transition-colors";
  const chipOn = "border-emerald-600 bg-emerald-600 text-white";
  const chipOff = "border-slate-200 text-slate-600 hover:border-emerald-300";

  return (
    <div className="flex flex-1 flex-col bg-white text-slate-900">
      <SiteHeader />

      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        {/* 系所標題 */}
        <nav className="text-sm text-slate-400">
          <Link href="/" className="hover:text-emerald-700">
            首頁
          </Link>
          <span className="mx-1">/</span>
          <span>{dept.school.name}</span>
        </nav>
        <div className="mt-2 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600/10 text-base font-bold text-emerald-700">
            {dept.school.shortName ?? dept.school.name.slice(0, 2)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{dept.name}</h1>
            <p className="text-sm text-slate-500">{dept.school.name}</p>
          </div>
        </div>
        {dept.description && (
          <p className="mt-4 max-w-2xl text-slate-600">{dept.description}</p>
        )}

        {/* 教授列表 */}
        <section className="mt-12">
          <h2 className="text-lg font-bold text-slate-900">
            教授（{dept.professors.length}）
          </h2>
          {dept.professors.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">尚無教授資料。</p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {dept.professors.map((p) => (
                <Link
                  key={p.id}
                  href="#"
                  className="rounded-xl border border-slate-200 p-4 transition-shadow hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">{p.name}</h3>
                    <span className="text-xs text-slate-400">
                      {p._count.posts} 篇
                    </span>
                  </div>
                  {p.labName && (
                    <p className="mt-1 text-xs text-slate-500">{p.labName}</p>
                  )}
                  {p.researchAreas.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {p.researchAreas.map((a) => (
                        <span
                          key={a}
                          className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 文章 + 篩選 */}
        <section className="mt-12">
          <h2 className="text-lg font-bold text-slate-900">文章 / 心得</h2>

          {/* 篩選器 */}
          <div className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <FilterRow label="類型">
              {POST_TYPES.map((t) => (
                <Link
                  key={t}
                  href={hrefWith("type", typeParam === t ? undefined : t)}
                  className={`${chip} ${typeParam === t ? chipOn : chipOff}`}
                >
                  {POST_TYPE_LABEL[t]}
                </Link>
              ))}
            </FilterRow>
            <FilterRow label="結果">
              {OUTCOMES.map((o) => (
                <Link
                  key={o}
                  href={hrefWith("outcome", outcomeParam === o ? undefined : o)}
                  className={`${chip} ${outcomeParam === o ? chipOn : chipOff}`}
                >
                  {OUTCOME_LABEL[o]}
                </Link>
              ))}
            </FilterRow>
            {years.length > 0 && (
              <FilterRow label="年度">
                {years.map((y) => (
                  <Link
                    key={y}
                    href={hrefWith("year", yearParam === y ? undefined : String(y))}
                    className={`${chip} ${yearParam === y ? chipOn : chipOff}`}
                  >
                    {y}
                  </Link>
                ))}
              </FilterRow>
            )}
            {hasFilter && (
              <Link
                href={`/dept/${dept.id}`}
                className="inline-block text-sm text-emerald-700 hover:underline"
              >
                清除篩選 ✕
              </Link>
            )}
          </div>

          {/* 文章列表 */}
          <div className="mt-5">
            <p className="mb-3 text-sm text-slate-400">{posts.length} 篇結果</p>
            {posts.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-400">
                {hasFilter ? "這個條件下還沒有文章。" : "這個系所還沒有文章。"}
              </p>
            ) : (
              <ul className="space-y-3">
                {posts.map((post) => (
                  <PostListItem key={post.id} post={post} />
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-12 shrink-0 text-sm font-medium text-slate-500">
        {label}
      </span>
      {children}
    </div>
  );
}

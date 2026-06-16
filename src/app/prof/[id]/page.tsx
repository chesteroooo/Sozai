import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { PostListItem } from "@/components/PostListItem";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prof = await prisma.professor.findUnique({
    where: { id },
    include: { dept: { include: { school: true } } },
  });
  if (!prof) return { title: "找不到教授 — Sozai" };
  return {
    title: `${prof.name} — ${prof.dept.school.name} ${prof.dept.name} — 好所在 Sozai`,
  };
}

export default async function ProfPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prof = await prisma.professor.findUnique({
    where: { id },
    include: {
      dept: { include: { school: true } },
      fields: { include: { field: true } },
      posts: { include: { author: true }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!prof) notFound();

  return (
    <div className="flex flex-1 flex-col bg-white text-slate-900">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        <nav className="text-sm text-slate-400">
          <Link href="/" className="hover:text-emerald-700">
            首頁
          </Link>
          <span className="mx-1">/</span>
          <Link
            href={`/dept/${prof.dept.id}`}
            className="hover:text-emerald-700"
          >
            {prof.dept.school.name} {prof.dept.name}
          </Link>
        </nav>

        <h1 className="mt-2 text-2xl font-bold text-slate-900">{prof.name}</h1>
        <p className="text-sm text-slate-500">
          <Link
            href={`/dept/${prof.dept.id}`}
            className="hover:text-emerald-700"
          >
            {prof.dept.school.name} · {prof.dept.name}
          </Link>
        </p>
        {prof.labName && (
          <p className="mt-2 text-slate-600">
            實驗室：
            {prof.labUrl ? (
              <a
                href={prof.labUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:underline"
              >
                {prof.labName}
              </a>
            ) : (
              prof.labName
            )}
          </p>
        )}

        {/* 研究方向（關聯到 ResearchField） */}
        {prof.fields.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-bold text-slate-900">研究方向</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {prof.fields.map(({ field }) => (
                <Link
                  key={field.id}
                  href={`/field/${field.slug}`}
                  className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
                >
                  {field.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 研究領域關鍵字（自由文字） */}
        {prof.researchAreas.length > 0 && (
          <section className="mt-6">
            <h2 className="text-lg font-bold text-slate-900">研究領域關鍵字</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {prof.researchAreas.map((a) => (
                <span
                  key={a}
                  className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600"
                >
                  {a}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* 相關文章 */}
        <section className="mt-8">
          <h2 className="text-lg font-bold text-slate-900">
            相關文章（{prof.posts.length}）
          </h2>
          {prof.posts.length === 0 ? (
            <p className="mt-2 text-sm text-slate-400">還沒有相關文章。</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {prof.posts.map((post) => (
                <PostListItem key={post.id} post={post} />
              ))}
            </ul>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

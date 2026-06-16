import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { PostListItem } from "@/components/PostListItem";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const field = await prisma.researchField.findUnique({ where: { slug } });
  if (!field) return { title: "找不到研究方向 — Sozai" };
  return {
    title: `${field.name} — 好所在 Sozai`,
    description: field.description ?? undefined,
  };
}

export default async function FieldPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const field = await prisma.researchField.findUnique({
    where: { slug },
    include: {
      professors: {
        include: {
          professor: { include: { dept: { include: { school: true } } } },
        },
      },
    },
  });
  if (!field) notFound();

  const profs = field.professors.map((pf) => pf.professor);
  const posts = profs.length
    ? await prisma.post.findMany({
        where: { profId: { in: profs.map((p) => p.id) } },
        include: { author: true },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="flex flex-1 flex-col bg-white text-slate-900">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        <nav className="text-sm text-slate-400">
          <Link href="/" className="hover:text-emerald-700">
            首頁
          </Link>
          <span className="mx-1">/</span>
          <span>研究方向</span>
        </nav>

        <h1 className="mt-2 text-2xl font-bold text-slate-900">{field.name}</h1>
        {field.description && (
          <p className="mt-2 max-w-2xl text-slate-600">{field.description}</p>
        )}

        {/* 做這個方向的教授 */}
        <section className="mt-8">
          <h2 className="text-lg font-bold text-slate-900">
            研究這個方向的教授（{profs.length}）
          </h2>
          {profs.length === 0 ? (
            <p className="mt-2 text-sm text-slate-400">尚無教授資料。</p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {profs.map((p) => (
                <Link
                  key={p.id}
                  href={`/prof/${p.id}`}
                  className="rounded-xl border border-slate-200 p-4 transition-shadow hover:shadow-sm"
                >
                  <h3 className="font-semibold text-slate-900">{p.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {p.dept.school.name} · {p.dept.name}
                  </p>
                  {p.labName && (
                    <p className="mt-1 text-xs text-slate-400">{p.labName}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 相關文章 */}
        <section className="mt-8">
          <h2 className="text-lg font-bold text-slate-900">
            相關文章（{posts.length}）
          </h2>
          {posts.length === 0 ? (
            <p className="mt-2 text-sm text-slate-400">還沒有相關文章。</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {posts.map((post) => (
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

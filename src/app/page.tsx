import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/lib/db";

export default async function Home() {
  const session = await auth();

  // 熱門系所：依文章數排序，帶出學校、教授研究領域、文章數。
  const depts = await prisma.department.findMany({
    take: 6,
    orderBy: { posts: { _count: "desc" } },
    include: {
      school: true,
      professors: { select: { researchAreas: true } },
      _count: { select: { posts: true } },
    },
  });

  // 熱門研究方向：依關聯教授數排序。
  const fields = await prisma.researchField.findMany({
    take: 10,
    orderBy: { professors: { _count: "desc" } },
    include: { _count: { select: { professors: true } } },
  });

  return (
    <div className="flex flex-1 flex-col bg-white text-slate-900">
      {/* 導覽列 */}
      <header className="sticky top-0 z-10 border-b border-slate-100 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-emerald-700">
              好所在
            </span>
            <span className="text-sm font-medium text-slate-400">Sozai</span>
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="#depts"
              className="hidden text-slate-600 transition-colors hover:text-emerald-700 sm:block"
            >
              系所
            </Link>
            <Link
              href="#fields"
              className="hidden text-slate-600 transition-colors hover:text-emerald-700 sm:block"
            >
              研究方向
            </Link>
            {session?.user ? (
              <div className="flex items-center gap-3">
                {session.user.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt=""
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <span className="hidden text-sm text-slate-600 sm:block">
                  {session.user.name}
                </span>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <button
                    type="submit"
                    className="rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    登出
                  </button>
                </form>
              </div>
            ) : (
              <form
                action={async () => {
                  "use server";
                  await signIn("google");
                }}
              >
                <button
                  type="submit"
                  className="rounded-full bg-emerald-600 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-700"
                >
                  用 Google 登入
                </button>
              </form>
            )}
          </div>
        </nav>
      </header>

      {/* Hero + 搜尋 */}
      <section className="bg-gradient-to-b from-emerald-50 to-white">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            在台灣讀研究所的<span className="text-emerald-700">好所在</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            Your map through graduate school in Taiwan.
            <br className="hidden sm:block" />
            教授研究方向、口試題目、書審心得，一站找齊。
          </p>

          <form className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full border border-slate-200 bg-white p-2 shadow-sm">
            <input
              type="search"
              placeholder="搜尋學校、系所、教授或研究方向…"
              className="flex-1 bg-transparent px-4 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none"
              aria-label="搜尋"
            />
            <button
              type="submit"
              className="rounded-full bg-emerald-600 px-5 py-2 font-medium text-white transition-colors hover:bg-emerald-700"
            >
              搜尋
            </button>
          </form>

          {/* 兩個瀏覽入口 */}
          <div className="mx-auto mt-6 flex max-w-xl flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="#depts"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
            >
              🏫 按學校 / 系所瀏覽
            </Link>
            <Link
              href="#fields"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
            >
              🧭 按研究方向瀏覽
            </Link>
          </div>
        </div>
      </section>

      {/* 熱門系所 */}
      <section id="depts" className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">熱門系所</h2>
            <p className="mt-1 text-sm text-slate-500">考生最常查看的系所</p>
          </div>
          <Link
            href="#"
            className="text-sm font-medium text-emerald-700 hover:underline"
          >
            看全部 →
          </Link>
        </div>

        {depts.length === 0 ? (
          <p className="text-sm text-slate-400">尚無系所資料。</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {depts.map((d) => {
              const areas = Array.from(
                new Set(d.professors.flatMap((p) => p.researchAreas)),
              ).slice(0, 3);
              return (
                <Link
                  key={d.id}
                  href={`/dept/${d.id}`}
                  className="group rounded-2xl border border-slate-200 p-5 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600/10 text-sm font-bold text-emerald-700">
                      {d.school.shortName ?? d.school.name.slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700">
                        {d.name}
                      </h3>
                      <p className="text-xs text-slate-500">{d.school.name}</p>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                    {d.description ?? "（尚無系所簡介）"}
                  </p>
                  {areas.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {areas.map((a) => (
                        <span
                          key={a}
                          className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="mt-4 text-xs text-slate-400">
                    {d._count.posts} 篇心得
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* 熱門研究方向 */}
      <section id="fields" className="bg-slate-50">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-bold text-slate-900">熱門研究方向</h2>
          <p className="mt-1 text-sm text-slate-500">
            還沒選定系所？從你有興趣的領域開始找。
          </p>
          {fields.length === 0 ? (
            <p className="mt-8 text-sm text-slate-400">尚無研究方向資料。</p>
          ) : (
            <div className="mt-8 flex flex-wrap gap-3">
              {fields.map((f) => (
                <Link
                  key={f.id}
                  href={`/field/${f.slug}`}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
                >
                  <span className="font-medium">{f.name}</span>
                  <span className="text-xs text-slate-400">
                    {f._count.professors}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 頁尾 */}
      <footer className="mt-auto border-t border-slate-100">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="font-bold text-emerald-700">好所在 Sozai</span>
            <span className="ml-2">Your map through graduate school in Taiwan.</span>
          </div>
          <p className="text-xs text-slate-400">
            種子系所：資工所、管科所 · © 2026 Sozai
          </p>
        </div>
      </footer>
    </div>
  );
}

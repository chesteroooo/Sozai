import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";

// 首頁靜態版：先用假資料排版，尚未接 DB（見 docs/current/sprint.md）。
// 之後會改成從 Prisma 撈真正的熱門系所／研究方向。

const HOT_DEPTS = [
  {
    school: "國立臺灣大學",
    shortName: "NTU",
    name: "資訊工程學系",
    desc: "AI、系統、理論全面發展，台灣資工龍頭，推甄競爭最激烈。",
    areas: ["機器學習", "計算機視覺", "分散式系統"],
    posts: 42,
  },
  {
    school: "國立陽明交通大學",
    shortName: "NYCU",
    name: "資訊工程學系",
    desc: "硬體與系統見長，與新竹半導體產業連結深。",
    areas: ["計算機網路", "資訊安全", "嵌入式系統"],
    posts: 31,
  },
  {
    school: "國立清華大學",
    shortName: "NTHU",
    name: "資訊工程學系",
    desc: "理論與 AI 研究紮實，新竹生活圈，與業界合作密切。",
    areas: ["演算法", "自然語言處理", "機器學習"],
    posts: 28,
  },
  {
    school: "國立政治大學",
    shortName: "NCCU",
    name: "資訊管理學系",
    desc: "管理與資訊跨域，商管資源豐富，適合想走產業的人。",
    areas: ["資料科學", "FinTech", "人機互動"],
    posts: 19,
  },
  {
    school: "國立成功大學",
    shortName: "NCKU",
    name: "資訊工程學系",
    desc: "南部資工重鎮，產學合作多，生活成本友善。",
    areas: ["計算機視覺", "物聯網", "資料探勘"],
    posts: 23,
  },
  {
    school: "國立臺灣大學",
    shortName: "NTU",
    name: "資訊管理學系",
    desc: "商管 × 資訊，管科所熱門選擇，量化與商業分析並重。",
    areas: ["資料科學", "商業分析", "最佳化"],
    posts: 17,
  },
];

const HOT_FIELDS = [
  { name: "機器學習", count: 38 },
  { name: "資料科學", count: 30 },
  { name: "計算機視覺", count: 25 },
  { name: "自然語言處理", count: 21 },
  { name: "資訊安全", count: 18 },
  { name: "計算機網路", count: 16 },
  { name: "分散式系統", count: 14 },
  { name: "人機互動", count: 12 },
  { name: "物聯網", count: 11 },
  { name: "演算法理論", count: 9 },
];

export default async function Home() {
  const session = await auth();

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

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {HOT_DEPTS.map((d) => (
            <Link
              key={`${d.shortName}-${d.name}`}
              href="#"
              className="group rounded-2xl border border-slate-200 p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600/10 text-sm font-bold text-emerald-700">
                  {d.shortName}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700">
                    {d.name}
                  </h3>
                  <p className="text-xs text-slate-500">{d.school}</p>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-slate-600">{d.desc}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {d.areas.map((a) => (
                  <span
                    key={a}
                    className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600"
                  >
                    {a}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-400">{d.posts} 篇心得</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 熱門研究方向 */}
      <section id="fields" className="bg-slate-50">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-bold text-slate-900">熱門研究方向</h2>
          <p className="mt-1 text-sm text-slate-500">
            還沒選定系所？從你有興趣的領域開始找。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {HOT_FIELDS.map((f) => (
              <Link
                key={f.name}
                href="#"
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
              >
                <span className="font-medium">{f.name}</span>
                <span className="text-xs text-slate-400">{f.count}</span>
              </Link>
            ))}
          </div>
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

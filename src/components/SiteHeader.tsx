import Link from "next/link";

// 內頁共用的頁首（首頁有自己含登入按鈕的版本）。
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-100 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-xl font-bold tracking-tight text-emerald-700">
            好所在
          </span>
          <span className="text-sm font-medium text-slate-400">Sozai</span>
        </Link>
        <Link href="/" className="text-sm text-slate-500 hover:text-emerald-700">
          ← 回首頁
        </Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-8 text-xs text-slate-400">
        好所在 Sozai · Your map through graduate school in Taiwan.
      </div>
    </footer>
  );
}

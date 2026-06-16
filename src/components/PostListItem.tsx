import {
  POST_TYPE_LABEL,
  OUTCOME_LABEL,
  OUTCOME_STYLE,
  APP_TYPE_LABEL,
} from "@/lib/labels";

// 文章列表項目（系所頁 / 教授頁 / 研究方向頁共用）。
// 用結構型別，能直接吃 Prisma 查詢（含 author）的結果。
type PostForList = {
  id: string;
  title: string;
  content: string;
  type: string;
  outcome: string | null;
  applicationType: string | null;
  year: number | null;
  isAnonymous: boolean;
  createdAt: Date;
  author: { displayName: string | null; name: string | null };
};

export function PostListItem({ post }: { post: PostForList }) {
  const author = post.isAnonymous
    ? "匿名"
    : post.author.displayName ?? post.author.name ?? "使用者";

  return (
    <li className="rounded-xl border border-slate-200 p-4 transition-shadow hover:shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
          {POST_TYPE_LABEL[post.type]}
        </span>
        {post.outcome && (
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-medium ${OUTCOME_STYLE[post.outcome]}`}
          >
            {OUTCOME_LABEL[post.outcome]}
          </span>
        )}
        {post.applicationType && (
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            {APP_TYPE_LABEL[post.applicationType]}
          </span>
        )}
        {post.year && (
          <span className="text-xs text-slate-400">{post.year} 年</span>
        )}
      </div>
      <h3 className="mt-2 font-semibold text-slate-900">{post.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-slate-600">{post.content}</p>
      <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
        <span>{author}</span>
        <span>·</span>
        <span>{post.createdAt.toISOString().slice(0, 10)}</span>
      </div>
    </li>
  );
}

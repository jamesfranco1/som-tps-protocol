"use client";

const TYPE_LABELS = {
  feed: "Live Feed",
  analysis: "Analysis",
  video: "Video",
};

export default function ContentCard({ item }) {
  const minutes = item.durationSeconds
    ? Math.ceil(item.durationSeconds / 60)
    : null;

  const typeLabel = TYPE_LABELS[item.type] || "Video";

  const hasThumbnail = item.type === "video" && item.thumbnailUrl;

  return (
    <a
      href={`/watch/${item.id}`}
      className="glass block overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-white/16 hover:shadow-panel group"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900">
        {hasThumbnail ? (
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4">
            <span className="text-xs uppercase tracking-wider text-soft">
              {typeLabel}
            </span>
            <span className="max-w-[14rem] text-center text-sm text-muted">
              Premium {typeLabel.toLowerCase()} access
            </span>
          </div>
        )}

        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-full border border-white/10 bg-black/45 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-white/75 backdrop-blur-md">
            {typeLabel}
          </span>
          {item.isAgent && (
            <span className="rounded-full border border-white/10 bg-white/[0.08] px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-white/85 backdrop-blur-md">
              Agent
            </span>
          )}
        </div>
      </div>

      <div className="p-5 text-left">
        <div className="mb-2 flex items-center gap-2">
          <h3 className="text-xl font-semibold">{item.title}</h3>
        </div>
        <p className="mb-4 text-sm leading-6 text-muted">{item.description}</p>
        <div className="flex items-center justify-between text-xs text-soft">
          <div className="flex items-center gap-2">
            <span>{item.creatorName}</span>
          </div>
          <div className="flex items-center gap-2">
            {minutes && <span>{minutes} min</span>}
          </div>
        </div>
      </div>
    </a>
  );
}

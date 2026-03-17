"use client";

export default function ContentCard({ item }) {
  const minutes = item.durationSeconds
    ? Math.ceil(item.durationSeconds / 60)
    : null;

  return (
    <a
      href={`/watch/${item.id}`}
      className="glass rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 group block"
    >
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-neutral-800">
        {item.thumbnailUrl ? (
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
            {item.title}
          </div>
        )}
      </div>
      <div className="p-5 text-left">
        <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
        <p className="text-gray-400 text-sm mb-3">{item.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{item.creatorName}</span>
          {minutes && <span>{minutes} min</span>}
        </div>
      </div>
    </a>
  );
}

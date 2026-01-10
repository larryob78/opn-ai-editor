interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`bg-zinc-800 rounded animate-pulse ${className}`} />
  )
}

export function SkeletonCard() {
  return (
    <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
      <Skeleton className="w-full h-24 mb-3" />
      <Skeleton className="w-3/4 h-4 mb-2" />
      <Skeleton className="w-1/2 h-3" />
    </div>
  )
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded" />
          <div className="flex-1">
            <Skeleton className="w-3/4 h-4 mb-2" />
            <Skeleton className="w-1/2 h-3" />
          </div>
        </div>
      ))}
    </div>
  )
}

interface RatingDistributionProps {
  distribution: number[]
}

export function RatingDistribution({ distribution }: RatingDistributionProps) {
  const total = distribution.reduce((sum, count) => sum + count, 0)

  const rows = Array.from({ length: 10 })
    .map((_, idx) => {
      const score = 10 - idx
      const count = distribution[score - 1] || 0
      const percentage = total > 0 ? (count / total) * 100 : 0
      return { score, count, percentage }
    })

  return (
    <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-xl backdrop-blur-md space-y-4">
      <h3 className="text-lg font-bold text-zinc-100">Rating Distribution</h3>
      
      {total === 0 ? (
        <p className="text-sm text-zinc-500 text-center py-6">No ratings submitted yet.</p>
      ) : (
        <div className="space-y-2">
          {rows.map(({ score, count, percentage }) => (
            <div key={score} className="flex items-center text-xs">
              <span className="w-5 text-zinc-400 font-medium text-right mr-2">{score}</span>
              <div className="flex-1 h-3 bg-zinc-800/40 rounded overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-zinc-500 text-right ml-2">{count}</span>
            </div>
          ))}
          <p className="text-[10px] text-zinc-500 text-center pt-2">
            Based on {total} community rating{total > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  )
}

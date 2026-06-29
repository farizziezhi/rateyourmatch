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
    <div className="bg-[#1e1d1d]/30 border border-[#1e1d1d] p-6 rounded-xl backdrop-blur-md space-y-4">
      <h3 className="text-lg font-bold text-[#fefcfb]">Rating Distribution</h3>
      
      {total === 0 ? (
        <p className="text-sm text-[#b8b9bc] text-center py-6">No ratings submitted yet.</p>
      ) : (
        <div className="space-y-2">
          {rows.map(({ score, count, percentage }) => (
            <div key={score} className="flex items-center text-xs">
              <span className="w-5 text-[#b8b9bc] font-medium text-right mr-2">{score}</span>
              <div className="flex-1 h-3 bg-[#1e1d1d] rounded overflow-hidden">
                <div
                  className="h-full bg-[#5f4dbd] rounded transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-[#b8b9bc] text-right ml-2">{count}</span>
            </div>
          ))}
          <p className="text-[10px] text-[#b8b9bc] text-center pt-2">
            Based on {total} community rating{total > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  )
}

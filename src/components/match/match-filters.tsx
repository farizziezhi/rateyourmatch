'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

const STAGES = [
  { label: 'All Stages', value: '' },
  { label: 'Group Stage', value: 'GROUP_STAGE' },
  { label: 'Round of 32', value: 'LAST_32' },
  { label: 'Round of 16', value: 'LAST_16' },
  { label: 'Quarter-Finals', value: 'QUARTER_FINALS' },
  { label: 'Semi-Finals', value: 'SEMI_FINALS' },
  { label: 'Third Place', value: 'THIRD_PLACE' },
  { label: 'Final', value: 'FINAL' },
]

const GROUPS = [
  { label: 'All Groups', value: '' },
  ...['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'].map(g => ({
    label: `Group ${g}`,
    value: g
  }))
]

export function MatchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentStage = searchParams.get('stage') || ''
  const currentGroup = searchParams.get('group') || ''

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    // If we change stage to anything but GROUP_STAGE, group filter makes no sense, so remove it
    if (key === 'stage' && value !== 'GROUP_STAGE') {
      params.delete('group')
    }

    router.push(`/matches?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex flex-col space-y-4 glass-panel p-4 rounded-xl shadow-lg">
      {/* Stage Filters */}
      <div className="flex flex-col space-y-2">
        <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Stage</span>
        <div className="flex flex-wrap gap-1.5">
          {STAGES.map((s) => (
            <Button
              key={s.value}
              variant={currentStage === s.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilters('stage', s.value)}
              className={`text-xs font-semibold cursor-pointer transition-all duration-350 px-3 py-1.5 h-8 ${
                currentStage === s.value 
                  ? 'bg-emerald-700 hover:bg-emerald-600 text-zinc-100 font-bold' 
                  : 'border-zinc-800 bg-zinc-950/20 text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200'
              }`}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Group Filters */}
      {(currentStage === '' || currentStage === 'GROUP_STAGE') && (
        <div className="flex flex-col space-y-2 border-t border-zinc-800/50 pt-3">
          <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Group</span>
          <div className="flex flex-wrap gap-1.5">
            {GROUPS.map((g) => (
              <Button
                key={g.value}
                variant={currentGroup === g.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateFilters('group', g.value)}
                className={`text-xs px-2.5 py-1 h-8 cursor-pointer transition-all duration-200 ${
                  currentGroup === g.value
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-450 font-bold hover:bg-emerald-500/25'
                    : 'border-zinc-800/80 bg-zinc-950/10 text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200'
                }`}
              >
                {g.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

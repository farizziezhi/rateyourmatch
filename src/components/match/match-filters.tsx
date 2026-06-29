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
    <div className="flex flex-col space-y-4 bg-zinc-950/40 border border-zinc-800 p-4 rounded-xl backdrop-blur-md">
      {/* Stage Filters */}
      <div className="flex flex-col space-y-2">
        <span className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">Stage</span>
        <div className="flex flex-wrap gap-2">
          {STAGES.map((s) => (
            <Button
              key={s.value}
              variant={currentStage === s.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilters('stage', s.value)}
              className={`text-xs font-medium cursor-pointer transition-all duration-200 ${
                currentStage === s.value 
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold' 
                  : 'border-zinc-800 bg-zinc-900/30 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100'
              }`}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Group Filters */}
      {(currentStage === '' || currentStage === 'GROUP_STAGE') && (
        <div className="flex flex-col space-y-2 border-t border-zinc-800/80 pt-3">
          <span className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">Group</span>
          <div className="flex flex-wrap gap-1.5">
            {GROUPS.map((g) => (
              <Button
                key={g.value}
                variant={currentGroup === g.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateFilters('group', g.value)}
                className={`text-xs px-2.5 py-1 h-8 cursor-pointer transition-all duration-200 ${
                  currentGroup === g.value
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 font-semibold hover:bg-emerald-500/30'
                    : 'border-zinc-800 bg-zinc-900/10 text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-300'
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

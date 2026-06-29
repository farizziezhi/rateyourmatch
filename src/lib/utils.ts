import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatStageName(stage: string): string {
  switch (stage) {
    case 'GROUP_STAGE': return 'Group Stage'
    case 'ROUND_OF_32': return 'Round of 32'
    case 'ROUND_OF_16': return 'Round of 16'
    case 'QUARTER_FINALS': return 'Quarter-Finals'
    case 'SEMI_FINALS': return 'Semi-Finals'
    case 'THIRD_PLACE': return 'Third Place Play-off'
    case 'FINAL': return 'Final'
    default: return stage.replace('_', ' ')
  }
}

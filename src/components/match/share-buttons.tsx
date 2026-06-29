'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Share2, Send, Check, Link2 } from 'lucide-react'

interface ShareButtonsProps {
  matchId: number
  homeTeamName: string
  awayTeamName: string
  homeScore: number | null
  awayScore: number | null
}

export function ShareButtons({
  matchId,
  homeTeamName,
  awayTeamName,
  homeScore,
  awayScore,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    setShareUrl(`${window.location.origin}/matches/${matchId}`)
  }, [matchId])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2050)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const scoreText = homeScore !== null && awayScore !== null 
    ? `ended ${homeScore}-${awayScore}` 
    : 'is coming up'
  const text = `Check out the fan ratings for ${homeTeamName} vs ${awayTeamName} which ${scoreText} in the 2026 World Cup! @RateYourMatch`

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${shareUrl}`)}`

  return (
    <div className="flex items-center space-x-2 bg-zinc-950/40 border border-zinc-900 px-3 py-1.5 rounded-lg text-xs text-zinc-400">
      <span className="font-semibold text-zinc-500 uppercase tracking-wider text-[10px] mr-1 flex items-center">
        <Share2 className="h-3 w-3 mr-1" /> Share:
      </span>
      
      {/* Twitter Share */}
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
        <Button variant="ghost" size="sm" className="h-7 px-2 hover:bg-zinc-900 hover:text-emerald-400 text-xs font-semibold cursor-pointer">
          Twitter
        </Button>
      </a>

      {/* WhatsApp Share */}
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <Button variant="ghost" size="sm" className="h-7 px-2 hover:bg-zinc-900 hover:text-emerald-400 text-xs font-semibold cursor-pointer flex items-center space-x-1">
          <Send className="h-3 w-3" />
          <span>WhatsApp</span>
        </Button>
      </a>

      {/* Copy Link */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="h-7 px-2 hover:bg-zinc-900 hover:text-emerald-400 text-xs font-semibold cursor-pointer flex items-center space-x-1"
      >
        {copied ? (
          <>
            <Check className="h-3 w-3 text-emerald-400" />
            <span className="text-emerald-400">Copied!</span>
          </>
        ) : (
          <>
            <Link2 className="h-3 w-3" />
            <span>Copy Link</span>
          </>
        )}
      </Button>
    </div>
  )
}

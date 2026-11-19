import React from 'react'

/**
 * Shows the three highest-scoring players.
 *
 * @param {{ players?: Array<{ name: string, gym: string, pts: number, isMe?: boolean, avatarUrl?: string }> }} props
 */
export default function TopThreeChallenge({ players = [] }) {
  const topPlayers = [...players]
    .sort((a, b) => {
      const pointsDifference = (Number(b.pts) || 0) - (Number(a.pts) || 0)
      if (pointsDifference !== 0) return pointsDifference
      return Number(Boolean(b.isMe)) - Number(Boolean(a.isMe))
    })
    .slice(0, 3)

  if (topPlayers.length === 0) return null

  return (
    <ol className="w-full min-w-0 space-y-2 rounded-2xl border border-[#26302a] bg-[#0b0d0c] p-3 sm:p-4">
      {topPlayers.map((player, index) => {
        const rank = index + 1
        const name = player.name?.trim() || 'ผู้เล่น'
        const initial = name.charAt(0).toUpperCase()

        return (
          <li
            key={`${name}-${rank}`}
            className={`flex min-w-0 items-center gap-2.5 rounded-xl border px-3 py-3 sm:gap-3 sm:px-4 ${
              rank === 1
                ? 'border-[#a3e635] bg-[#182216]'
                : 'border-[#252d28] bg-[#141816]'
            }`}
          >
            <span
              className={`w-5 shrink-0 text-center text-sm font-bold ${
                rank === 1 ? 'text-[#a3e635]' : 'text-white/60'
              }`}
              aria-label={`อันดับ ${rank}`}
            >
              {rank}
            </span>

            {player.avatarUrl ? (
              <img
                src={player.avatarUrl}
                alt={`${name} avatar`}
                className="h-10 w-10 shrink-0 rounded-full object-cover"
                loading="lazy"
              />
            ) : (
              <span
                aria-hidden="true"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#263226] text-sm font-semibold text-[#a3e635]"
              >
                {initial}
              </span>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white" title={name}>
                {name}{player.isMe ? ' (คุณ)' : ''}
              </p>
              <p className="truncate text-xs text-white/55" title={`สาขา: ${player.gym || '-'}`}>
                สาขา: {player.gym || '-'}
              </p>
            </div>

            <span className="shrink-0 whitespace-nowrap pl-1 text-xs font-bold text-[#a3e635] sm:text-sm">
              {Number(player.pts) || 0} PTS
            </span>
          </li>
        )
      })}
    </ol>
  )
}

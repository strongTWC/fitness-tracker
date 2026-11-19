import React from 'react'

export default function TopThreeChallenge({ players = [] }) {
  const topPlayers = [...players]
    .sort((a, b) => {
      const pointsDifference = (Number(b.pts) || 0) - (Number(a.pts) || 0)
      return pointsDifference || Number(Boolean(b.isMe)) - Number(Boolean(a.isMe))
    })
    .slice(0, 3)

  if (topPlayers.length === 0) return null

  return (
    <section className="top-three-challenge" aria-label="กระดานผู้นำ 3 อันดับแรก">
      <header className="top-three-header">
        <div><span className="top-three-eyebrow">MONTHLY GYM CHALLENGE</span><h2>Top 3 นักเข้ายิม</h2></div>
        <span className="top-three-badge">อันดับประจำเดือน</span>
      </header>
      <ol className="top-three-list">
        {topPlayers.map((player, index) => {
          const rank = index + 1
          const name = player.name?.trim() || 'ผู้เล่น'
          const initial = name.charAt(0).toUpperCase()
          return (
            <li className={`top-three-row ${rank === 1 ? 'top-three-first' : ''}`} key={player.id || `${name}-${rank}`}>
              <span className={`top-three-rank ${rank === 1 ? 'rank-first' : ''}`} aria-label={`อันดับ ${rank}`}>{rank}</span>
              {player.avatarUrl ? <img src={player.avatarUrl} alt={`${name} avatar`} className="top-three-avatar" loading="lazy" /> : <span aria-hidden="true" className="top-three-avatar top-three-initial">{initial}</span>}
              <div className="top-three-player">
                <p className="top-three-name" title={name}>{name}{player.isMe ? ' (คุณ)' : ''}</p>
                <p className="top-three-gym" title={`สาขา: ${player.gym || '-'}`}>สาขา: {player.gym || '-'}</p>
              </div>
              <span className="top-three-points">{Number(player.pts) || 0} PTS</span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

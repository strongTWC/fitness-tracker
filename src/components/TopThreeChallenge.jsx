import React from 'react'

export default function TopThreeChallenge({ players = [], onSimulateFriendCheckin }) {
  const sortedPlayers = [...players].sort((a, b) => {
    const scoreDifference = (Number(b.pts) || 0) - (Number(a.pts) || 0)
    if (scoreDifference) return scoreDifference
    const bIsMe = b.isMe || b.id === 'tanawat' || b.name === 'Tanawat'
    const aIsMe = a.isMe || a.id === 'tanawat' || a.name === 'Tanawat'
    return Number(bIsMe) - Number(aIsMe)
  })
  const topPlayers = sortedPlayers.slice(0, 3)
  const myIndex = sortedPlayers.findIndex((player) => player.isMe || player.id === 'tanawat' || player.name === 'Tanawat')
  const myPlayer = myIndex >= 0 ? sortedPlayers[myIndex] : null
  const ahead = myIndex > 0 ? sortedPlayers[myIndex - 1] : null
  const behind = myIndex === 0 ? sortedPlayers[1] : null
  const gap = myPlayer && ahead ? Math.max(0, (Number(ahead.pts) || 0) - (Number(myPlayer.pts) || 0)) : 0
  const lead = myPlayer && behind ? Math.max(0, (Number(myPlayer.pts) || 0) - (Number(behind.pts) || 0)) : 0

  return (
    <section className="top-three-challenge" aria-label="กระดานผู้นำ 3 อันดับแรก">
      <ol className="top-three-list">
        {topPlayers.map((player, index) => {
          const rank = index + 1
          const isMe = player.isMe || player.id === 'tanawat' || player.name === 'Tanawat'
          const name = isMe ? 'Tanawat (คุณ)' : player.name?.trim() || 'ผู้เล่น'
          const initial = name.charAt(0).toUpperCase()
          return <li className={`top-three-row ${rank === 1 ? 'top-three-first' : ''}`} key={player.id || `${name}-${rank}`}>
            <span className={`top-three-rank ${rank === 1 ? 'rank-first' : ''}`} aria-label={`อันดับ ${rank}`}>{rank}</span>
            {player.avatarUrl ? <img src={player.avatarUrl} alt={`${name} avatar`} className="top-three-avatar" loading="lazy" /> : <span aria-hidden="true" className="top-three-avatar top-three-initial">{initial}</span>}
            <div className="top-three-player"><p className="top-three-name" title={name}>{name}</p><p className="top-three-gym" title={`สาขา: ${player.gym || '-'}`}>สาขา: {player.gym || '-'}</p></div>
            <span className="top-three-points">{Number(player.pts) || 0} PTS</span>
          </li>
        })}
      </ol>
      {myPlayer && <div className="fit-rank-gap" role="status">{myIndex === 0 ? `คุณนำอันดับ #1 แล้ว (+${lead} PTS)` : `อันดับ #${myIndex + 1} — ขาดอีก ${gap} PTS เพื่อแซง ${ahead?.name || 'อันดับถัดไป'}`}</div>}
      <button type="button" className="fit-simulate" onClick={onSimulateFriendCheckin}>จำลองเพื่อนเช็กอิน <span>+20 PTS</span></button>
    </section>
  )
}

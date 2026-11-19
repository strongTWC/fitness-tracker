import { useEffect, useMemo, useState } from 'react'
import {
  Activity, Check, ChevronDown, ChevronUp, Clock3, Dumbbell, Flame,
  LocateFixed, MapPin, Search, UserRound, X, Zap,
} from 'lucide-react'
import TopThreeChallenge from './components/TopThreeChallenge'
import Guide from './Guide'
import './geolocation.css'
import './gym-filters.css'
import './challenge-home.css'
import './home-final.css'
import './home-layout.css'
import './checkin-confirmation.css'

const CHECKINS_KEY = 'fitcheck-checkins-v1'
const PLAYERS_KEY = 'fitcheck-challenge-players-v1'
const FEEDBACK_KEY = 'fitcheck-feedback-v1'
const SUGGESTIONS_KEY = 'fitcheck-gym-suggestions-v1'
const STREAK_BONUS_KEY = 'fitcheck-first-three-day-bonus-v1'

const gyms = [
  { id: 'ff-centralworld', name: 'Fitness First — CentralWorld', brand: 'Fitness First', address: 'ชั้น 3 CentralWorld, ราชประสงค์', lat: 13.7466, lng: 100.5393 },
  { id: 'ff-siam', name: 'Fitness First — Siam Paragon', brand: 'Fitness First', address: 'ชั้น 3 Siam Paragon, ปทุมวัน', lat: 13.7466, lng: 100.5347 },
  { id: 'ff-emquartier', name: 'Fitness First — The EmQuartier', brand: 'Fitness First', address: 'ชั้น 3 The EmQuartier, พร้อมพงษ์', lat: 13.7318, lng: 100.5697 },
  { id: 'ff-qhouse', name: 'Fitness First — Q House Lumpini', brand: 'Fitness First', address: 'Q House Lumpini, ถนนสาทรใต้', lat: 13.7259, lng: 100.5412 },
  { id: 'jetts-siam', name: 'Jetts 24 Hour Fitness — Siam Square One', brand: 'Jetts', address: 'ชั้น 5 Siam Square One, ปทุมวัน', lat: 13.7445, lng: 100.5345 },
  { id: 'jetts-silom', name: 'Jetts 24 Hour Fitness — Silom Complex', brand: 'Jetts', address: 'ชั้น 4 Silom Complex, สีลม', lat: 13.7291, lng: 100.5341 },
  { id: 'jetts-rama9', name: 'Jetts 24 Hour Fitness — Central Rama 9', brand: 'Jetts', address: 'ชั้น 6 Central Rama 9, พระราม 9', lat: 13.7586, lng: 100.5662 },
  { id: 'jetts-ratchada', name: 'Jetts 24 Hour Fitness — The Street Ratchada', brand: 'Jetts', address: 'ชั้น 2 The Street Ratchada, รัชดาภิเษก', lat: 13.7692, lng: 100.5748 },
]

const initialPlayers = [
  { id: 'pimchanok', name: 'Pimchanok', gym: 'Fitness First — CentralWorld', pts: 240 },
  { id: 'tanawat', name: 'Tanawat', gym: 'ยังไม่มีการเช็คอิน', pts: 180, isMe: true },
  { id: 'nattapong', name: 'Nattapong', gym: 'Jetts 24 Hour Fitness — Silom Complex', pts: 160 },
  { id: 'siriporn', name: 'Siriporn', gym: 'Fitness First — The EmQuartier', pts: 140 },
]

const navItems = [
  { id: 'home', label: 'เช็คอิน', icon: MapPin },
  { id: 'activity', label: 'กิจกรรม', icon: Activity },
  { id: 'guide', label: 'Gym Guide', icon: Dumbbell },
  { id: 'profile', label: 'โปรไฟล์', icon: UserRound },
]

const popularGyms = [gyms[0], gyms[1], gyms[4]]

function readArray(key, fallback = []) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null')
    return Array.isArray(value) ? value : fallback
  } catch {
    return fallback
  }
}

function distanceBetween(lat1, lng1, lat2, lng2) {
  const radians = (value) => value * Math.PI / 180
  const dLat = radians(lat2 - lat1)
  const dLng = radians(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(dLng / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function formatDistance(km) {
  return km < 1 ? `${Math.round(km * 1000)} ม.` : `${km.toFixed(1)} กม.`
}

function getCombo(entries) {
  const days = [...new Set(entries.map((entry) => new Date(entry.timestamp).toDateString()))]
    .sort((a, b) => new Date(b) - new Date(a))
  if (!days.length) return 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const latest = new Date(days[0])
  latest.setHours(0, 0, 0, 0)
  if ((today - latest) / 86400000 > 1) return 0

  let streak = 1
  let previous = latest
  for (const day of days.slice(1)) {
    const date = new Date(day)
    date.setHours(0, 0, 0, 0)
    if ((previous - date) / 86400000 !== 1) break
    streak += 1
    previous = date
  }
  return streak
}

function App() {
  const [view, setView] = useState('home')
  const [checkins, setCheckins] = useState(() => readArray(CHECKINS_KEY))
  const [players, setPlayers] = useState(() => readArray(PLAYERS_KEY, initialPlayers))
  const [selectedGymId, setSelectedGymId] = useState(null)
  const [gymListOpen, setGymListOpen] = useState(false)
  const [confirmGym, setConfirmGym] = useState(null)
  const [search, setSearch] = useState('')
  const [brand, setBrand] = useState('ทั้งหมด')
  const [position, setPosition] = useState(null)
  const [locating, setLocating] = useState(false)
  const [notice, setNotice] = useState('')
  const [footerModal, setFooterModal] = useState(null)
  const [formNotice, setFormNotice] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(CHECKINS_KEY, JSON.stringify(checkins))
      localStorage.setItem(PLAYERS_KEY, JSON.stringify(players))
    } catch {
      setNotice('ไม่สามารถบันทึกข้อมูลในเบราว์เซอร์ได้')
    }
  }, [checkins, players])

  const selectedGym = gyms.find((gym) => gym.id === selectedGymId) || null
  const combo = getCombo(checkins)
  const monthlyEntries = checkins.filter((entry) => {
    const date = new Date(entry.timestamp)
    const now = new Date()
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  })
  const monthlyPoints = monthlyEntries.reduce((sum, entry) => sum + (Number(entry.points) || 0), 0)

  const recentGyms = useMemo(() => {
    const seen = new Set()
    const recent = [...checkins]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map((entry) => gyms.find((gym) => gym.id === entry.gymId) || gyms.find((gym) => gym.name === entry.gymName))
      .filter((gym) => {
        if (!gym || seen.has(gym.id)) return false
        seen.add(gym.id)
        return true
      })
      .slice(0, 3)
    return recent.length ? recent : popularGyms
  }, [checkins])

  const visibleGyms = useMemo(() => gyms
    .filter((gym) => (brand === 'ทั้งหมด' || gym.brand === brand)
      && `${gym.name} ${gym.address}`.toLowerCase().includes(search.toLowerCase()))
    .map((gym) => ({
      ...gym,
      distance: position ? distanceBetween(position.lat, position.lng, gym.lat, gym.lng) : null,
    }))
    .sort((a, b) => position ? a.distance - b.distance : 0), [brand, position, search])

  function selectGym(gym) {
    setSelectedGymId(gym.id)
    setGymListOpen(false)
    setNotice('')
  }

  function locateMe() {
    if (!navigator.geolocation || !window.isSecureContext) {
      setNotice('ต้องเปิดผ่าน HTTPS และอนุญาต Location เพื่อค้นหาสาขาใกล้คุณ')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setPosition({ lat: coords.latitude, lng: coords.longitude })
      setLocating(false)
      setNotice('อัปเดตตำแหน่งแล้ว')
    }, () => {
      setLocating(false)
      setNotice('ค้นหาตำแหน่งไม่สำเร็จ กรุณาตรวจสอบการอนุญาต Location')
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 })
  }

  function checkIn(gym) {
    if (!gym) return
    const timestamp = new Date().toISOString()
    const distance = position
      ? formatDistance(distanceBetween(position.lat, position.lng, gym.lat, gym.lng))
      : 'ไม่ได้ระบุ'
    const nextEntries = [{
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      gymId: gym.id,
      gymName: gym.name,
      timestamp,
      distance,
      points: 20,
      bonusPoints: 0,
    }, ...checkins]

    const bonusClaimed = localStorage.getItem(STREAK_BONUS_KEY) === 'true'
    const nextCombo = getCombo(nextEntries)
    if (!bonusClaimed && nextCombo >= 3) {
      nextEntries[0] = { ...nextEntries[0], points: 30, bonusPoints: 10 }
      try { localStorage.setItem(STREAK_BONUS_KEY, 'true') } catch { /* Continue without persistent bonus flag. */ }
      setNotice(`เช็คอินสำเร็จ รับ +20 PTS และโบนัสสตรีคครั้งแรก +10 PTS`)
    } else {
      setNotice(`เช็คอินที่ ${gym.name} แล้ว รับ +20 PTS`)
    }

    setCheckins(nextEntries)
    setPlayers((current) => {
      const me = current.find((player) => player.isMe || player.id === 'tanawat')
      const updatedMe = {
        ...(me || {}),
        id: 'tanawat',
        name: 'Tanawat',
        gym: gym.name,
        pts: (Number(me?.pts) || 0) + 20 + (nextCombo >= 3 && !bonusClaimed ? 10 : 0),
        isMe: true,
      }
      return me
        ? current.map((player) => player.id === me.id ? updatedMe : player)
        : [...current, updatedMe]
    })
    setSelectedGymId(null)
    setGymListOpen(false)
    setConfirmGym(null)
  }

  function simulateFriendCheckin() {
    setPlayers((current) => {
      const friend = [...current]
        .filter((player) => !player.isMe && player.id !== 'tanawat')
        .sort((a, b) => (Number(b.pts) || 0) - (Number(a.pts) || 0))[0]
      return friend
        ? current.map((player) => player.id === friend.id ? { ...player, pts: (Number(player.pts) || 0) + 20 } : player)
        : current
    })
  }

  function openFooterModal(id) {
    setFooterModal(id)
    setFormNotice('')
  }

  function submitFooterForm(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const key = footerModal === 'feedback' ? FEEDBACK_KEY : SUGGESTIONS_KEY
    const submission = {
      id: `${Date.now()}`,
      submittedAt: new Date().toISOString(),
      ...Object.fromEntries(formData.entries()),
    }
    try {
      const saved = readArray(key)
      localStorage.setItem(key, JSON.stringify([submission, ...saved]))
      setFormNotice('ขอบคุณ! บันทึกข้อมูลนี้ไว้ในเบราว์เซอร์แล้ว')
      event.currentTarget.reset()
    } catch {
      setFormNotice('บันทึกข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง')
    }
  }

  const nav = navItems.map(({ id, label, icon: Icon }) => (
    <button key={id} type="button" className={`fit-nav-link ${view === id ? 'active' : ''}`} onClick={() => setView(id)}>
      <Icon size={17} /> {label}
    </button>
  ))

  const footerModalTitle = footerModal === 'feedback'
    ? 'ความคิดเห็นต่อผู้พัฒนา'
    : footerModal === 'suggestion' ? 'แจ้งเพิ่มสาขายิม' : 'กติกา & การคิดคะแนน'

  return (
    <div className="fit-app">
      <aside className="fit-sidebar">
        <a className="fit-brand" href="#home" onClick={(event) => { event.preventDefault(); setView('home') }}>
          <span><Activity size={19} /></span> fitcheck<span className="fit-brand-dot">.</span>
        </a>
        <div className="fit-nav-title">เมนูหลัก</div>
        <nav className="fit-nav">{nav}</nav>
        <div className="fit-sidebar-bottom">
          <div className="fit-streak"><Flame size={17} /><span><b>คอมโบต่อเนื่อง</b><small>{combo} วัน</small></span></div>
          <div className="fit-user"><span className="fit-avatar fit-avatar-initial">T</span><b>Tanawat</b></div>
        </div>
      </aside>

      <main className="fit-main">
        <header className="fit-topbar">
          <div><span>FitCheck</span><i>/</i><b>{navItems.find((item) => item.id === view)?.label}</b></div>
          <button type="button" className="fit-topbar-profile" onClick={() => setView('profile')}>
            <span className="fit-avatar fit-avatar-initial">T</span> Tanawat
          </button>
        </header>

        {view === 'home' && (
          <div className="fit-content">
            <header className="fit-welcome">
              <div>
                <div className="fit-eyebrow"><span /> DAILY MOVEMENT</div>
                <h1>ไปขยับร่างกายกัน</h1>
                <p>เช็คอินที่ยิม เก็บคะแนน และขยับอันดับของคุณ</p>
              </div>
                <span className="fit-date">{new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}</span>
            </header>

            <section className="fit-stats" aria-label="สรุปกิจกรรม">
              <article><Zap size={16} /><small>คะแนนสะสมเดือนนี้</small><b>{monthlyPoints} <em>PTS</em></b></article>
              <article><MapPin size={16} /><small>เช็คอินเดือนนี้</small><b>{monthlyEntries.length} <em>ครั้ง</em></b></article>
              <article><Flame size={16} /><small>คอมโบต่อเนื่อง</small><b>{combo} <em>วัน</em></b></article>
            </section>

            <div className="fit-home-grid">
              <section className="fit-challenge-card" aria-label="กระดานผู้นำประจำเดือน">
                <header className="fit-card-heading">
                  <div><div className="fit-eyebrow">MONTHLY GYM CHALLENGE</div><h2>Top 3 นักเข้ายิม</h2></div>
                  <span>เช็คอิน +20 PTS</span>
                </header>
                <TopThreeChallenge players={players} onSimulateFriendCheckin={simulateFriendCheckin} />
              </section>

              <section className="fit-gym-panel" aria-labelledby="selected-gym-title">
                <div className="fit-gym-selected">
                  <div className="fit-gym-selected-copy">
                    <span className="fit-gym-icon"><Dumbbell size={18} /></span>
                    <span>
                      <small id="selected-gym-title">สาขาที่เลือก</small>
                      <b title={selectedGym?.name || 'กรุณาเลือกสาขา'}>{selectedGym?.name || 'กรุณาเลือกสาขา'}</b>
                      <small>{selectedGym && position
                        ? formatDistance(distanceBetween(position.lat, position.lng, selectedGym.lat, selectedGym.lng))
                        : 'เลือกยิมก่อนเช็คอิน'}</small>
                    </span>
                  </div>
                  <button
                    type="button"
                    className={`fit-primary-checkin ${selectedGym ? 'ready' : 'disabled'}`}
                    onClick={() => selectedGym && setConfirmGym(selectedGym)}
                    disabled={!selectedGym}
                  >
                    <Check size={16} /> เช็คอิน <span>+20</span>
                  </button>
                </div>

                <div className="fit-recent-section">
                  <div className="fit-recent-heading"><b>สาขาที่ไปล่าสุด</b><small>{checkins.length ? 'เลือกเพื่อเช็คอินอีกครั้ง' : 'สาขายอดนิยม'}</small></div>
                  <div className="fit-recent-list">
                    {recentGyms.map((gym) => (
                      <button
                        type="button"
                        key={gym.id}
                        className={`fit-recent-pill ${selectedGymId === gym.id ? 'selected' : ''}`}
                        onClick={() => selectGym(gym)}
                        aria-pressed={selectedGymId === gym.id}
                        title={gym.name}
                      >
                        <MapPin size={14} /><span>{gym.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button type="button" className="fit-gym-toggle" aria-expanded={gymListOpen} aria-controls="gym-picker" onClick={() => setGymListOpen((open) => !open)}>
                  <span><b>Find your gym</b><small>เลือกสาขา · {gyms.length} แห่ง</small></span>
                  {gymListOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  <span className="fit-toggle-thai">{gymListOpen ? 'ซ่อนรายการ' : 'เลือกสาขา'}</span>
                </button>

                {gymListOpen && (
                  <div className="fit-gym-picker" id="gym-picker">
                    <div className="fit-gym-tools">
                      <button type="button" className="fit-location" onClick={locateMe} disabled={locating}>
                        <LocateFixed size={14} /> {locating ? 'กำลังค้นหา…' : 'ค้นหาตำแหน่ง'}
                      </button>
                      <div className="fit-brand-filters">
                        {['ทั้งหมด', 'Fitness First', 'Jetts'].map((item) => (
                          <button key={item} type="button" className={brand === item ? 'active' : ''} onClick={() => setBrand(item)}>{item}</button>
                        ))}
                      </div>
                    </div>
                    <label className="fit-search">
                      <Search size={15} />
                      <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ค้นหาชื่อยิมหรือย่าน" />
                    </label>
                    <div className="fit-gym-list">
                      {visibleGyms.map((gym) => (
                        <article key={gym.id} className={`fit-gym-row ${selectedGymId === gym.id ? 'selected' : ''}`}>
                          <button type="button" className="fit-gym-info" onClick={() => selectGym(gym)} aria-pressed={selectedGymId === gym.id}>
                            <span><b>{gym.name}</b><small>{gym.address}</small></span>
                            {gym.distance !== null && <strong>{formatDistance(gym.distance)}</strong>}
                          </button>
                          <button type="button" className="fit-row-checkin" onClick={() => selectGym(gym)}>เลือก</button>
                        </article>
                      ))}
                      {!visibleGyms.length && <p className="fit-empty">ไม่พบสาขาที่ตรงกับคำค้น</p>}
                    </div>
                  </div>
                )}
                {notice && <p className="fit-notice" role="status">{notice}</p>}
              </section>
            </div>

            <Guide />

            <footer className="fit-footer" aria-label="ข้อมูลเพิ่มเติม">
              <button type="button" onClick={() => openFooterModal('feedback')}>ความคิดเห็นต่อผู้พัฒนา</button>
              <button type="button" onClick={() => openFooterModal('rules')}>กติกา &amp; การคิดคะแนน</button>
              <button type="button" onClick={() => openFooterModal('suggestion')}>แจ้งเพิ่มสาขายิม</button>
            </footer>
          </div>
        )}

        {view === 'activity' && (
          <section className="fit-secondary-view">
            <div className="fit-eyebrow"><span /> CHECK-IN LOG</div>
            <h1>กิจกรรมของฉัน</h1>
            <p>ประวัติการเช็คอินและคะแนนที่ได้รับ</p>
            {checkins.length ? (
              <div className="fit-history-list">
                {checkins.map((entry) => (
                  <article className="fit-history-row" key={entry.id}>
                    <span className="fit-gym-icon"><Clock3 size={17} /></span>
                    <span><b>{entry.gymName}</b><small>{new Date(entry.timestamp).toLocaleString('th-TH')} · {entry.distance}</small></span>
                    <strong>+{entry.points} PTS</strong>
                  </article>
                ))}
              </div>
            ) : <p className="fit-empty-history">ยังไม่มีประวัติ ลองเลือกสาขาและเช็คอินดูนะ</p>}
          </section>
        )}

        {view === 'guide' && <section className="fit-guide-screen"><Guide /></section>}
        {view === 'profile' && (
          <section className="fit-secondary-view">
            <div className="fit-eyebrow"><span /> YOUR PROFILE</div>
            <h1>โปรไฟล์ของฉัน</h1>
            <article className="fit-profile-card"><span className="fit-avatar fit-avatar-initial">T</span><div><h2>Tanawat</h2><p>{checkins.length} เช็คอิน · {monthlyPoints} PTS เดือนนี้</p></div></article>
          </section>
        )}
      </main>

      <nav className="fit-mobile-nav" aria-label="เมนูด้านล่าง">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" className={view === id ? 'active' : ''} onClick={() => setView(id)}>
            <Icon size={18} /><span>{label}</span>
          </button>
        ))}
      </nav>

      {confirmGym && (
        <div className="fit-confirm-backdrop" role="presentation" onClick={() => setConfirmGym(null)}>
          <section className="fit-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="checkin-confirm-title" onClick={(event) => event.stopPropagation()}>
            <span className="fit-confirm-icon"><MapPin size={22} /></span>
            <h2 id="checkin-confirm-title">ยืนยันเช็คอินที่ {confirmGym.name}?</h2>
            <p>เช็คอินครั้งนี้รับ +20 PTS{combo === 2 ? ' และอาจได้รับโบนัสสตรีค +10 PTS' : ''}</p>
            <div className="fit-confirm-actions">
              <button type="button" className="fit-confirm-cancel" onClick={() => setConfirmGym(null)}>ยกเลิก</button>
              <button type="button" className="fit-confirm-submit" onClick={() => checkIn(confirmGym)}><Check size={15} /> ยืนยันเช็คอิน</button>
            </div>
          </section>
        </div>
      )}

      {footerModal && (
        <div className="fit-footer-backdrop" role="presentation" onClick={() => setFooterModal(null)}>
          <section className="fit-footer-modal" role="dialog" aria-modal="true" aria-labelledby="footer-modal-title" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="fit-footer-close" aria-label="ปิดหน้าต่าง" onClick={() => setFooterModal(null)}><X size={19} /></button>
            <div className="fit-eyebrow"><span /> FITCHECK</div>
            <h2 id="footer-modal-title">{footerModalTitle}</h2>

            {footerModal === 'rules' ? (
              <div className="fit-rules-content">
                <p>เช็คอินที่สาขายิมเพื่อสะสมคะแนนและสร้างความต่อเนื่องในการออกกำลังกาย</p>
                <div><b>+20 PTS</b><span>ทุกครั้งที่เช็คอิน</span></div>
                <div><b>+10 PTS</b><span>โบนัสครั้งเดียว เมื่อทำสตรีคเช็คอินครบ 3 วันต่อเนื่อง</span></div>
                <small>โบนัสสตรีคมอบให้ได้หนึ่งครั้งต่อเบราว์เซอร์</small>
              </div>
            ) : (
              <form className="fit-footer-form" onSubmit={submitFooterForm}>
                {footerModal === 'feedback' ? (
                  <>
                    <p>มีไอเดียหรือข้อเสนอแนะ? บอกเราได้เลย</p>
                    <label>หัวข้อ<input name="subject" required maxLength={100} placeholder="เรื่องที่อยากแนะนำ" /></label>
                    <label>ความคิดเห็น<textarea name="message" required rows={4} maxLength={1000} placeholder="เขียนความคิดเห็นของคุณ…" /></label>
                    <label>อีเมล (ไม่บังคับ)<input name="email" type="email" placeholder="you@example.com" /></label>
                  </>
                ) : (
                  <>
                    <p>แนะนำสาขาที่ยังไม่มีในรายการ</p>
                    <label>ชื่อยิม / สาขา<input name="branch" required maxLength={120} placeholder="เช่น Fitness First — สาขา…" /></label>
                    <label>ที่อยู่หรือย่าน<input name="location" required maxLength={200} placeholder="ระบุที่อยู่หรือย่าน" /></label>
                    <label>รายละเอียดเพิ่มเติม<textarea name="details" rows={3} maxLength={500} placeholder="ข้อมูลเพิ่มเติม (ไม่บังคับ)" /></label>
                  </>
                )}
                <button type="submit" className="fit-footer-submit">บันทึกข้อมูล</button>
              </form>
            )}
            {formNotice && <p className="fit-form-notice" role="status">{formNotice}</p>}
          </section>
        </div>
      )}
    </div>
  )
}

export default App

import { useEffect, useMemo, useRef, useState } from 'react'
import { Activity, Check, ChevronDown, ChevronUp, Clock3, Dumbbell, Flame, LocateFixed, MapPin, Search, UserRound, Zap } from 'lucide-react'
import TopThreeChallenge from './components/TopThreeChallenge'
import Guide from './Guide'
import './geolocation.css'
import './gym-filters.css'
import './challenge-home.css'
import './home-final.css'

const CHECKINS_KEY = 'fitcheck-checkins-v1'
const CHALLENGE_PLAYERS_KEY = 'fitcheck-challenge-players-v1'
const PROFILE_AVATAR_KEY = 'fitcheck-profile-avatar-v1'
const gyms = [
  { id: 'ff-centralworld', name: 'Fitness First — CentralWorld', brand: 'Fitness First', address: 'ชั้น 3 CentralWorld, ราชประสงค์', lat: 13.7466, lng: 100.5393 },
  { id: 'ff-siam', name: 'Fitness First — Siam Paragon', brand: 'Fitness First', address: 'ชั้น 3 Siam Paragon, ปทุมวัน', lat: 13.7466, lng: 100.5347 },
  { id: 'ff-emquartier', name: 'Fitness First — The EmQuartier', brand: 'Fitness First', address: 'ชั้น 3 The EmQuartier, พร้อมพงษ์', lat: 13.7318, lng: 100.5697 },
  { id: 'ff-qhouse', name: 'Fitness First — Q House Lumpini', brand: 'Fitness First', address: 'Q House Lumpini, ถนนสาทรใต้', lat: 13.7259, lng: 100.5412 },
  { id: 'jetts-siam', name: 'Jetts 24 Hour Fitness — Siam Square One', brand: 'Jetts', address: 'ชั้น 5 Siam Square One, ปทุมวัน', lat: 13.7445, lng: 100.5345 },
  { id: 'jetts-silom', name: 'Jetts 24 Hour Fitness — Silom Complex', brand: 'Jetts', address: 'ชั้น 4 Silom Complex, สีลม', lat: 13.7291, lng: 100.5341 },
  { id: 'jetts-rama9', name: 'Jetts 24 Hour Fitness — Central Rama 9', brand: 'Jetts', address: 'ชั้น 6 Central Rama 9, พระราม 9', lat: 13.7586, lng: 100.5662 },
  { id: 'ff-aia-capital', name: 'Fitness First Platinum — AIA Capital Center', brand: 'Fitness First', address: 'AIA Capital Center, รัชดาภิเษก', lat: 13.7595, lng: 100.5683 },
  { id: 'jetts-ratchada', name: 'Jetts 24 Hour Fitness — The Street Ratchada', brand: 'Jetts', address: 'ชั้น 2 The Street Ratchada, รัชดาภิเษก', lat: 13.7692, lng: 100.5748 },
]
const initialPlayers = [
  { id: 'pimchanok', name: 'Pimchanok', gym: 'Fitness First — CentralWorld', pts: 240, isMe: false },
  { id: 'tanawat', name: 'Tanawat', gym: 'ยังไม่มีการเช็คอิน', pts: 180, isMe: true },
  { id: 'nattapong', name: 'Nattapong', gym: 'Jetts 24 Hour Fitness — Silom Complex', pts: 160, isMe: false },
  { id: 'siriporn', name: 'Siriporn', gym: 'Fitness First — The EmQuartier', pts: 140, isMe: false },
]
const navItems = [
  { id: 'home', label: 'เช็คอิน', icon: MapPin },
  { id: 'activity', label: 'กิจกรรม', icon: Activity },
  { id: 'guide', label: 'Gym Guide', icon: Dumbbell },
  { id: 'profile', label: 'โปรไฟล์', icon: UserRound },
]

function readArray(key, fallback) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || 'null')
    return Array.isArray(data) ? data : fallback
  } catch { return fallback }
}
function readAvatar() {
  try { return localStorage.getItem(PROFILE_AVATAR_KEY) || '' } catch { return '' }
}
function distanceBetween(lat1, lng1, lat2, lng2) {
  const radians = (value) => value * Math.PI / 180
  const dLat = radians(lat2 - lat1)
  const dLng = radians(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(dLng / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
function formatDistance(km) { return km < 1 ? `${Math.round(km * 1000)} ม.` : `${km.toFixed(1)} กม.` }
function getCombo(checkins) {
  const days = [...new Set(checkins.map((entry) => new Date(entry.timestamp).toDateString()))].sort((a, b) => new Date(b) - new Date(a))
  if (!days.length) return 0
  let combo = 1
  let previous = new Date(days[0])
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const last = new Date(previous); last.setHours(0, 0, 0, 0)
  if ((today - last) / 86400000 > 1) return 0
  for (const value of days.slice(1)) {
    const date = new Date(value)
    if ((previous - date) / 86400000 !== 1) break
    combo += 1
    previous = date
  }
  return combo
}

async function imageToDataUrl(file) {
  if (!file.type.startsWith('image/')) throw new Error('กรุณาเลือกไฟล์รูปภาพ')
  const source = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('อ่านไฟล์รูปภาพไม่สำเร็จ'))
    reader.readAsDataURL(file)
  })
  const image = await new Promise((resolve, reject) => {
    const element = new Image()
    element.onload = () => resolve(element)
    element.onerror = () => reject(new Error('เปิดไฟล์รูปภาพไม่สำเร็จ'))
    element.src = source
  })
  const size = 512
  const scale = Math.min(size / image.width, size / image.height, 1)
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(image.width * scale))
  canvas.height = Math.max(1, Math.round(image.height * scale))
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', 0.82)
}

function App() {
  const [view, setView] = useState('home')
  const [position, setPosition] = useState(null)
  const [locating, setLocating] = useState(false)
  const [query, setQuery] = useState('')
  const [brand, setBrand] = useState('ทั้งหมด')
  const [gymListOpen, setGymListOpen] = useState(false)
  const [selectedGymId, setSelectedGymId] = useState('ff-centralworld')
  const [checkins, setCheckins] = useState(() => readArray(CHECKINS_KEY, []))
  const [players, setPlayers] = useState(() => readArray(CHALLENGE_PLAYERS_KEY, initialPlayers))
  const [avatar, setAvatar] = useState(readAvatar)
  const [notice, setNotice] = useState('')
  const fileInput = useRef(null)

  useEffect(() => {
    try { localStorage.setItem(CHALLENGE_PLAYERS_KEY, JSON.stringify(players)) } catch { setNotice('ไม่สามารถบันทึกคะแนนลงในเบราว์เซอร์ได้') }
  }, [players])
  useEffect(() => {
    setPlayers((current) => current.map((player) => player.isMe || player.id === 'tanawat' ? { ...player, avatarUrl: avatar } : player))
  }, [avatar])

  const selectedGym = gyms.find((gym) => gym.id === selectedGymId) || gyms[0]
  const currentMonthEntries = checkins.filter((entry) => {
    const date = new Date(entry.timestamp); const now = new Date()
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  })
  const currentMonthCheckins = currentMonthEntries.length
  const monthlyPoints = currentMonthEntries.reduce((sum, entry) => sum + (Number(entry.points) || 0), 0)
  const combo = getCombo(checkins)
  const allGyms = useMemo(() => gyms.map((gym) => ({ ...gym, distance: position ? distanceBetween(position.lat, position.lng, gym.lat, gym.lng) : null })), [position])
  const visibleGyms = useMemo(() => {
    const results = allGyms.filter((gym) => (brand === 'ทั้งหมด' || gym.brand === brand) && `${gym.name} ${gym.address}`.toLowerCase().includes(query.toLowerCase()))
    return position ? [...results].sort((a, b) => a.distance - b.distance) : results
  }, [allGyms, brand, query, position])
  const rankedPlayers = [...players].sort((a, b) => (Number(b.pts) || 0) - (Number(a.pts) || 0) || Number(Boolean(b.isMe || b.id === 'tanawat')) - Number(Boolean(a.isMe || a.id === 'tanawat')))

  function locateMe() {
    if (!navigator.geolocation || !window.isSecureContext) { setNotice('ต้องเปิดผ่าน HTTPS และอนุญาต Location เพื่อคำนวณระยะทาง'); return }
    setLocating(true); setNotice('กำลังค้นหาตำแหน่ง…')
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setPosition({ lat: coords.latitude, lng: coords.longitude }); setLocating(false); setNotice('อัปเดตตำแหน่งแล้ว — เรียงสาขาจากใกล้ไปไกล')
    }, (error) => {
      setLocating(false); setNotice(error.code === 1 ? 'ตำแหน่งถูกปฏิเสธ: อนุญาต Location ในการตั้งค่าเว็บไซต์ แล้วลองอีกครั้ง' : 'ดึงพิกัดไม่ได้: ตรวจสอบ GPS/Location Services แล้วลองใหม่ หรือเลือกสาขาเอง')
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 })
  }

  function checkIn(gym = selectedGym) {
    const distance = position ? distanceBetween(position.lat, position.lng, gym.lat, gym.lng) : null
    const entry = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, gymId: gym.id, gymName: gym.name, distance: distance === null ? 'ไม่ได้ระบุ (ไม่มีพิกัด)' : formatDistance(distance), timestamp: new Date().toISOString(), points: 20 }
    const nextCheckins = [entry, ...checkins]
    setCheckins(nextCheckins)
    try { localStorage.setItem(CHECKINS_KEY, JSON.stringify(nextCheckins)) } catch { setNotice('ไม่สามารถบันทึกประวัติเช็คอินได้') }
    setPlayers((current) => current.some((player) => player.isMe || player.id === 'tanawat')
      ? current.map((player) => player.isMe || player.id === 'tanawat' ? { ...player, name: 'Tanawat', gym: gym.name, pts: (Number(player.pts) || 0) + 20, isMe: true, avatarUrl: avatar } : player)
      : [...current, { id: 'tanawat', name: 'Tanawat', gym: gym.name, pts: 20, isMe: true, avatarUrl: avatar }])
    setSelectedGymId(gym.id)
    setNotice(`เช็คอินที่ ${gym.name} แล้ว รับ +20 PTS`)
  }

  function simulateFriendCheckin() {
    setPlayers((current) => {
      const friend = [...current].filter((player) => !player.isMe && player.id !== 'tanawat').sort((a, b) => (Number(b.pts) || 0) - (Number(a.pts) || 0))[0]
      return friend ? current.map((player) => player.id === friend.id ? { ...player, pts: (Number(player.pts) || 0) + 20 } : player) : current
    })
  }

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await imageToDataUrl(file)
      localStorage.setItem(PROFILE_AVATAR_KEY, dataUrl)
      setAvatar(dataUrl)
      setNotice('อัปเดตรูปโปรไฟล์แล้ว')
    } catch (error) { setNotice(error.message || 'ไม่สามารถอัปเดตรูปได้') }
    event.target.value = ''
  }

  function Avatar({ className = '' }) {
    return avatar ? <img className={`fit-avatar ${className}`} src={avatar} alt="รูปโปรไฟล์ Tanawat" /> : <span className={`fit-avatar fit-avatar-initial ${className}`} aria-label="Tanawat">T</span>
  }

  const nav = navItems.map(({ id, label, icon: Icon }) => <button key={id} className={`fit-nav-link ${view === id ? 'active' : ''}`} onClick={() => setView(id)}><Icon size={17} /> {label}</button>)

  return <div className="fit-app">
    <aside className="fit-sidebar">
      <a className="fit-brand" href="#home" onClick={() => setView('home')}><span><Activity size={19} /></span> fitcheck<span className="fit-brand-dot">.</span></a>
      <div className="fit-nav-title">เมนูหลัก</div><nav className="fit-nav">{nav}</nav>
      <div className="fit-sidebar-bottom"><div className="fit-streak"><Flame size={17} /><span><b>คอมโบต่อเนื่อง</b><small>{combo} วัน</small></span></div><div className="fit-user"><Avatar /><b>Tanawat</b></div></div>
    </aside>

    <main className="fit-main" id="home">
      <header className="fit-topbar"><div><span>FitCheck</span><i>/</i><b>{navItems.find((item) => item.id === view)?.label}</b></div><span className="fit-topbar-profile" onClick={() => setView('profile')}><Avatar /> Tanawat</span></header>
      {view === 'home' && <div className="fit-content">
        <header className="fit-welcome"><div><div className="fit-eyebrow"><span /> DAILY MOVEMENT</div><h1>ไปขยับร่างกายกัน</h1><p>เช็คอินที่ยิม เก็บคะแนน และท้าทายเพื่อน ๆ</p></div><span className="fit-date">{new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}</span></header>
        <section className="fit-stats" aria-label="สรุปกิจกรรม"><article><Zap size={16} /><small>คะแนนสะสม</small><b>{monthlyPoints} <em>PTS</em></b></article><article><MapPin size={16} /><small>เช็คอินเดือนนี้</small><b>{currentMonthCheckins} <em>ครั้ง</em></b></article><article><Flame size={16} /><small>คอมโบต่อเนื่อง</small><b className="fit-nearest">{combo} วัน</b></article></section>
        <div className="fit-home-grid">
          <section className="fit-left-column"><section className="fit-challenge-card" aria-label="กระดานผู้นำประจำเดือน"><header className="fit-card-heading"><div><div className="fit-eyebrow">MONTHLY GYM CHALLENGE</div><h2>Top 3 นักเข้ายิม</h2></div><span>เช็คอิน +20 PTS</span></header><TopThreeChallenge players={players} onSimulateFriendCheckin={simulateFriendCheckin} /></section><Guide /></section>
          <section className="fit-gym-panel" aria-labelledby="find-gym-title"><div className="fit-gym-selected"><div className="fit-gym-selected-copy"><span className="fit-gym-icon"><Dumbbell size={18} /></span><span><small>สาขาที��เลือก</small><b title={selectedGym.name}>{selectedGym.name}</b><small>{position ? formatDistance(distanceBetween(position.lat, position.lng, selectedGym.lat, selectedGym.lng)) : 'เปิดตำแหน่งเพื่อดูระยะทาง'}</small></span></div><button className="fit-primary-checkin" onClick={() => checkIn(selectedGym)}><Check size={16} /> เช็คอิน <span>+20</span></button></div>
            <button type="button" className="fit-gym-toggle" aria-expanded={gymListOpen} aria-controls="gym-picker" onClick={() => setGymListOpen((open) => !open)}><span><b>Find your gym</b><small id="find-gym-title">เลือกสาขา · {gyms.length} แห่ง</small></span>{gymListOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}<span className="fit-toggle-thai">{gymListOpen ? 'ซ่อนรายการ' : 'เลือกสาขา'}</span></button>
            {gymListOpen && <div className="fit-gym-picker" id="gym-picker"><div className="fit-gym-tools"><button className="fit-location" onClick={locateMe} disabled={locating}><LocateFixed size={14} />{locating ? 'กำลังหา…' : 'ใกล้ฉัน'}</button><div className="fit-brand-filters">{['ทั้งหมด', 'Fitness First', 'Jetts'].map((item) => <button key={item} className={brand === item ? 'active' : ''} aria-pressed={brand === item} onClick={() => setBrand(item)}>{item}</button>)}</div></div><label className="fit-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาชื่อสาขาหรือย่าน" aria-label="ค้นหายิม" /></label><div className="fit-gym-list">{visibleGyms.map((gym) => <article className={`fit-gym-row ${gym.id === selectedGymId ? 'selected' : ''}`} key={gym.id}><button className="fit-gym-info" onClick={() => setSelectedGymId(gym.id)} aria-pressed={gym.id === selectedGymId}><span><b>{gym.name}</b><small>{gym.address}</small></span><strong>{gym.distance === null ? '—' : formatDistance(gym.distance)}</strong></button><button className="fit-row-checkin" onClick={() => checkIn(gym)}>เช็คอิน</button></article>)}</div>{visibleGyms.length === 0 && <p className="fit-empty">ไม่พบสาขาที่ค้นหา</p>}</div>}
            {notice && <p className="fit-notice" role="status">{notice}</p>}
          </section>
        </div>
      </div>}
      {view === 'activity' && <section className="fit-activity-view"><header><div className="fit-eyebrow"><span /> WORKOUT HISTORY</div><h1>กิจกรรมของฉัน</h1><p>ประวัติการเช็คอินบนอุปกรณ์นี้</p></header><div className="fit-activity-summary"><b>{currentMonthCheckins}<small> เช็คอินเดือนนี้</small></b><b>{monthlyPoints}<small> คะแนนเดือนนี้</small></b><b>{checkins.length}<small> เช็คอินทั้งหมด</small></b><b>{combo}<small> วันคอมโบ</small></b></div><section className="fit-activity-rankings"><header><div className="fit-eyebrow"><span /> MONTHLY LEADERBOARD</div><h2>อันดับผู้ร่วมท้าทาย</h2></header>{rankedPlayers.map((player, index) => <article key={player.id || player.name} className="fit-full-rank"><span>{index + 1}</span>{player.avatarUrl ? <img src={player.avatarUrl} alt="" /> : <span className="fit-avatar fit-avatar-initial">{player.name?.[0] || '?'}</span>}<div><b>{player.isMe || player.id === 'tanawat' ? 'Tanawat (คุณ)' : player.name}</b><small>สาขา: {player.gym || '-'}</small></div><strong>{Number(player.pts) || 0} PTS</strong></article>)}</section><section className="fit-history-section"><header><div className="fit-eyebrow"><span /> CHECK-IN LOG</div><h2>ประวัติการเช็คอิน</h2></header>{checkins.length ? <div className="fit-history-list">{checkins.map((entry) => <article key={entry.id}><span className="fit-history-icon"><Dumbbell size={17} /></span><span className="fit-history-text"><b>{entry.gymName}</b><small><Clock3 size={12} /> {new Date(entry.timestamp).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}</small></span><span className="fit-history-distance">{entry.distance}</span><b className="fit-history-points">+{entry.points} PTS</b></article>)}</div> : <div className="fit-empty-history">ยังไม่มีประวัติการเช็คอิน — เลือกยิมเพื่อเริ่มต้น</div>}</section></section>}
      {view === 'guide' && <section className="fit-guide-screen"><Guide /></section>}
      {view === 'profile' && <section className="fit-profile-view"><header><div className="fit-eyebrow"><span /> YOUR PROFILE</div><h1>โปรไฟล์ของฉัน</h1><p>จัดการข้อมูลและติดตามคอมโบการออกกำลังกาย</p></header><article className="fit-profile-card"><Avatar className="fit-profile-photo" /><h2>Tanawat</h2><p>สมาชิก FitCheck</p><input ref={fileInput} className="fit-file-input" type="file" accept="image/*" onChange={handlePhotoChange} aria-label="อัปโหลดรูปโปรไฟล์" /><button className="fit-edit-photo" onClick={() => fileInput.current?.click()}>แก้ไขรูปภาพ</button>{notice && <span className="fit-profile-notice" role="status">{notice}</span>}</article><div className="fit-profile-stats"><article><Flame size={18} /><small>คอมโบต่อเนื่อง</small><b>{combo} วัน</b></article><article><MapPin size={18} /><small>เช็คอินเดือนนี้</small><b>{currentMonthCheckins} ครั้ง</b></article><article><Zap size={18} /><small>คะแนนเดือนนี้</small><b>{monthlyPoints} PTS</b></article></div></section>}
    </main>
    <nav className="fit-mobile-nav" aria-label="เมนูด้านล่าง">{navItems.map(({ id, label, icon: Icon }) => <button key={id} className={view === id ? 'active' : ''} onClick={() => setView(id)}><Icon size={18} /><span>{label}</span></button>)}</nav>
  </div>
}

export default App

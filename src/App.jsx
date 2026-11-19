import { useMemo, useState } from 'react'
import { Activity, ArrowDownRight, ArrowUpRight, Check, ChevronDown, Clock3, Dumbbell, Footprints, Flame, LocateFixed, MapPin, Search, Sparkles, Target, Zap } from 'lucide-react'

const CHECKINS_KEY = 'fitcheck-checkins-v1'
const gyms = [
  { id: 'lab', name: 'The Lab Fitness', type: 'ฟิตเนส · เวทเทรนนิ่ง', address: 'สยามสแควร์ ซอย 7', color: 'lime', icon: Dumbbell, hours: 'เปิดอยู่ · ปิด 22:00', lat: 13.7441, lng: 100.5331 },
  { id: 'lumpini', name: 'สวนลุมพินี', type: 'สวนสาธารณะ · วิ่ง', address: 'ถนนพระราม 4 แขวงลุมพินี', color: 'mint', icon: Footprints, hours: 'เปิด 24 ชั่วโมง', lat: 13.7314, lng: 100.5417 },
  { id: 'base', name: 'BASE Bangkok', type: 'ฟิตเนส · คลาสออกกำลังกาย', address: 'อาคารเกษร ทาวเวอร์', color: 'peach', icon: Activity, hours: 'เปิดอยู่ · ปิด 21:00', lat: 13.7442, lng: 100.5394 },
]

function readCheckins() {
  try {
    const stored = localStorage.getItem(CHECKINS_KEY)
    const records = stored ? JSON.parse(stored) : []
    return Array.isArray(records) ? records : []
  } catch {
    return []
  }
}

function distanceBetween(lat1, lng1, lat2, lng2) {
  const radians = (degrees) => degrees * Math.PI / 180
  const earthRadiusKm = 6371
  const dLat = radians(lat2 - lat1)
  const dLng = radians(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(dLng / 2) ** 2
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function formatDistance(km) {
  return km < 1 ? `${Math.round(km * 1000)} ม.` : `${km.toFixed(1)} กม.`
}

function formatDate(value) {
  return new Date(value).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })
}

function App() {
  const [page, setPage] = useState('checkin')
  const [position, setPosition] = useState(null)
  const [locating, setLocating] = useState(false)
  const [query, setQuery] = useState('')
  const [checkins, setCheckins] = useState(readCheckins)
  const [notice, setNotice] = useState('')
  const places = useMemo(() => gyms.map((gym) => ({
    ...gym,
    distanceKm: position ? distanceBetween(position.lat, position.lng, gym.lat, gym.lng) : null,
  })).sort((a, b) => {
    if (a.distanceKm === null) return 0
    return a.distanceKm - b.distanceKm
  }), [position])
  const filteredPlaces = places.filter((place) => `${place.name} ${place.type} ${place.address}`.toLowerCase().includes(query.toLowerCase()))
  const monthlyCheckins = checkins.filter((entry) => {
    const date = new Date(entry.timestamp)
    const now = new Date()
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }).length
  const totalPoints = checkins.reduce((sum, entry) => sum + (Number(entry.points) || 0), 0)

  function persistCheckins(nextCheckins) {
    setCheckins(nextCheckins)
    try {
      localStorage.setItem(CHECKINS_KEY, JSON.stringify(nextCheckins))
    } catch {
      setNotice('บันทึกในเบราว์เซอร์ไม่ได้ พื้นที่จัดเก็บอาจเต็มหรือถูกปิดใช้งาน')
    }
  }

  function locateMe() {
    if (!navigator.geolocation) {
      setNotice('เบราว์เซอร์นี้ไม่รองรับการระบุตำแหน่ง')
      return
    }
    setLocating(true)
    setNotice('กำลังค้นหาตำแหน่งของคุณ…')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition({ lat: coords.latitude, lng: coords.longitude })
        setLocating(false)
        setNotice('พบตำแหน่งแล้ว — เรียงสถานที่จากใกล้ไปไกล')
      },
      (error) => {
        setLocating(false)
        const message = error.code === error.PERMISSION_DENIED
          ? 'ไม่ได้รับอนุญาตให้ใช้ตำแหน่ง โปรดอนุญาต Location ในเบราว์เซอร์'
          : error.code === error.TIMEOUT
            ? 'ค้นหาตำแหน่งไม่ทันเวลา ลองอีกครั้ง'
            : 'ไม่สามารถระบุตำแหน่งได้ โปรดลองอีกครั้ง'
        setNotice(message)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 },
    )
  }

  function checkIn(place) {
    if (!position || place.distanceKm === null) {
      setNotice('กรุณาใช้ตำแหน่งของคุณก่อนเช็คอิน เพื่อคำนวณระยะทางจริง')
      return
    }
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      gymId: place.id,
      gymName: place.name,
      distanceKm: Number(place.distanceKm.toFixed(3)),
      distance: formatDistance(place.distanceKm),
      timestamp: new Date().toISOString(),
      points: 20,
    }
    persistCheckins([entry, ...checkins])
    setNotice(`เช็คอินที่ ${place.name} สำเร็จ! รับ 20 คะแนนแล้ว`)
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home" onClick={() => setPage('checkin')} aria-label="FitCheck หน้าแรก"><span className="brand-mark"><Activity size={21} strokeWidth={2.6} /></span><span>fitcheck<span className="brand-dot">.</span></span></a>
        <div className="side-label">เมนูหลัก</div>
        <nav className="nav-links" aria-label="เมนูหลัก">
          <button className={`nav-item ${page === 'checkin' ? 'active' : ''}`} onClick={() => setPage('checkin')}><MapPin size={18} /> เช็คอิน {page === 'checkin' && <span className="nav-indicator" />}</button>
          <button className={`nav-item ${page === 'activity' ? 'active' : ''}`} onClick={() => setPage('activity')}><Activity size={18} /> กิจกรรมของฉัน {page === 'activity' && <span className="nav-indicator" />}</button>
          <a className="nav-item" href="#progress"><Target size={18} /> สถิติและเป้าหมาย</a>
          <a className="nav-item" href="#guide"><Dumbbell size={18} /> คู่มือออกกำลังกาย</a>
        </nav>
        <div className="sidebar-spacer" />
        <div className="streak-card"><div className="streak-icon"><Flame size={18} fill="currentColor" /></div><div><strong>เช็คอินเดือนนี้</strong><p>สะสมทุกครั้งที่มาออกกำลังกาย</p></div><div className="streak-days"><b>{monthlyCheckins}</b><span>ครั้ง</span></div></div>
        <button className="profile"><span className="avatar">T</span><span className="profile-copy"><b>Tanawat</b><small>สมาชิก FitCheck</small></span><ChevronDown size={16} /></button>
      </aside>

      <section className="main-content" id="home">
        <header className="topbar"><div className="breadcrumb">หน้าหลัก <span>/</span> <b>{page === 'checkin' ? 'เช็คอิน' : 'กิจกรรมของฉัน'}</b></div><div className="topbar-right"><span className="today-label">{new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span><span className="avatar small">T</span></div></header>
        <div className="content-wrap">
          {page === 'checkin' ? <>
            <div className="welcome-row"><div><div className="eyebrow"><span className="live-dot" /> YOUR DAILY MOVEMENT</div><h1>วันนี้ไปขยับ<br className="mobile-break" />ร่างกายที่ไหน? <span className="title-spark">✳</span></h1><p className="subtitle">ใช้ตำแหน่งจริงเพื่อค้นหายิมใกล้คุณ เช็คอินแล้วบันทึกกิจกรรมไว้ในอุปกรณ์นี้</p></div><div className="date-chip"><span className="date-icon">{new Date().getDate()}</span><span><b>{new Date().toLocaleDateString('th-TH', { month: 'long' })}</b><small>{new Date().toLocaleDateString('th-TH', { weekday: 'long' })}</small></span></div></div>
            <section className="stats-row" aria-label="สรุปกิจกรรม"><article className="stat-card"><span className="stat-icon yellow"><Zap size={17} fill="currentColor" /></span><div className="stat-label">คะแนนสะสม</div><div className="stat-value">{totalPoints}<small> pts</small></div><div className="stat-foot">จากการเช็คอินที่บันทึกไว้</div></article><article className="stat-card"><span className="stat-icon green"><MapPin size={17} /></span><div className="stat-label">เช็คอินเดือนนี้</div><div className="stat-value">{monthlyCheckins}<small> ครั้ง</small></div><div className="stat-foot">บันทึกในเบราว์เซอร์ของคุณ</div></article><article className="stat-card"><span className="stat-icon orange"><Flame size={17} /></span><div className="stat-label">สถานที่ใกล้สุด</div><div className="stat-value stat-distance">{places[0]?.distanceKm === null ? '—' : formatDistance(places[0].distanceKm)}</div><div className="stat-foot">{position ? places[0]?.name : 'เปิดใช้ตำแหน่งเพื่อเริ่มต้น'}</div></article></section>
            <div className="section-heading"><div><div className="eyebrow">FIND YOUR SPOT</div><h2>ยิมและสถานที่ใกล้คุณ <span className="nearby-count">{filteredPlaces.length}</span></h2></div><button className="location-button" onClick={locateMe} disabled={locating}><LocateFixed size={16} /> {locating ? 'กำลังค้นหา…' : position ? 'อัปเดตตำแหน่ง' : 'ใช้ตำแหน่งของฉัน'}</button></div>
            <div className="search-row"><label className="search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาฟิตเนส สวนสาธารณะ..." aria-label="ค้นหาสถานที่" /><kbd>⌘ K</kbd></label></div>
            {!position && <div className="location-hint"><LocateFixed size={16} /><span>อนุญาตการเข้าถึงตำแหน่งเพื่อดูระยะทางจริงและเรียงสถานที่ใกล้คุณก่อน</span></div>}
            <div className="place-list">{filteredPlaces.map((place, index) => { const Icon = place.icon; return <article key={place.id} className={`place-card ${index === 0 && position ? 'selected' : ''}`}><span className={`place-icon ${place.color}`}><Icon size={21} /></span><span className="place-info"><span className="place-title">{place.name}{index === 0 && position && <span className="recommended"><Sparkles size={11} /> ใกล้ที่สุด</span>}</span><span className="place-type">{place.type}</span><span className="place-address"><MapPin size={12} /> {place.address}</span></span><span className="place-meta"><b>{place.distanceKm === null ? 'ระยะทาง —' : formatDistance(place.distanceKm)}</b><small>{place.hours}</small></span><button className="place-checkin" onClick={() => checkIn(place)} disabled={!position} aria-label={`เช็คอินที่ ${place.name}`}>{position ? 'เช็คอิน' : <MapPin size={15} />}</button></article> })}</div>
            {filteredPlaces.length === 0 && <div className="empty-state">ไม่พบสถานที่ที่ค้นหา ลองใช้คำอื่นดูนะ</div>}
            {notice && <div className={`notice ${notice.includes('สำเร็จ') ? 'success' : ''}`} role="status">{notice}</div>}
            <footer className="footer-note"><Clock3 size={13} /> ตำแหน่งใช้เพื่อคำนวณระยะทางเท่านั้น <span>·</span> <b>ไม่ได้บันทึกพิกัดลงในอุปกรณ์</b></footer>
          </> : <section className="my-activity" id="activity">
            <div className="welcome-row"><div><div className="eyebrow"><span className="live-dot" /> YOUR WORKOUT HISTORY</div><h1>กิจกรรมของฉัน</h1><p className="subtitle">ประวัติการเช็คอินที่เก็บไว้ใน localStorage ของเบราว์เซอร์นี้</p></div><div className="date-chip"><span className="date-icon"><Activity size={17} /></span><span><b>{checkins.length} ครั้ง</b><small>ประวัติทั้งหมด</small></span></div></div>
            <section className="stats-row" aria-label="สรุปกิจกรรม"><article className="stat-card"><span className="stat-icon yellow"><Zap size={17} fill="currentColor" /></span><div className="stat-label">คะแนนที่ได้รับ</div><div className="stat-value">{totalPoints}<small> pts</small></div><div className="stat-foot">จากรายการเช็คอิน</div></article><article className="stat-card"><span className="stat-icon green"><MapPin size={17} /></span><div className="stat-label">เช็คอินเดือนนี้</div><div className="stat-value">{monthlyCheckins}<small> ครั้ง</small></div><div className="stat-foot">เดือนปัจจุบัน</div></article><article className="stat-card"><span className="stat-icon orange"><Dumbbell size={17} /></span><div className="stat-label">สถานที่ที่เคยไป</div><div className="stat-value">{new Set(checkins.map((entry) => entry.gymId)).size}<small> แห่ง</small></div><div className="stat-foot">ไม่ซ้ำกัน</div></article></section>
            <div className="activity-heading page-activity-heading"><div><div className="eyebrow">CHECK-IN HISTORY</div><h2>ประวัติการเช็คอิน</h2></div><button className="location-button" onClick={() => setPage('checkin')}><MapPin size={15} /> เช็คอินสถานที่</button></div>
            {checkins.length ? <div className="checkin-history">{checkins.map((entry) => <article className="history-item" key={entry.id}><span className="activity-mark"><Dumbbell size={17} /></span><span className="history-main"><b>{entry.gymName}</b><small><Clock3 size={12} /> {formatDate(entry.timestamp)}</small></span><span className="history-distance"><MapPin size={13} /> {entry.distance}</span><span className="points">+{entry.points} pts</span></article>)}</div> : <div className="activity-empty"><span><Activity size={23} /></span><b>ยังไม่มีประวัติการเช็คอิน</b><p>เมื่อคุณเช็คอิน รายการชื่อยิม ระยะทาง เวลา และคะแนนจะแสดงที่นี่</p><button className="checkin-button" onClick={() => setPage('checkin')}>ค้นหายิมใกล้ฉัน <ArrowUpRight size={16} /></button></div>}
            <footer className="footer-note"><Clock3 size={13} /> รายการนี้เก็บในเบราว์เซอร์เครื่องนี้เท่านั้น <span>·</span> <b>ไม่ส่งไปยังเซิร์ฟเวอร์</b></footer>
          </section>}
        </div>
      </section>
    </main>
  )
}

export default App

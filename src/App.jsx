import { useMemo, useState } from 'react'
import { Activity, ArrowDownRight, ArrowUpRight, Check, ChevronDown, Clock3, Dumbbell, Flame, LocateFixed, MapPin, Search, Target, Zap } from 'lucide-react'
import './geolocation.css'
import './gym-filters.css'

const CHECKINS_KEY = 'fitcheck-checkins-v1'
const gyms = [
  { id: 'ff-centralworld', name: 'Fitness First — CentralWorld', brand: 'Fitness First', type: 'ฟิตเนส · เวทเทรนนิ่ง · คลาส', address: 'ชั้น 3 CentralWorld, ราชประสงค์', color: 'lime', lat: 13.7466, lng: 100.5393 },
  { id: 'ff-siam', name: 'Fitness First — Siam Paragon', brand: 'Fitness First', type: 'ฟิตเนส · เวทเทรนนิ่ง · คลาส', address: 'ชั้น 3 Siam Paragon, ปทุมวัน', color: 'lime', lat: 13.7466, lng: 100.5347 },
  { id: 'ff-emquartier', name: 'Fitness First — The EmQuartier', brand: 'Fitness First', type: 'ฟิตเนส · เวทเทรนนิ่ง · คลาส', address: 'ชั้น 3 The EmQuartier, พร้อมพงษ์', color: 'lime', lat: 13.7318, lng: 100.5697 },
  { id: 'ff-qhouse', name: 'Fitness First — Q House Lumpini', brand: 'Fitness First', type: 'ฟิตเนส · เวทเทรนนิ่ง · คลาส', address: 'Q House Lumpini, ถนนสาทรใต้', color: 'lime', lat: 13.7259, lng: 100.5412 },
  { id: 'jetts-siam', name: 'Jetts 24 Hour Fitness — Siam Square One', brand: 'Jetts', type: 'ฟิตเนส · เปิด 24 ชั่วโมง', address: 'ชั้น 5 Siam Square One, ปทุมวัน', color: 'peach', lat: 13.7445, lng: 100.5345 },
  { id: 'jetts-silom', name: 'Jetts 24 Hour Fitness — Silom Complex', brand: 'Jetts', type: 'ฟิตเนส · เปิด 24 ชั่วโมง', address: 'ชั้น 4 Silom Complex, สีลม', color: 'peach', lat: 13.7291, lng: 100.5341 },
  { id: 'jetts-rama9', name: 'Jetts 24 Hour Fitness — Central Rama 9', brand: 'Jetts', type: 'ฟิตเนส · เปิด 24 ชั่วโมง', address: 'ชั้น 6 Central Rama 9, พระราม 9', color: 'peach', lat: 13.7586, lng: 100.5662 },
  { id: 'ff-aia-capital', name: 'Fitness First Platinum — AIA Capital Center', brand: 'Fitness First', type: 'ฟิตเนส · เวทเทรนนิ่ง · คลาส', address: 'ชั้น ออกกำลังกาย AIA Capital Center, รัชดาภิเษก', color: 'lime', lat: 13.7595, lng: 100.5683 },
  { id: 'jetts-ratchada', name: 'Jetts 24 Hour Fitness — The Street Ratchada', brand: 'Jetts', type: 'ฟิตเนส · เปิด 24 ชั่วโมง', address: 'ชั้น 2 The Street Ratchada, รัชดาภิเษก', color: 'peach', lat: 13.7692, lng: 100.5748 },
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

function locationError(error) {
  if (error?.code === 1) return { title: 'การเข้าถึงตำแหน่งถูกปฏิเสธ', message: 'อนุญาต Location ให้เว็บไซต์นี้ในการตั้งค่าเบราว์เซอร์ แล้วกด “ลองระบุตำแหน่งอีกครั้ง”' }
  if (error?.code === 2) return { title: 'อุปกรณ์ส่งพิกัดไม่ได้', message: 'ตรวจสอบว่าเปิด Location Services/GPS และปิดโหมดเครื่องบิน จากนั้นลองอีกครั้ง หรือเลือกยิมจากรายการได้เลย' }
  if (error?.code === 3) return { title: 'ค้นหาตำแหน่งใช้เวลานานเกินไป', message: 'ลองเปิด GPS หรือย้ายไปบริเวณที่รับสัญญาณได้ดี แล้วลองอีกครั้ง คุณยังเลือกยิมด้วยตนเองได้' }
  return { title: 'ไม่สามารถระบุตำแหน่งได้', message: 'ตรวจสอบการตั้งค่า Location ของอุปกรณ์และเบราว์เซอร์ แล้วลองใหม่ หรือเลือกสาขาจากรายการด้านล่างโดยไม่ใช้พิกัด' }
}

function App() {
  const [page, setPage] = useState('checkin')
  const [position, setPosition] = useState(null)
  const [locating, setLocating] = useState(false)
  const [query, setQuery] = useState('')
  const [brandFilter, setBrandFilter] = useState('all')
  const [sortByDistance, setSortByDistance] = useState(false)
  const [selectedGymId, setSelectedGymId] = useState('ff-centralworld')
  const [checkins, setCheckins] = useState(readCheckins)
  const [notice, setNotice] = useState('')
  const [geoError, setGeoError] = useState(null)
  const places = useMemo(() => gyms.map((gym) => ({
    ...gym,
    distanceKm: position ? distanceBetween(position.lat, position.lng, gym.lat, gym.lng) : null,
  })), [position])
  const filteredPlaces = useMemo(() => {
    const matches = places.filter((place) => (brandFilter === 'all' || place.brand === brandFilter) && `${place.name} ${place.type} ${place.address}`.toLowerCase().includes(query.toLowerCase()))
    return sortByDistance && position ? [...matches].sort((a, b) => a.distanceKm - b.distanceKm) : matches
  }, [places, brandFilter, query, sortByDistance, position])
  const selectedGym = gyms.find((gym) => gym.id === selectedGymId)
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
    setNotice('')
    setGeoError(null)
    if (!window.isSecureContext) {
      setGeoError({ title: 'ต้องเปิดหน้าเว็บผ่าน HTTPS เพื่อใช้ตำแหน่ง', message: 'Geolocation ใช้งานได้บน HTTPS หรือ localhost เท่านั้น หากเปิดผ่าน HTTP ให้เข้าเว็บไซต์แบบ HTTPS แล้วอนุญาต Location ในเบราว์เซอร์' })
      return
    }
    if (!navigator.geolocation) {
      setGeoError({ title: 'เบราว์เซอร์นี้ไม่รองรับ Geolocation', message: 'ลองเปิดหน้านี้ด้วยเบราว์เซอร์รุ่นใหม่ หรือเลือก Fitness First / Jetts จากรายการได้โดยไม่ต้องใช้พิกัด' })
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition({ lat: coords.latitude, lng: coords.longitude })
        setLocating(false)
        setGeoError(null)
        setNotice('พบตำแหน่งแล้ว — กด “เรียงใกล้ฉัน” เพื่อจัดลำดับสาขา')
      },
      (error) => {
        setLocating(false)
        setGeoError(locationError(error))
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 },
    )
  }

  function toggleDistanceSort() {
    const shouldEnable = !sortByDistance
    setSortByDistance(shouldEnable)
    if (shouldEnable && !position) locateMe()
  }

  function toggleBrand(brand) {
    setBrandFilter((current) => current === brand ? 'all' : brand)
  }

  function checkIn(gym) {
    const distanceKm = position ? distanceBetween(position.lat, position.lng, gym.lat, gym.lng) : null
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      gymId: gym.id,
      gymName: gym.name,
      distanceKm: distanceKm === null ? null : Number(distanceKm.toFixed(3)),
      distance: distanceKm === null ? 'ไม่ได้ระบุ (ไม่มีพิกัด)' : formatDistance(distanceKm),
      timestamp: new Date().toISOString(),
      points: 20,
    }
    persistCheckins([entry, ...checkins])
    setSelectedGymId(gym.id)
    setNotice(`เช็คอินที่ ${gym.name} สำเร็จ! รับ 20 คะแนนแล้ว${distanceKm === null ? ' (ไม่ได้บันทึกระยะทาง)' : ''}`)
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
            <div className="welcome-row"><div><div className="eyebrow"><span className="live-dot" /> YOUR DAILY MOVEMENT</div><h1>วันนี้ไปขยับ<br className="mobile-break" />ร่างกายที่ไหน? <span className="title-spark">✳</span></h1><p className="subtitle">เปิดตำแหน่งเพื่อเรียงสาขาใกล้คุณ หรือเลือกสาขา Fitness First และ Jetts ด้วยตนเอง</p></div><div className="date-chip"><span className="date-icon">{new Date().getDate()}</span><span><b>{new Date().toLocaleDateString('th-TH', { month: 'long' })}</b><small>{new Date().toLocaleDateString('th-TH', { weekday: 'long' })}</small></span></div></div>
            <section className="stats-row" aria-label="สรุปกิจกรรม"><article className="stat-card"><span className="stat-icon yellow"><Zap size={17} fill="currentColor" /></span><div className="stat-label">คะแนนสะสม</div><div className="stat-value">{totalPoints}<small> pts</small></div><div className="stat-foot">จากการเช็คอินที่บันทึกไว้</div></article><article className="stat-card"><span className="stat-icon green"><MapPin size={17} /></span><div className="stat-label">เช็คอินเดือนนี้</div><div className="stat-value">{monthlyCheckins}<small> ครั้ง</small></div><div className="stat-foot">บันทึกในเบราว์เซอร์ของคุณ</div></article><article className="stat-card"><span className="stat-icon orange"><Flame size={17} /></span><div className="stat-label">สาขาที่ใกล้สุด</div><div className="stat-value stat-distance">{position ? formatDistance(Math.min(...places.map((place) => place.distanceKm))) : '—'}</div><div className="stat-foot">{position ? 'ระยะเส้นตรงจากตำแหน่งคุณ' : 'กดเรียงใกล้ฉันเพื่อคำนวณระยะ'}</div></article></section>
            <div className="section-heading"><div><div className="eyebrow">FIND YOUR GYM</div><h2>เลือกสาขาใกล้คุณ <span className="nearby-count">{filteredPlaces.length}</span></h2></div><button className="location-button" onClick={locateMe} disabled={locating}><LocateFixed size={16} /> {locating ? 'กำลังค้นหา…' : position ? 'อัปเดตตำแหน่ง' : 'ใช้ตำแหน่งของฉัน'}</button></div>
            <div className="gym-filters" aria-label="กรองแบรนด์ยิม"><button className={`filter-toggle ${brandFilter === 'Fitness First' ? 'active' : ''}`} aria-pressed={brandFilter === 'Fitness First'} onClick={() => toggleBrand('Fitness First')}>Fitness First</button><button className={`filter-toggle ${brandFilter === 'Jetts' ? 'active' : ''}`} aria-pressed={brandFilter === 'Jetts'} onClick={() => toggleBrand('Jetts')}>Jetts</button><button className={`filter-toggle distance-toggle ${sortByDistance ? 'active' : ''}`} aria-pressed={sortByDistance} onClick={toggleDistanceSort}><LocateFixed size={14} /> {sortByDistance ? 'เรียงใกล้ฉัน: เปิด' : 'เรียงใกล้ฉัน'}</button><span className="filter-state" role="status">{brandFilter === 'all' ? 'ทุกแบรนด์' : `กรอง: ${brandFilter}`} · {sortByDistance ? position ? 'ใกล้ไปไกล' : 'รอพิกัดเพื่อเรียง' : 'ลำดับเดิม'}</span></div>
            <div className="search-row"><label className="search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาชื่อสาขา ย่าน หรือห้าง..." aria-label="ค้นหาสาขายิม" /></label></div>
            {!position && <div className="location-hint"><LocateFixed size={16} /><span>ยังไม่มีพิกัด — แสดงสาขาให้เลือกตามชื่อและย่าน คุณเลือกและเช็คอินได้เลยโดยไม่ต้องเปิด Location</span></div>}
            {geoError && <section className="geo-help" role="alert"><div className="geo-help-heading"><MapPin size={18} /><div><b>{geoError.title}</b><p>{geoError.message}</p></div></div><div className="geo-help-steps"><strong>วิธีเปิดสิทธิ์ตำแหน่ง</strong><ol><li>กดไอคอนกุญแจ/ตั้งค่าเว็บไซต์ข้างแถบที่อยู่ แล้วตั้งค่า Location เป็น “อนุญาต”</li><li>ตรวจสอบว่าเปิด Location Services ของโทรศัพท์หรือคอมพิวเตอร์</li><li>กลับมาหน้านี้แล้วกด “ลองระบุตำแหน่งอีกครั้ง”</li></ol><small>ชื่อเมนูอาจแตกต่างกันตามเบราว์เซอร์และอุปกรณ์</small></div><button className="geo-retry" onClick={locateMe} disabled={locating}><LocateFixed size={15} /> ลองระบุตำแหน่งอีกครั้ง</button></section>}
            <div className="place-list">{filteredPlaces.map((place, index) => <article key={place.id} className={`place-card gym-card ${selectedGymId === place.id ? 'selected' : ''}`}><span className={`place-icon ${place.color}`}><Dumbbell size={21} /></span><span className="place-info"><span className="place-title">{place.name}{sortByDistance && position && index === 0 && <span className="recommended">ใกล้ที่สุด</span>}</span><span className="place-type">{place.type}</span><span className="place-address"><MapPin size={12} /> {place.address}</span></span><span className="place-meta"><b>{place.distanceKm === null ? 'ระยะทาง —' : formatDistance(place.distanceKm)}</b><small>{position ? (sortByDistance && index === 0 ? 'ใกล้ตำแหน่งคุณที่สุด' : 'ระยะเส้นตรงโดยประมาณ') : place.brand}</small></span><button className={`gym-select ${selectedGymId === place.id ? 'chosen' : ''}`} onClick={() => { setSelectedGymId(place.id); setNotice('') }} aria-pressed={selectedGymId === place.id}>{selectedGymId === place.id ? <><Check size={14} /> เลือกแล้ว</> : 'เลือกยิม'}</button><button className="place-checkin" onClick={() => checkIn(place)} aria-label={`เช็คอินที่ ${place.name}`}>เช็คอิน</button></article>)}</div>
            {filteredPlaces.length === 0 && <div className="empty-state">ไม่พบสาขาที่ค้นหา ลองเปลี่ยนคำค้นหรือเลือกแบรนด์อื่น</div>}
            {selectedGym && <div className="checkin-bar"><div className="checkin-copy"><span className="checkin-pin"><MapPin size={18} /></span><span><b>สาขาที่เลือก: {selectedGym.name}</b><small>{position ? `ระยะประมาณ ${formatDistance(distanceBetween(position.lat, position.lng, selectedGym.lat, selectedGym.lng))} · เช็คอินรับ 20 คะแนน` : 'เลือกเช็คอินได้เลย · ระยะทางจะไม่ถูกระบุจนกว่าจะเปิดตำแหน่ง'}</small></span></div><button className="checkin-button" onClick={() => checkIn(selectedGym)}>เช็คอินเลย <ArrowUpRight size={17} /></button></div>}
            {notice && <div className={`notice ${notice.includes('สำเร็จ') ? 'success' : ''}`} role="status">{notice}</div>}
            <footer className="footer-note"><Clock3 size={13} /> พิกัดใช้คำนวณระยะทางเท่านั้น <span>·</span> <b>เลือกสาขาได้แม้ไม่อนุญาต Location</b></footer>
          </> : <section className="my-activity" id="activity">
            <div className="welcome-row"><div><div className="eyebrow"><span className="live-dot" /> YOUR WORKOUT HISTORY</div><h1>กิจกรรมของฉัน</h1><p className="subtitle">ประวัติการเช็คอินที่เก็บไว้ใน localStorage ของเบราว์เซอร์นี้</p></div><div className="date-chip"><span className="date-icon"><Activity size={17} /></span><span><b>{checkins.length} ครั้ง</b><small>ประวัติทั้งหมด</small></span></div></div>
            <section className="stats-row" aria-label="สรุปกิจกรรม"><article className="stat-card"><span className="stat-icon yellow"><Zap size={17} fill="currentColor" /></span><div className="stat-label">คะแนนที่ได้รับ</div><div className="stat-value">{totalPoints}<small> pts</small></div><div className="stat-foot">จากรายการเช็คอิน</div></article><article className="stat-card"><span className="stat-icon green"><MapPin size={17} /></span><div className="stat-label">เช็คอินเดือนนี้</div><div className="stat-value">{monthlyCheckins}<small> ครั้ง</small></div><div className="stat-foot">เดือนปัจจุบัน</div></article><article className="stat-card"><span className="stat-icon orange"><Dumbbell size={17} /></span><div className="stat-label">สาขาที่เคยไป</div><div className="stat-value">{new Set(checkins.map((entry) => entry.gymId)).size}<small> แห่ง</small></div><div className="stat-foot">ไม่ซ้ำกัน</div></article></section>
            <div className="activity-heading page-activity-heading"><div><div className="eyebrow">CHECK-IN HISTORY</div><h2>ประวัติการเช็คอิน</h2></div><button className="location-button" onClick={() => setPage('checkin')}><MapPin size={15} /> เลือกยิม</button></div>
            {checkins.length ? <div className="checkin-history">{checkins.map((entry) => <article className="history-item" key={entry.id}><span className="activity-mark"><Dumbbell size={17} /></span><span className="history-main"><b>{entry.gymName}</b><small><Clock3 size={12} /> {formatDate(entry.timestamp)}</small></span><span className="history-distance"><MapPin size={13} /> {entry.distance || 'ไม่ได้ระบุ (ไม่มีพิกัด)'}</span><span className="points">+{entry.points} pts</span></article>)}</div> : <div className="activity-empty"><span><Activity size={23} /></span><b>ยังไม่มีประวัติการเช็คอิน</b><p>รายการชื่อยิม ระยะทาง เวลา และคะแนนจะปรากฏที่นี่หลังเช็คอิน</p><button className="checkin-button" onClick={() => setPage('checkin')}>เลือกยิมใกล้ฉัน <ArrowUpRight size={16} /></button></div>}
            <footer className="footer-note"><Clock3 size={13} /> บันทึกในเบราว์เซอร์เครื่องนี้เท่านั้น <span>·</span> <b>เช็คอินได้แม้ปิดการระบุตำแหน่ง</b></footer>
          </section>}
        </div>
      </section>
    </main>
  )
}

export default App

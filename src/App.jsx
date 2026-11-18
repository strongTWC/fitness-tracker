import { useState } from 'react'
import { Activity, ArrowDownRight, ArrowUpRight, Check, ChevronDown, Clock3, Dumbbell, Footprints, Flame, LocateFixed, MapPin, Search, Sparkles, Target, Zap } from 'lucide-react'

const places = [
  { id: 1, name: 'The Lab Fitness', type: 'ฟิตเนส · เวทเทรนนิ่ง', distance: '0.4 กม.', address: 'สยามสแควร์ ซอย 7', color: 'lime', icon: Dumbbell, members: 'เปิดอยู่ · ปิด 22:00' },
  { id: 2, name: 'สวนลุมพินี', type: 'สวนสาธารณะ · วิ่ง', distance: '1.2 กม.', address: 'ถนนพระราม 4 แขวงลุมพินี', color: 'mint', icon: Footprints, members: 'เปิด 24 ชั่วโมง' },
  { id: 3, name: 'BASE Bangkok', type: 'ฟิตเนส · คลาสออกกำลังกาย', distance: '1.8 กม.', address: 'อาคารเกษร ทาวเวอร์', color: 'peach', icon: Activity, members: 'เปิดอยู่ · ปิด 21:00' },
]

const initialActivity = [
  { place: 'สวนลุมพินี', activity: 'วิ่ง · 3.2 กม.', time: 'เมื่อวาน, 07:15', points: '+20' },
  { place: 'The Lab Fitness', activity: 'เวทเทรนนิ่ง', time: 'จันทร์, 18:42', points: '+20' },
]

function App() {
  const [selected, setSelected] = useState(1)
  const [checkedIn, setCheckedIn] = useState(false)
  const [query, setQuery] = useState('')
  const [activity, setActivity] = useState(initialActivity)
  const [notice, setNotice] = useState('')
  const filteredPlaces = places.filter((place) => `${place.name} ${place.type} ${place.address}`.toLowerCase().includes(query.toLowerCase()))
  const selectedPlace = places.find((place) => place.id === selected)
  const totalPoints = 340 + (activity.length - initialActivity.length) * 20

  function checkIn() {
    if (checkedIn) return
    const now = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    setActivity([{ place: selectedPlace.name, activity: 'เช็คอิน · ออกกำลังกาย', time: `วันนี้, ${now}`, points: '+20' }, ...activity])
    setCheckedIn(true)
    setNotice(`เช็คอินที่ ${selectedPlace.name} สำเร็จ! รับ 20 คะแนนแล้ว`)
  }

  function locateMe() {
    if (!navigator.geolocation) {
      setNotice('อุปกรณ์นี้ไม่รองรับการระบุตำแหน่ง')
      return
    }
    setNotice('กำลังค้นหาตำแหน่งของคุณ…')
    navigator.geolocation.getCurrentPosition(
      () => setNotice('พบตำแหน่งของคุณแล้ว — แสดงสถานที่ใกล้เคียง'),
      () => setNotice('ไม่สามารถเข้าถึงตำแหน่งได้ ลองอนุญาต Location ในเบราว์เซอร์'),
      { timeout: 8000 },
    )
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home" aria-label="FitCheck หน้าแรก"><span className="brand-mark"><Activity size={21} strokeWidth={2.6} /></span><span>fitcheck<span className="brand-dot">.</span></span></a>
        <div className="side-label">เมนูหลัก</div>
        <nav className="nav-links" aria-label="เมนูหลัก">
          <a className="nav-item active" href="#checkin"><MapPin size={18} /> เช็คอิน <span className="nav-indicator" /></a>
          <a className="nav-item" href="#activity"><Activity size={18} /> กิจกรรมของฉัน</a>
          <a className="nav-item" href="#progress"><Target size={18} /> สถิติและเป้าหมาย</a>
        </nav>
        <div className="sidebar-spacer" />
        <div className="streak-card"><div className="streak-icon"><Flame size={18} fill="currentColor" /></div><div><strong>รักษา streak ไว้!</strong><p>เช็คอินวันนี้เพื่อทำต่อเนื่อง</p></div><div className="streak-days"><b>4</b><span>วัน</span></div></div>
        <button className="profile"><span className="avatar">T</span><span className="profile-copy"><b>Tanawat</b><small>สมาชิก FitCheck</small></span><ChevronDown size={16} /></button>
      </aside>

      <section className="main-content" id="home">
        <header className="topbar"><div className="breadcrumb">หน้าหลัก <span>/</span> <b>เช็คอิน</b></div><div className="topbar-right"><span className="today-label">วันพุธที่ 18 พฤศจิกายน 2569</span><span className="avatar small">T</span></div></header>
        <div className="content-wrap" id="checkin">
          <div className="welcome-row"><div><div className="eyebrow"><span className="live-dot" /> YOUR DAILY MOVEMENT</div><h1>วันนี้ไปขยับ<br className="mobile-break" />ร่างกายที่ไหน? <span className="title-spark">✳</span></h1><p className="subtitle">เลือกสถานที่ออกกำลังกายใกล้คุณ แล้วเช็คอินเพื่อเก็บคะแนน</p></div><div className="date-chip"><span className="date-icon">18</span><span><b>พฤศจิกายน</b><small>วันพุธ · สัปดาห์ที่ 47</small></span></div></div>

          <section className="stats-row" aria-label="สรุปกิจกรรม"><article className="stat-card"><span className="stat-icon yellow"><Zap size={17} fill="currentColor" /></span><div className="stat-label">คะแนนสะสม</div><div className="stat-value">{totalPoints}<small> pts</small></div><div className="stat-foot"><span className="trend"><ArrowUpRight size={14} /> 12%</span> จากเดือนที่แล้ว</div></article><article className="stat-card"><span className="stat-icon green"><MapPin size={17} /></span><div className="stat-label">เช็คอินเดือนนี้</div><div className="stat-value">12<small> ครั้ง</small></div><div className="stat-foot">เป้าหมาย <b>15 ครั้ง</b></div></article><article className="stat-card"><span className="stat-icon orange"><Flame size={17} /></span><div className="stat-label">สถิติต่อเนื่อง</div><div className="stat-value">4<small> วัน</small></div><div className="stat-foot">ทำได้ดีมาก รักษาไว้นะ!</div></article></section>

          <div className="section-heading"><div><div className="eyebrow">FIND YOUR SPOT</div><h2>สถานที่ใกล้คุณ <span className="nearby-count">{filteredPlaces.length}</span></h2></div><button className="location-button" onClick={locateMe}><LocateFixed size={16} /> ใช้ตำแหน่งของฉัน</button></div>
          <div className="search-row"><label className="search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาฟิตเนส สวนสาธารณะ..." aria-label="ค้นหาสถานที่" /><kbd>⌘ K</kbd></label><button className="filter-button" onClick={() => setNotice('กำลังแสดงสถานที่ทั้งหมดใกล้คุณ')}><span className="filter-glyph">☷</span> ตัวกรอง</button></div>

          <div className="place-list">{filteredPlaces.map((place) => { const Icon = place.icon; return <button key={place.id} className={`place-card ${selected === place.id ? 'selected' : ''}`} onClick={() => { setSelected(place.id); setCheckedIn(false); setNotice('') }} aria-pressed={selected === place.id}><span className={`place-icon ${place.color}`}><Icon size={21} /></span><span className="place-info"><span className="place-title">{place.name}{selected === place.id && <span className="recommended"><Sparkles size={11} /> แนะนำ</span>}</span><span className="place-type">{place.type}</span><span className="place-address"><MapPin size={12} /> {place.address}</span></span><span className="place-meta"><b>{place.distance}</b><small>{place.members}</small></span><span className={`radio ${selected === place.id ? 'checked' : ''}`}>{selected === place.id && <Check size={12} />}</span></button> })}</div>
          {filteredPlaces.length === 0 && <div className="empty-state">ไม่พบสถานที่ที่ค้นหา ลองใช้คำอื่นดูนะ</div>}

          <div className="checkin-bar"><div className="checkin-copy"><span className="checkin-pin"><MapPin size={18} /></span><span><b>{checkedIn ? 'เช็คอินเรียบร้อยแล้ว!' : 'พร้อมเริ่มต้นหรือยัง?'}</b><small>{checkedIn ? `คุณอยู่ที่ ${selectedPlace.name}` : `เช็คอินที่ ${selectedPlace?.name ?? 'สถานที่ที่เลือก'} รับ +20 คะแนน`}</small></span></div><button className={`checkin-button ${checkedIn ? 'done' : ''}`} onClick={checkIn} disabled={!selectedPlace || checkedIn}>{checkedIn ? <><Check size={17} /> เช็คอินแล้ว</> : <>เช็คอินเลย <ArrowUpRight size={17} /></>}</button></div>
          {notice && <div className={`notice ${notice.includes('สำเร็จ') ? 'success' : ''}`} role="status">{notice}</div>}

          <section className="activity-section" id="activity"><div className="activity-heading"><div><div className="eyebrow">KEEP THE MOMENTUM</div><h2>กิจกรรมล่าสุด</h2></div><a href="#activity">ดูทั้งหมด <ArrowDownRight size={14} /></a></div><div className="activity-list">{activity.slice(0, 3).map((item, index) => <div className="activity-item" key={`${item.time}-${index}`}><span className="activity-mark"><Dumbbell size={17} /></span><span className="activity-details"><b>{item.place}</b><small>{item.activity} <i>·</i> {item.time}</small></span><span className="points">{item.points} pts</span></div>)}</div></section>
          <footer className="footer-note"><Clock3 size={13} /> อัปเดตข้อมูลล่าสุดเมื่อสักครู่ <span>·</span> <b>ทุกการเคลื่อนไหวมีความหมาย</b></footer>
        </div>
      </section>
    </main>
  )
}

export default App

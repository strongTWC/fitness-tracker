import { Activity, Flame } from 'lucide-react'

export default function DesktopSidebar({ items, activeView, onNavigate, onProfileClick, streakDays = 0, profileName = 'Tanawat' }) {
  const initial = profileName.trim().charAt(0).toUpperCase() || 'T'
  return (
    <aside className="fit-sidebar" aria-label="เมนูหลัก">
      <a className="fit-brand" href="#home" onClick={(event) => { event.preventDefault(); onNavigate('home') }}>
        <span><Activity size={19} /></span> fitcheck<span className="fit-brand-dot">.</span>
      </a>
      <div className="fit-nav-title">เมนูหลัก</div>
      <nav className="fit-nav">
        {items.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" className={`fit-nav-link ${activeView === id ? 'active' : ''}`} onClick={() => onNavigate(id)} aria-current={activeView === id ? 'page' : undefined}>
            <Icon size={17} /> {label}
          </button>
        ))}
      </nav>
      <div className="fit-sidebar-bottom">
        <div className="fit-streak"><Flame size={17} /><span><b>คอมโบต่อเนื่อง</b><small>{streakDays} วัน</small></span></div>
        <button type="button" className="fit-user" onClick={onProfileClick}>
          <span className="fit-avatar fit-avatar-initial">{initial}</span><b>{profileName}</b>
        </button>
      </div>
    </aside>
  )
}

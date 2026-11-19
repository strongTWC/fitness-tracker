export default function MobileBottomNav({ items, activeView, onNavigate }) {
  return (
    <nav className="fit-mobile-nav" aria-label="เมนูด้านล่าง">
      {items.map(({ id, label, icon: Icon }) => (
        <button key={id} type="button" className={activeView === id ? 'active' : ''} onClick={() => onNavigate(id)} aria-current={activeView === id ? 'page' : undefined}>
          <Icon size={18} /><span>{label}</span>
        </button>
      ))}
    </nav>
  )
}

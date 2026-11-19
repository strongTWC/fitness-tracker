export default function GlobalHeader({ pageTitle, onLogoClick, onProfileClick, profile = {} }) {
  const name = profile.name || 'Tanawat'
  const avatarUrl = profile.avatarUrl || profile.imageUrl
  const initials = profile.initials || name.trim().charAt(0).toUpperCase() || 'T'
  return (
    <header className="fit-topbar">
      <div className="fit-topbar-branding">
        <button type="button" className="fit-topbar-logo" onClick={onLogoClick} aria-label="กลับไปหน้าเช็คอิน">
          fitcheck<span>.</span>
        </button>
        <i aria-hidden="true">/</i><b>{pageTitle}</b>
      </div>
      <button type="button" className="fit-topbar-profile" onClick={onProfileClick} aria-label="เปิดโปรไฟล์" title="โปรไฟล์">
        {avatarUrl ? <img className="fit-topbar-avatar-image" src={avatarUrl} alt="" /> : <span className="fit-avatar fit-avatar-initial">{initials}</span>}
        <span className="fit-topbar-profile-name">{name}</span>
      </button>
    </header>
  )
}

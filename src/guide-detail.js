const assetBase = import.meta.env.BASE_URL
const imageByCategory = {
  'อก': 'chest.png',
  'ไหล่': 'shoulders.png',
  'หลัง': 'back.png',
  'แขน': 'biceps.png',
  'ขา': 'legs-calves.png',
  ABS: 'abs.png',
  CARDIO: 'cardio.png',
  CLASS: 'yoga.png',
}

function imageForModal(modal) {
  const eyebrow = modal.querySelector('.fit-eyebrow')?.textContent?.trim().toUpperCase() || ''
  const heading = modal.querySelector('#fit-guide-modal-title')?.textContent?.trim() || ''
  const activeTab = modal.querySelector('.guide-subcategory-tabs [aria-selected="true"]')?.textContent?.trim().toLowerCase() || ''

  let file = Object.entries(imageByCategory).find(([label]) => eyebrow.includes(label.toUpperCase()))?.[1]
  if (eyebrow.includes('แขน')) {
    file = activeTab.includes('triceps') || activeTab.includes('แขนหลัง') ? 'triceps.png' : 'biceps.png'
  }
  return { file: file || 'chest.png', alt: `${heading}${activeTab ? ` · ${activeTab}` : ''}` }
}

function enhanceGuideModal(modal) {
  const anatomyLayout = modal.querySelector('.anatomy-layout')
  if (!anatomyLayout) return

  let media = modal.querySelector('.guide-detail-media')
  if (!media) {
    media = document.createElement('div')
    media.className = 'guide-detail-media'
    media.setAttribute('role', 'img')
    media.setAttribute('aria-label', 'ภาพกายวิภาคกล้ามเนื้อ')
    const image = document.createElement('img')
    image.alt = ''
    image.loading = 'lazy'
    media.append(image)
    anatomyLayout.before(media)
  }

  const { file, alt } = imageForModal(modal)
  const image = media.querySelector('img')
  const src = `${assetBase}${file}`
  if (image && image.getAttribute('src') !== src) image.setAttribute('src', src)
  if (image && image.alt !== alt) image.alt = alt
  media.setAttribute('aria-label', alt)
}

function enhanceVisibleGuideModals() {
  document.querySelectorAll('.anatomy-modal').forEach(enhanceGuideModal)
}

enhanceVisibleGuideModals()
new MutationObserver(enhanceVisibleGuideModals).observe(document.documentElement, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['aria-selected'],
})

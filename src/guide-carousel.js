const GUIDE_SELECTOR = '.fit-guide'

function getPageStep(cards, scroller) {
  if (!cards.length) return 300
  const cardWidth = cards[0].getBoundingClientRect().width || 152
  const track = cards[0].parentElement
  const computedGap = track ? parseFloat(getComputedStyle(track).gap || '16') : 16
  const gap = Number.isNaN(computedGap) ? 16 : computedGap
  const stepUnit = cardWidth + gap
  const visibleCount = Math.max(1, Math.floor((scroller.clientWidth + gap) / stepUnit))
  return visibleCount * stepUnit
}

function enhanceGuide(guide) {
  if (guide.dataset.carouselReady === 'true') return

  const scroller = guide.querySelector('.fit-guide-scroller')
  const track = guide.querySelector('.fit-guide-grid')
  const heading = guide.querySelector('.fit-guide-heading')
  if (!scroller || !track || !heading) return

  const cards = [...track.querySelectorAll('.fit-guide-tile')]
  if (!cards.length) return

  guide.dataset.carouselReady = 'true'
  scroller.classList.add('overflow-x-auto', 'snap-x', 'snap-mandatory')
  scroller.setAttribute('role', 'region')
  scroller.setAttribute('aria-label', 'Gym Guide categories')
  scroller.setAttribute('tabindex', '0')
  track.classList.add('fit-guide-carousel-track')
  cards.forEach((card) => card.classList.add('shrink-0', 'snap-start'))

  const controls = document.createElement('div')
  controls.className = 'fit-guide-carousel-controls'
  controls.setAttribute('aria-label', 'Carousel navigation')

  const previous = document.createElement('button')
  previous.type = 'button'
  previous.className = 'fit-guide-carousel-arrow'
  previous.setAttribute('aria-label', 'Previous Gym Guide categories')
  previous.innerHTML = '<span aria-hidden="true">‹</span>'

  const next = document.createElement('button')
  next.type = 'button'
  next.className = 'fit-guide-carousel-arrow'
  next.setAttribute('aria-label', 'Next Gym Guide categories')
  next.innerHTML = '<span aria-hidden="true">›</span>'

  controls.append(previous, next)
  heading.append(controls)

  const indicators = document.createElement('div')
  indicators.className = 'fit-guide-carousel-indicators'
  indicators.setAttribute('role', 'group')
  indicators.setAttribute('aria-label', 'Choose Gym Guide category slide')

  const dots = cards.map((card, index) => {
    const dot = document.createElement('button')
    dot.type = 'button'
    dot.className = 'fit-guide-carousel-dot'
    dot.setAttribute('aria-label', `Go to category ${index + 1}: ${card.textContent.trim()}`)
    dot.addEventListener('click', () =>
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
    )
    indicators.append(dot)
    return dot
  })
  scroller.after(indicators)

  function activeIndex() {
    const left = scroller.getBoundingClientRect().left
    return cards.reduce((bestIndex, card, index) => {
      const distance = Math.abs(card.getBoundingClientRect().left - left)
      const bestDistance = Math.abs(cards[bestIndex].getBoundingClientRect().left - left)
      return distance < bestDistance ? index : bestIndex
    }, 0)
  }

  function update() {
    const active = activeIndex()
    dots.forEach((dot, index) => {
      const selected = index === active
      dot.classList.toggle('active', selected)
      if (selected) dot.setAttribute('aria-current', 'true')
      else dot.removeAttribute('aria-current')
    })
    previous.disabled = scroller.scrollLeft <= 2
    next.disabled = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 2
  }

  function scrollByGroup(direction) {
    const distance = getPageStep(cards, scroller)
    scroller.scrollBy({ left: direction * distance, behavior: 'smooth' })
  }

  previous.addEventListener('click', () => scrollByGroup(-1))
  next.addEventListener('click', () => scrollByGroup(1))
  scroller.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update)
  requestAnimationFrame(update)
}

function enhanceAllGuides() {
  document.querySelectorAll(GUIDE_SELECTOR).forEach(enhanceGuide)
}

enhanceAllGuides()
new MutationObserver(enhanceAllGuides).observe(document.documentElement, {
  childList: true,
  subtree: true,
})

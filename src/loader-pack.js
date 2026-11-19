const TAU = Math.PI * 2
const TOP = -Math.PI / 2
const SEGMENTS = 8
const RADIUS = 40
const STROKE = 20
const GAP = 0.04
const TRAIL_LENGTH = 3.2

function positiveModulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor
}

function withAlpha(hex, alpha) {
  const value = hex.replace('#', '')
  const normalized = value.length === 3 ? value.split('').map((part) => part + part).join('') : value
  const number = Number.parseInt(normalized, 16)
  const red = number >> 16
  const green = (number >> 8) & 255
  const blue = number & 255
  return 'rgba(' + red + ',' + green + ',' + blue + ',' + Math.max(0, Math.min(1, alpha)) + ')'
}

class LPLoader extends HTMLElement {
  static get observedAttributes() {
    return ['size', 'speed', 'text', 'paused']
  }

  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    const style = document.createElement('style')
    style.textContent = ':host{display:inline-block;width:120px;height:144px;line-height:0;vertical-align:middle}canvas{display:block;width:100%;height:100%}'
    this._canvas = document.createElement('canvas')
    this._context = this._canvas.getContext('2d')
    shadow.append(style, this._canvas)
    this._time = 0
    this._lastFrame = 0
    this._raf = 0
    this._loop = this._loop.bind(this)
    this._setup = this._setup.bind(this)
  }

  connectedCallback() {
    if (!this.hasAttribute('role')) this.setAttribute('role', 'progressbar')
    this._setup()
    if (!this._raf) this._raf = requestAnimationFrame(this._loop)
  }

  disconnectedCallback() {
    if (this._raf) cancelAnimationFrame(this._raf)
    this._raf = 0
    this._lastFrame = 0
  }

  attributeChangedCallback() {
    if (this.isConnected) this._setup()
  }

  _setup() {
    this._size = Math.max(48, Number.parseFloat(this.getAttribute('size')) || 120)
    this._scale = this._size / 120
    this._width = this._size
    this._height = this._size * 1.2
    this._dpr = Math.min(window.devicePixelRatio || 1, 3)
    this._canvas.width = Math.round(this._width * this._dpr)
    this._canvas.height = Math.round(this._height * this._dpr)
    this._canvas.style.width = this._width + 'px'
    this._canvas.style.height = this._height + 'px'
    this.style.width = this._width + 'px'
    this.style.height = this._height + 'px'
    this.setAttribute('aria-label', this.getAttribute('label') || 'กำลังโหลด FitCheck')
    this._draw()
  }

  _loop(now) {
    if (!this.isConnected) {
      this._raf = 0
      return
    }
    const delta = this._lastFrame ? Math.min(0.1, (now - this._lastFrame) / 1000) : 0
    this._lastFrame = now
    if (!this.hasAttribute('paused')) {
      const speed = Number.parseFloat(this.getAttribute('speed')) || 1
      this._time += delta * speed
    }
    this._draw()
    this._raf = requestAnimationFrame(this._loop)
  }

  _draw() {
    const ctx = this._context
    if (!ctx) return
    const dpr = this._dpr || 1
    const scale = this._scale || 1
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, this._width, this._height)
    ctx.save()
    ctx.translate(this._width / 2, 62 * scale)
    ctx.scale(scale, scale)
    const head = this._time * 4.2
    const color = '#3FA052'
    const highlight = '#B8FFB2'
    const step = TAU / SEGMENTS

    for (let index = 0; index < SEGMENTS; index += 1) {
      const start = TOP + index * step + GAP
      const end = TOP + (index + 1) * step - GAP
      const distance = positiveModulo(head - (index + 0.5), SEGMENTS)
      const trail = distance < TRAIL_LENGTH ? Math.pow(1 - distance / TRAIL_LENGTH, 1.5) : 0
      ctx.beginPath()
      ctx.arc(0, 0, RADIUS, start, end)
      ctx.lineWidth = STROKE
      ctx.lineCap = 'butt'
      ctx.strokeStyle = withAlpha(color, 0.5 + 0.3 * trail)
      ctx.stroke()
      if (trail > 0) {
        ctx.beginPath()
        ctx.arc(0, 0, RADIUS, start, end)
        ctx.lineWidth = STROKE
        ctx.strokeStyle = withAlpha(highlight, 0.55 * trail * trail)
        ctx.stroke()
      }
    }

    const label = this.getAttribute('text') || '...LOADING'
    const characters = Array.from(label)
    ctx.font = '500 7.4px -apple-system, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif'
    const spacing = 1.1
    const widths = characters.map((character) => ctx.measureText(character).width)
    const totalWidth = widths.reduce((sum, width) => sum + width, 0) + spacing * Math.max(0, characters.length - 1)
    let cursor = -totalWidth / 2
    characters.forEach((character, index) => {
      const phase = positiveModulo(this._time * 0.55 - (index / Math.max(1, characters.length)) * 0.45, 1)
      const alpha = character === '.'
        ? 0.25 + 0.75 * (phase < 0.5 ? 1 : 0) * Math.pow(Math.sin(Math.PI * phase * 2), 2)
        : 0.55 + 0.45 * Math.exp(-Math.pow((phase - 0.5) * 7, 2))
      ctx.fillStyle = withAlpha('#7CE28A', alpha)
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillText(character, cursor, 0)
      cursor += widths[index] + spacing
    })
    ctx.restore()
  }
}

if (!customElements.get('lp-loader')) {
  customElements.define('lp-loader', LPLoader)
}

window.LoaderPack = Object.assign(window.LoaderPack || {}, {
  types: ['segment-donut'],
  info: { 'segment-donut': { bar: false, percent: null } },
})

export {}

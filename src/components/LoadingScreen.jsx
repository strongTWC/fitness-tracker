import '../loader-pack.js'
import './LoadingScreen.css'

export default function LoadingScreen({ leaving = false }) {
  return (
    <div
      className={'fit-loader-overlay' + (leaving ? ' is-leaving' : '')}
      role="status"
      aria-live="polite"
      aria-label="กำลังโหลด FitCheck"
    >
      <lp-loader type="segment-donut" size="120" />
    </div>
  )
}

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Activity, CalendarDays, Crown, Dumbbell, Medal, Ruler, Save, Scale, Trophy } from 'lucide-react'

type Leader = {
  name: string
  gymVisits: number
  streak: number
  initials: string
  color: string
  isCurrentUser?: boolean
}

type Measurement = {
  id: string
  date: string
  heightCm: number
  weightKg: number
  waistCm: number | null
  hipCm: number | null
}

const STORAGE_KEY = 'fitcheck-body-measurements-v1'
const baseLeaders: Leader[] = [
  { name: 'Pimchanok', gymVisits: 21, streak: 8, initials: 'P', color: 'rose' },
  { name: 'Tanawat', gymVisits: 18, streak: 4, initials: 'T', color: 'lime', isCurrentUser: true },
  { name: 'Nattapong', gymVisits: 16, streak: 6, initials: 'N', color: 'blue' },
  { name: 'Siriporn', gymVisits: 13, streak: 3, initials: 'S', color: 'purple' },
  { name: 'Krit', gymVisits: 11, streak: 2, initials: 'K', color: 'orange' },
]

function readMeasurements(): Measurement[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) as Measurement[] : []
  } catch {
    return []
  }
}

function bmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: 'น้ำหนักน้อย', tone: 'low' }
  if (bmi < 23) return { label: 'สมส่วน', tone: 'healthy' }
  if (bmi < 25) return { label: 'น้ำหนักเกิน', tone: 'high' }
  if (bmi < 30) return { label: 'โรคอ้วนระดับ 1', tone: 'high' }
  return { label: 'โรคอ้วนระดับ 2 ขึ้นไป', tone: 'high' }
}

function Challenge() {
  const [measurements, setMeasurements] = useState<Measurement[]>(readMeasurements)
  const [heightCm, setHeightCm] = useState('')
  const [weightKg, setWeightKg] = useState('')
  const [waistCm, setWaistCm] = useState('')
  const [hipCm, setHipCm] = useState('')
  const [saved, setSaved] = useState(false)
  const latest = measurements[0]
  const bmi = useMemo(() => latest ? latest.weightKg / ((latest.heightCm / 100) ** 2) : null, [latest])
  const category = bmi === null ? null : bmiCategory(bmi)
  const leaders = useMemo(() => baseLeaders.map((leader) => leader.isCurrentUser ? { ...leader, gymVisits: leader.gymVisits + Math.max(0, measurements.length - 1) } : leader).sort((a, b) => b.gymVisits - a.gymVisits), [measurements.length])
  const currentRank = leaders.findIndex((leader) => leader.isCurrentUser) + 1

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(measurements))
  }, [measurements])

  function saveMeasurement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const height = Number(heightCm)
    const weight = Number(weightKg)
    const waist = waistCm ? Number(waistCm) : null
    const hip = hipCm ? Number(hipCm) : null
    if (!Number.isFinite(height) || height < 80 || height > 250 || !Number.isFinite(weight) || weight < 20 || weight > 350) return
    if ((waist !== null && (!Number.isFinite(waist) || waist < 30 || waist > 250)) || (hip !== null && (!Number.isFinite(hip) || hip < 30 || hip > 250))) return
    const entry: Measurement = { id: crypto.randomUUID(), date: new Date().toISOString(), heightCm: height, weightKg: weight, waistCm: waist, hipCm: hip }
    setMeasurements((current) => [entry, ...current])
    setHeightCm('')
    setWeightKg('')
    setWaistCm('')
    setHipCm('')
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  return (
    <section className="challenge-page" aria-label="Monthly challenge and body measurements">
      <div className="challenge-inner">
        <header className="challenge-header">
          <div><div className="challenge-kicker"><span /> THIS MONTH'S CHALLENGE</div><h2>ขยับให้สุด แล้วหยุดที่อันดับหนึ่ง <Trophy size={21} /></h2><p>สะสมจำนวนวันที่เข้ายิมในเดือนนี้ แล้วชวนเพื่อนมาแข่งกัน</p></div>
          <div className="challenge-month"><CalendarDays size={16} /> พฤศจิกายน 2569</div>
        </header>

        <div className="challenge-grid">
          <section className="leaderboard-card" id="challenge" aria-labelledby="leaderboard-title">
            <div className="challenge-card-heading"><div><span className="challenge-kicker">MONTHLY LEADERBOARD</span><h3 id="leaderboard-title">กระดานผู้นำ</h3></div><span className="live-pill">● กำลังแข่งขัน</span></div>
            <div className="leader-summary"><div><b>18</b><span>ครั้งที่เข้ายิมของคุณ</span></div><div className="rank-summary"><b>อันดับ {currentRank}</b><span>จากผู้ร่วมแข่งขัน 28 คน</span></div></div>
            <div className="leader-list">{leaders.map((leader, index) => <div className={`leader-row ${leader.isCurrentUser ? 'you' : ''}`} key={leader.name}><span className={`leader-rank ${index < 3 ? `rank-${index + 1}` : ''}`}>{index === 0 ? <Crown size={15} /> : index === 1 ? <Medal size={15} /> : index + 1}</span><span className={`leader-avatar ${leader.color}`}>{leader.initials}</span><span className="leader-name">{leader.name}{leader.isCurrentUser && <small>คุณ</small>}</span><span className="leader-visits"><b>{leader.gymVisits}</b><small>ครั้ง</small></span></div>)}</div>
            <div className="leaderboard-foot"><Dumbbell size={14} /> เช็คอินที่ยิมเพื่อขยับอันดับของคุณ</div>
          </section>

          <section className="body-card" id="body-metrics" aria-labelledby="body-title">
            <div className="challenge-card-heading"><div><span className="challenge-kicker">YOUR BODY JOURNAL</span><h3 id="body-title">สัดส่วนร่างกาย</h3></div><span className="body-card-icon"><Activity size={17} /></span></div>
            <p className="body-intro">บันทึกน้ำหนักและส่วนสูงเพื่อคำนวณ BMI พร้อมติดตามการเปลี่ยนแปลง</p>
            {bmi !== null && category ? <div className={`bmi-result ${category.tone}`}><div className="bmi-number"><span>BMI ล่าสุด</span><b>{bmi.toFixed(1)}</b></div><div className="bmi-category"><b>{category.label}</b><small>ดัชนีมวลกาย (กก./ม²)</small></div><Scale size={23} /></div> : <div className="bmi-empty"><Scale size={21} /><span>กรอกส่วนสูงและน้ำหนักเพื่อดูค่า BMI</span></div>}
            <form className="measurement-form" onSubmit={saveMeasurement}>
              <div className="measurement-fields"><label>ส่วนสูง (ซม.)<input type="number" min="80" max="250" step="0.1" value={heightCm} onChange={(event) => setHeightCm(event.target.value)} placeholder="เช่น 170" required /></label><label>น้ำหนัก (กก.)<input type="number" min="20" max="350" step="0.1" value={weightKg} onChange={(event) => setWeightKg(event.target.value)} placeholder="เช่น 65" required /></label><label>รอบเอว (ซม.)<input type="number" min="30" max="250" step="0.1" value={waistCm} onChange={(event) => setWaistCm(event.target.value)} placeholder="ไม่บังคับ" /></label><label>รอบสะโพก (ซม.)<input type="number" min="30" max="250" step="0.1" value={hipCm} onChange={(event) => setHipCm(event.target.value)} placeholder="ไม่บังคับ" /></label></div>
              <button className="measurement-save" type="submit"><Save size={15} /> {saved ? 'บันทึกแล้ว' : 'บันทึกสัดส่วน'}</button>
            </form>
            {latest && <div className="measurement-history"><div className="history-title"><Ruler size={14} /> บันทึกล่าสุด <span>{new Date(latest.date).toLocaleDateString('th-TH')}</span></div><div className="history-values"><span><b>{latest.weightKg}</b> กก.</span><span><b>{latest.heightCm}</b> ซม.</span>{latest.waistCm !== null && <span>เอว <b>{latest.waistCm}</b></span>}{latest.hipCm !== null && <span>สะโพก <b>{latest.hipCm}</b></span>}</div></div>}
            <p className="bmi-disclaimer">BMI เป็นเพียงค่าประเมินเบื้องต้น ไม่ใช่การวินิจฉัยสุขภาพ</p>
          </section>
        </div>
        <footer className="challenge-footer"><Activity size={14} /> แข่งขันอย่างสนุกและดูแลสุขภาพในแบบของคุณ</footer>
      </div>
    </section>
  )
}

export default Challenge

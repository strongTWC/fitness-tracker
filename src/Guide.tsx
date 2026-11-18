import { useState } from 'react'
import { Activity, ArrowLeft, ChevronRight, Dumbbell, Flame, HeartPulse, MoveRight, ShieldCheck, Target, Zap } from 'lucide-react'

type MuscleGroup = 'ทั้งหมด' | 'หน้าอก' | 'หลัง' | 'ขา' | 'ไหล่' | 'แขน' | 'แกนกลาง'

type Exercise = {
  id: number
  name: string
  thaiName: string
  muscle: Exclude<MuscleGroup, 'ทั้งหมด'>
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  sets: string
  accent: string
  tip: string
}

const exercises: Exercise[] = [
  { id: 1, name: 'Barbell Squat', thaiName: 'สควอตบาร์เบล', muscle: 'ขา', level: 'Intermediate', sets: '3 × 8–12', accent: 'lime', tip: 'กดพื้นให้มั่นคง ยกอกและรักษาเข่าไม่พับเข้าข้างใน' },
  { id: 2, name: 'Bench Press', thaiName: 'เบนช์เพรส', muscle: 'หน้าอก', level: 'Beginner', sets: '3 × 8–12', accent: 'peach', tip: 'เก็บไหล่ให้แน่น เหยียดแขนโดยควบคุมแท่งบาร์' },
  { id: 3, name: 'Pull Up', thaiName: 'พันอัพ', muscle: 'หลัง', level: 'Intermediate', sets: '3 × 6–10', accent: 'mint', tip: 'ดึงข้อศอกลงด้านล่าง ใช้กล้ามเนื้อหลังมากกว่าการแกว่งตัว' },
  { id: 4, name: 'Romanian Deadlift', thaiName: 'โรมาเนียนเดดลิฟต์', muscle: 'ขา', level: 'Intermediate', sets: '3 × 8–10', accent: 'orange', tip: 'กดสะโพกไปด้านหลัง ให้บาร์แนบขาและคงสันหลังตรง' },
  { id: 5, name: 'Overhead Press', thaiName: 'อ็อฟเวอร์เฮดเพรส', muscle: 'ไหล่', level: 'Intermediate', sets: '3 × 8–10', accent: 'blue', tip: 'เกร็งแกนกลางและยกน้ำหนักตรงเหนือศีรษะ' },
  { id: 6, name: 'Plank', thaiName: 'แพล้งก์', muscle: 'แกนกลาง', level: 'Beginner', sets: '3 × 30–60 วิ', accent: 'purple', tip: 'จัดกายเป็นเส้นตรง หายใจสม่ำเสมอและเกร็งหน้าท้อง' },
  { id: 7, name: 'Barbell Curl', thaiName: 'บาร์เบลคัล', muscle: 'แขน', level: 'Beginner', sets: '3 × 10–12', accent: 'yellow', tip: 'กดข้อศอกชิดลำตัว หลีกเลี่ยงการแกว่งแขน' },
]

const pairings = [
  { id: 1, title: 'Push Day', thai: 'วันดัน', muscles: 'หน้าอก · ไหล่ · ไตรเซปส์', detail: 'Bench Press + Overhead Press + Triceps Extension', accent: 'peach', icon: Zap },
  { id: 2, title: 'Pull Day', thai: 'วันดึง', muscles: 'หลัง · แขนหลัง · ไบเซปส์', detail: 'Pull Up + Barbell Row + Barbell Curl', accent: 'mint', icon: MoveRight },
  { id: 3, title: 'Leg Day', thai: 'วันขา', muscles: 'ขา · สะโพก · แกนกลาง', detail: 'Squat + Romanian Deadlift + Leg Extension', accent: 'lime', icon: Activity },
  { id: 4, title: 'Upper / Lower', thai: 'แยกบนล่าง', muscles: 'สลับเนื้อหากลุ่มบนและล่าง', detail: 'Upper: Push + Pull  |  Lower: Legs + Core', accent: 'blue', icon: Target },
]

const filters: MuscleGroup[] = ['ทั้งหมด', 'หน้าอก', 'หลัง', 'ขา', 'ไหล่', 'แขน', 'แกนกลาง']

export default function Guide() {
  const [filter, setFilter] = useState<MuscleGroup>('ทั้งหมด')
  const [expanded, setExpanded] = useState<number | null>(1)
  const visibleExercises = filter === 'ทั้งหมด' ? exercises : exercises.filter((exercise) => exercise.muscle === filter)

  return (
    <section className="guide-page" id="guide" aria-label="คู่มือท่าออกกำลังกายและการจับคู่กล้ามเนื้อ">
      <div className="guide-inner">
        <header className="guide-header">
          <div>
            <div className="guide-kicker"><span /> WORKOUT GUIDE</div>
            <h1>คู่มือท่าออกกำลังกาย <Dumbbell size={22} /></h1>
            <p>เรียนรู้ท่าเน้นกลุ่มกล้ามเนื้อ และวางแผนวันฝึกให้สมดุล</p>
          </div>
          <a href="#home" className="guide-back"><ArrowLeft size={15} /> กลับหน้าเช็คอิน</a>
        </header>

        <section className="pairing-section" aria-labelledby="pairing-title">
          <div className="guide-section-heading">
            <div><span className="guide-kicker">TRAIN SMARTER</span><h2 id="pairing-title">หลักการจับคู่กล้ามเนื้อ</h2></div>
            <span className="guide-tip"><ShieldCheck size={14} /> พักกลุ่มที่ฝึกอย่างน้อย 48 ชม.</span>
          </div>
          <div className="pairing-grid">
            {pairings.map((pairing) => {
              const Icon = pairing.icon
              return (
                <article className={`pairing-card ${pairing.accent}`} key={pairing.id}>
                  <div className="pairing-card-top"><span className="pairing-icon"><Icon size={18} /></span><span className="pairing-number">0{pairing.id}</span></div>
                  <h3>{pairing.title}</h3>
                  <div className="pairing-thai">{pairing.thai}</div>
                  <p>{pairing.muscles}</p>
                  <div className="pairing-detail">{pairing.detail}</div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="exercise-section" aria-labelledby="exercise-title">
          <div className="guide-section-heading">
            <div><span className="guide-kicker">EXERCISE DIRECTORY</span><h2 id="exercise-title">ท่าแนะนำ</h2></div>
            <span className="exercise-count">{visibleExercises.length} ท่า</span>
          </div>

          <div className="exercise-filters" aria-label="กรองตามกลุ่มกล้ามเนื้อ">
            {filters.map((item) => <button type="button" key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}
          </div>

          <div className="exercise-list">
            {visibleExercises.map((exercise) => (
              <article className={`exercise-card ${expanded === exercise.id ? 'expanded' : ''}`} key={exercise.id}>
                <button type="button" className="exercise-summary" onClick={() => setExpanded(expanded === exercise.id ? null : exercise.id)} aria-expanded={expanded === exercise.id}>
                  <span className={`exercise-icon ${exercise.accent}`}><Dumbbell size={19} /></span>
                  <span className="exercise-name"><b>{exercise.thaiName}</b><small>{exercise.name}</small></span>
                  <span className="exercise-muscle">{exercise.muscle}</span>
                  <span className="exercise-level">{exercise.level}</span>
                  <span className="exercise-sets">{exercise.sets}</span>
                  <ChevronRight size={16} className="exercise-chevron" />
                </button>
                {expanded === exercise.id && <div className="exercise-detail"><HeartPulse size={15} /><div><b>จุดสำคัญในการทำท่า</b><p>{exercise.tip}</p></div><span className="exercise-safety">ควบคุมท่าให้ปลอดภัยก่อนเพิ่มน้ำหนัก</span></div>}
              </article>
            ))}
          </div>
        </section>

        <footer className="guide-footer"><Flame size={14} /> เริ่มจากน้ำหนักเบา เน้นเทคนิคที่ถูกต้อง และปรับโปรแกรมตามความพร้อมของร่างกาย</footer>
      </div>
    </section>
  )
}

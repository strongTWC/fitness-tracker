import { useState } from 'react'
import { Activity, Bike, Dumbbell, HeartPulse, MoveRight, ShieldCheck, Zap } from 'lucide-react'

const categories = [
  { id: 'chest', label: 'อก', icon: Dumbbell, exercise: 'Bench Press', focus: 'วางสะบักให้มั่นคง ควบคุมบาร์ลงอย่างนุ่มนวล และไม่เด้งบาร์จากอก' },
  { id: 'shoulders', label: 'ไหล่', icon: Activity, exercise: 'Overhead Press', focus: 'เกร็งแกนกลาง จัดข้อมือให้อยู่เหนือข้อศอก และไม่แอ่นหลังเกินไป' },
  { id: 'back', label: 'หลัง', icon: MoveRight, exercise: 'Lat Pulldown', focus: 'ดึงศอกลงเข้าหาลำตัว คุมจังหวะคืน และหลีกเลี่ยงการเหวี่ยงตัว' },
  { id: 'arms', label: 'แขน', icon: Dumbbell, exercise: 'Biceps Curl', focus: 'ตรึงข้อศอกไว้ข้างลำตัว เคลื่อนไหวช้า ๆ ไม่ใช้แรงเหวี่ยง' },
  { id: 'legs', label: 'ขา', icon: Activity, exercise: 'Goblet Squat', focus: 'ลงน้ำหนักเต็มฝ่าเท้า ให้เข่าไปตามแนวปลายเท้า และรักษาหลังเป็นกลาง' },
  { id: 'abs', label: 'Abs', icon: ShieldCheck, exercise: 'Plank', focus: 'เกร็งท้องและก้น รักษาลำตัวเป็นเส้นตรง หายใจสม่ำเสมอ' },
  { id: 'cardio', label: 'Cardio', icon: Bike, exercise: 'จักรยานอยู่กับที่', focus: 'เริ่มเบาแล้วค่อยเพิ่มความหนัก รักษาจังหวะที่ยังพูดเป็นประโยคได้' },
  { id: 'class', label: 'Class', icon: HeartPulse, exercise: 'คลาส Functional Training', focus: 'ทำตามระดับที่เหมาะกับตัวเอง แจ้งผู้สอนหากมีอาการเจ็บหรือข้อจำกัด' },
]

export default function Guide() {
  const [selected, setSelected] = useState(null)
  const [expanded, setExpanded] = useState(false)

  return (
    <section className={`fit-guide ${expanded ? 'expanded' : ''}`} id="gym-guide" aria-labelledby="fit-guide-title">
      <header className="fit-guide-heading"><div><div className="fit-eyebrow"><span /> GYM GUIDE</div><h2 id="fit-guide-title">Gym Guide</h2></div><button className="fit-guide-more" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>{expanded ? 'Less' : 'More'}<span>{expanded ? 'ซ่อน' : 'ดูทั้งหมด'}</span></button></header>
      <div className="fit-guide-scroller"><div className="fit-guide-grid">{categories.map((category) => { const Icon = category.icon; return <button key={category.id} type="button" className="fit-guide-tile" onClick={() => setSelected(category)} aria-label={`ดูคู่มือท่า${category.label}`}><Icon size={20} /><b>{category.label}</b></button> })}</div></div>
      {selected && <div className="fit-guide-backdrop" role="presentation" onClick={() => setSelected(null)}><section className="fit-guide-modal" role="dialog" aria-modal="true" aria-labelledby="fit-guide-modal-title" onClick={(event) => event.stopPropagation()}><button className="fit-guide-close" onClick={() => setSelected(null)} aria-label="ปิด">×</button><div className="fit-eyebrow"><span /> {selected.label.toUpperCase()}</div><h3 id="fit-guide-modal-title">{selected.label} · ท่าแนะนำ</h3><div className="fit-guide-detail"><Dumbbell size={16} /><div><b>ท่าแนะนำ</b><p>{selected.exercise}</p></div></div><div className="fit-guide-detail"><Zap size={16} /><div><b>จุดสำคัญ</b><p>{selected.focus}</p></div></div></section></div>}
    </section>
  )
}

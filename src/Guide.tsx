import { useMemo, useState } from 'react'
import {
  Activity,
  Bike,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Flame,
  HeartPulse,
  MoveRight,
  Search,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from 'lucide-react'
import './guide-anatomy.css'

export interface GuideSection {
  id: string
  label: string
  zone: string
  exercises: string[]
  tips: string[]
}

export interface GuideCategory {
  id: string
  label: string
  group: 'muscle' | 'activity'
  icon: typeof Dumbbell
  sections: GuideSection[]
}

const categories: GuideCategory[] = [
  {
    id: 'chest',
    label: 'อก',
    group: 'muscle',
    icon: Dumbbell,
    sections: [
      {
        id: 'upper-chest',
        label: 'อกบน (Upper Chest)',
        zone: 'upperChest',
        exercises: ['Incline Dumbbell Press — 3 × 8–12', 'Incline Push-up — 3 × 10–15'],
        tips: [
          'ปรับม้านั่งเอียงประมาณ 15–30° และเก็บสะบัก',
          'ลดน้ำหนักลงอย่างควบคุม ไม่เด้งดัมเบลที่อก',
          'หยุดเมื่อรู้สึกเจ็บแปลบที่หัวไหล่',
        ],
      },
      {
        id: 'lower-chest',
        label: 'อกล่าง (Lower Chest)',
        zone: 'lowerChest',
        exercises: ['Decline Push-up — 3 × 8–15', 'Chest Dip — 3 × 6–10'],
        tips: [
          'เอนตัวไปข้างหน้าเล็กน้อยระหว่างดัน',
          'รักษาหัวไหล่ให้ต่ำและไม่ยกไหล่เข้าหาหู',
          'ใช้ระยะการเคลื่อนไหวที่ไม่ทำให้ไหล่เจ็บ',
        ],
      },
    ],
  },
  {
    id: 'shoulders',
    label: 'ไหล่',
    group: 'muscle',
    icon: Activity,
    sections: [
      {
        id: 'front-side-delts',
        label: 'ไหล่หน้า/ข้าง (Front/Side Delts)',
        zone: 'frontDelts',
        exercises: ['Dumbbell Shoulder Press — 3 × 8–12', 'Lateral Raise — 3 × 12–15'],
        tips: [
          'เกร็งลำตัวและไม่แอ่นหลัง',
          'ยกแขนในระนาบเฉียงไปด้านหน้าเล็กน้อย',
          'เลือกน้ำหนักที่ไม่ต้องเหวี่ยงตัว',
        ],
      },
      {
        id: 'rear-delts',
        label: 'ไหล่หลัง (Rear Delts)',
        zone: 'rearDelts',
        exercises: ['Face Pull — 3 × 12–15', 'Reverse Fly — 3 × 10–15'],
        tips: [
          'เริ่มจากสะบักและกางแขนอย่างควบคุม',
          'รักษาคอผ่อนคลาย ไม่ยักไหล่',
          'ใช้แรงต้านเบาเพื่อรักษาท่าทาง',
        ],
      },
    ],
  },
  {
    id: 'back',
    label: 'หลัง',
    group: 'muscle',
    icon: MoveRight,
    sections: [
      {
        id: 'upper-back',
        label: 'หลังบน (Upper Back/Lats)',
        zone: 'upperBack',
        exercises: ['Lat Pulldown — 3 × 8–12', 'Seated Cable Row — 3 × 8–12'],
        tips: [
          'ดึงศอกลงหรือไปด้านหลัง ไม่กระชากด้วยมือ',
          'รักษากระดูกสันหลังเป็นกลาง',
          'คืนแขนช้า ๆ เพื่อควบคุมแรงต้าน',
        ],
      },
      {
        id: 'lower-back',
        label: 'หลังล่าง (Lower Back)',
        zone: 'lowerBack',
        exercises: ['Bird Dog — 3 × 8/ข้าง', 'Hip Hinge Drill — 3 × 10'],
        tips: [
          'เคลื่อนไหวจากสะโพกและคงหลังเป็นกลาง',
          'เริ่มโดยไม่ใช้น้ำหนักหนักจนกว่าจะคุมท่าได้นิ่ง',
          'หายใจออกเมื่อออกแรง',
        ],
      },
    ],
  },
  {
    id: 'arms',
    label: 'แขน',
    group: 'muscle',
    icon: Zap,
    sections: [
      {
        id: 'biceps',
        label: 'หน้าแขน (Biceps)',
        zone: 'biceps',
        exercises: ['Dumbbell Bicep Curl — 3 × 10–12', 'Hammer Curl — 3 × 10–12'],
        tips: [
          'ตรึงต้นศอกให้อยู่ข้างลำตัวตลอดการงอ',
          'ลดน้ำหนักลงช้า ๆ 2–3 วินาที',
          'ไม่เหวี่ยงลำตัวช่วยยก',
        ],
      },
      {
        id: 'triceps',
        label: 'หลังแขน (Triceps)',
        zone: 'triceps',
        exercises: ['Cable Tricep Pushdown — 3 × 10–15', 'Overhead Tricep Extension — 3 × 10–12'],
        tips: [
          'เหยียดศอกจนสุดโดยไม่ขยับต้นแขนไปมา',
          'คุมข้อมือให้ตรง ไม่หักข้อมือ',
          'เลือกน้ำหนักที่คุมจังหวะได้ตลอดเซต',
        ],
      },
    ],
  },
  {
    id: 'legs',
    label: 'ขา',
    group: 'muscle',
    icon: Flame,
    sections: [
      {
        id: 'quads-glutes',
        label: 'ต้นขาด้านหน้า & สะโพก (Quads & Glutes)',
        zone: 'quads',
        exercises: ['Goblet Squat — 3 × 8–12', 'Glute Bridge — 3 × 12–15'],
        tips: [
          'ลงน้ำหนักเต็มเท้าและเข่าเปิดตามแนวปลายเท้า',
          'เกร็งหน้าท้องเพื่อพยุงหลังล่าง',
          'ดันขึ้นจากส้นเท้าและสะโพกพร้อมกัน',
        ],
      },
      {
        id: 'hamstrings-calves',
        label: 'ต้นขาด้านหลัง & น่อง (Hamstrings & Calves)',
        zone: 'hamstrings',
        exercises: ['Romanian Deadlift — 3 × 8–12', 'Standing Calf Raise — 3 × 12–15'],
        tips: [
          'ดันสะโพกไปด้านหลังพร้อมคงหลังตรง',
          'หยุดเมื่อรู้สึกตึงที่แฮมสตริงก่อนหลังจะโค้ง',
          'ค้างจุดสูงสุดของน่อง 1 วินาทีก่อนลง',
        ],
      },
    ],
  },
  {
    id: 'abs',
    label: 'Abs',
    group: 'muscle',
    icon: ShieldCheck,
    sections: [
      {
        id: 'core-abs',
        label: 'หน้าท้อง & แกนกลาง (Core & Abs)',
        zone: 'abs',
        exercises: ['Dead Bug — 3 × 8–10/ข้าง', 'Plank — 3 × 30–45 วิ'],
        tips: [
          'กดหลังล่างให้แนบพื้นระหว่างขยับแขนขา',
          'หายใจต่อเนื่อง ไม่กลั้นหายใจค้างนานเกินไป',
          'เน้นคุณภาพการเกร็งมากกว่าจำนวนครั้งเร็ว ๆ',
        ],
      },
    ],
  },
  {
    id: 'cardio',
    label: 'Cardio',
    group: 'activity',
    icon: Bike,
    sections: [
      {
        id: 'cardio-session',
        label: 'คาร์ดิโอ (Cardio)',
        zone: 'cardio',
        exercises: ['Treadmill / Bike Steady State — 20–30 นาที', 'Interval Session — 15–20 นาที'],
        tips: [
          'วอร์มอัป 5 นาทีและคูลดาวน์ 5 นาทีทุกครั้ง',
          'รักษาจังหวะการหายใจให้สม่ำเสมอ',
          'ปรับความหนักให้เหมาะกับระดับความฟิตของวันนั้น',
        ],
      },
    ],
  },
  {
    id: 'class',
    label: 'Class',
    group: 'activity',
    icon: Sparkles,
    sections: [
      {
        id: 'yoga-class',
        label: 'โยคะ (Yoga)',
        zone: 'yoga',
        exercises: ['Sun Salutation Flow — 10–15 นาที', 'Mobility & Stretch — 15–20 นาที'],
        tips: [
          'หายใจเข้า-ออกให้สัมพันธ์กับการเคลื่อนไหว',
          'ขยับเข้าสู่ท่าเท่าที่ร่างกายยืดหยุ่นได้โดยไม่ฝืน',
          'แจ้งครูผู้สอนหากมีอาการบาดเจ็บข้อต่อหรือหลัง',
        ],
      },
    ],
  },
]

function AnatomyDiagram({
  label,
  viewMode,
  zone,
}: {
  label: string
  viewMode: 'front' | 'back'
  zone: string
}) {
  return (
    <div className="anatomy-diagram-wrap" aria-label={label}>
      <svg className="anatomy-svg" viewBox="0 0 220 320" role="img" aria-label={label}>
        <circle cx="110" cy="36" r="20" className="anatomy-body" />
        <path
          d="M72 72 Q110 58 148 72 L162 125 L138 132 L134 195 L86 195 L82 132 L58 125 Z"
          className={`anatomy-body ${viewMode === 'front' ? 'is-front' : 'is-back'}`}
        />
        <path
          d="M58 76 L34 145 L48 152 L72 95 Z M162 76 L186 145 L172 152 L148 95 Z"
          className={`anatomy-body ${zone === 'frontDelts' || zone === 'rearDelts' || zone === 'biceps' || zone === 'triceps' ? 'anatomy-highlight' : ''}`}
        />
        <path
          d="M88 195 L82 302 L103 302 L108 212 L112 212 L117 302 L138 302 L132 195 Z"
          className={`anatomy-body ${zone === 'quads' || zone === 'hamstrings' ? 'anatomy-highlight' : ''}`}
        />
        <rect
          x="84"
          y="76"
          width="52"
          height="32"
          rx="8"
          className={
            zone === 'upperChest' || zone === 'lowerChest' || zone === 'upperBack'
              ? 'anatomy-highlight-fill'
              : 'anatomy-subtle-fill'
          }
        />
        <rect
          x="92"
          y="114"
          width="36"
          height="58"
          rx="8"
          className={
            zone === 'abs' || zone === 'lowerBack' || zone === 'cardio' || zone === 'yoga'
              ? 'anatomy-highlight-fill'
              : 'anatomy-subtle-fill'
          }
        />
      </svg>
    </div>
  )
}

export default function Guide() {
  const [query, setQuery] = useState('')
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [viewMode, setViewMode] = useState<'front' | 'back'>('front')

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return categories
    return categories.filter((cat) => {
      const matchCat = cat.label.toLowerCase().includes(q)
      const matchSection = cat.sections.some(
        (sec) =>
          sec.label.toLowerCase().includes(q) ||
          sec.exercises.some((ex) => ex.toLowerCase().includes(q)) ||
          sec.tips.some((tip) => tip.toLowerCase().includes(q)),
      )
      return matchCat || matchSection
    })
  }, [query])

  const muscleCategories = filteredCategories.filter((c) => c.group === 'muscle')
  const activityCategories = filteredCategories.filter((c) => c.group === 'activity')

  const activeCategory = useMemo(
    () => categories.find((c) => c.id === activeCategoryId) ?? null,
    [activeCategoryId],
  )

  const activeSection = activeCategory?.sections[activeSectionIndex] ?? null

  function openCategoryById(categoryId: string) {
    setActiveCategoryId(categoryId)
    setActiveSectionIndex(0)
    setViewMode('front')
  }

  function closeModal() {
    setActiveCategoryId(null)
    setActiveSectionIndex(0)
  }

  function stepCategory(delta: number) {
    if (!activeCategory) return
    const idx = categories.findIndex((c) => c.id === activeCategory.id)
    const nextIdx = (idx + delta + categories.length) % categories.length
    setActiveCategoryId(categories[nextIdx].id)
    setActiveSectionIndex(0)
  }

  return (
    <section className="gym-guide-section" aria-label="Gym Guide">
      <div className="gym-guide-header">
        <div>
          <span className="gym-guide-kicker">
            <HeartPulse size={14} /> GYM GUIDE
          </span>
          <h2 className="gym-guide-title">Gym Guide</h2>
        </div>
      </div>

      <label className="gym-guide-search" aria-label="ค้นหากล้ามเนื้อ ท่าฝึก หรือคลาส">
        <Search size={16} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหากล้ามเนื้อ ท่าฝึก หรือคลาส..."
        />
        {query && (
          <button
            type="button"
            className="gym-guide-clear"
            onClick={() => setQuery('')}
            aria-label="ล้างคำค้นหา"
          >
            <X size={14} />
          </button>
        )}
      </label>

      <div className="gym-guide-group">
        <h3 className="gym-guide-group-title">กลุ่มกล้ามเนื้อหลัก</h3>
        <div className="gym-guide-grid" role="list">
          {muscleCategories.map((cat) => {
            const IconComponent = cat.icon
            return (
              <button
                key={cat.id}
                type="button"
                role="listitem"
                className="gym-guide-card"
                onClick={() => openCategoryById(cat.id)}
              >
                <span className="gym-guide-card-icon" aria-hidden="true">
                  <IconComponent size={28} strokeWidth={1.75} />
                </span>
                <span className="gym-guide-card-label">{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="gym-guide-group">
        <h3 className="gym-guide-group-title">กิจกรรม &amp; คลาส</h3>
        <div className="gym-guide-pills" role="list">
          {activityCategories.map((cat) => {
            const IconComponent = cat.icon
            return (
              <button
                key={cat.id}
                type="button"
                role="listitem"
                className="gym-guide-pill"
                onClick={() => openCategoryById(cat.id)}
              >
                <IconComponent size={16} strokeWidth={1.75} aria-hidden="true" />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {activeCategory && activeSection && (
        <div className="anatomy-modal-backdrop" role="dialog" aria-modal="true" onClick={closeModal}>
          <div className="anatomy-modal" onClick={(e) => e.stopPropagation()}>
            <div className="anatomy-modal-header">
              <div className="anatomy-modal-nav">
                <button
                  type="button"
                  className="anatomy-nav-btn"
                  onClick={() => stepCategory(-1)}
                  aria-label="หมวดก่อนหน้า"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="anatomy-modal-title">
                  {activeCategory.label} · คู่มือฝึก · {activeSection.label}
                </span>
                <button
                  type="button"
                  className="anatomy-nav-btn"
                  onClick={() => stepCategory(1)}
                  aria-label="หมวดถัดไป"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="anatomy-modal-actions">
                <div className="anatomy-view-toggle" role="group" aria-label="มุมมองด้านหน้าและด้านหลัง">
                  <button
                    type="button"
                    className={viewMode === 'front' ? 'is-active' : ''}
                    onClick={() => setViewMode('front')}
                  >
                    ด้านหน้า
                  </button>
                  <button
                    type="button"
                    className={viewMode === 'back' ? 'is-active' : ''}
                    onClick={() => setViewMode('back')}
                  >
                    ด้านหลัง
                  </button>
                </div>
                <button
                  type="button"
                  className="anatomy-close-btn"
                  onClick={closeModal}
                  aria-label="ปิดหน้าต่าง"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {activeCategory.sections.length > 1 && (
              <div className="anatomy-subtabs">
                {activeCategory.sections.map((sec, idx) => (
                  <button
                    key={sec.id}
                    type="button"
                    className={idx === activeSectionIndex ? 'is-active' : ''}
                    onClick={() => setActiveSectionIndex(idx)}
                  >
                    {sec.label}
                  </button>
                ))}
              </div>
            )}

            <div className="anatomy-layout">
              <AnatomyDiagram label={activeSection.label} viewMode={viewMode} zone={activeSection.zone} />

              <div className="anatomy-content">
                <section className="anatomy-box">
                  <h4>ท่าแนะนำ</h4>
                  <ul>
                    {activeSection.exercises.map((ex) => (
                      <li key={ex}>{ex}</li>
                    ))}
                  </ul>
                </section>

                <section className="anatomy-box">
                  <h4>จุดสำคัญ</h4>
                  <ul>
                    {activeSection.tips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

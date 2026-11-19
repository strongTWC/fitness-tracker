import { useEffect, useMemo, useRef, useState } from 'react'
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
import './gym-guide.css'
import './guide-anatomy.css'

const gymImage = (fileName: string) => `${import.meta.env.DEV ? '/' : import.meta.env.BASE_URL}gym-guide/${fileName}`

export interface GuideSection {
  id: string
  label: string
  zone: string
  imageSrc: string
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
        imageSrc: gymImage('chest.webp'),
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
        imageSrc: gymImage('chest.webp'),
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
        imageSrc: gymImage('shoulders.webp'),
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
        imageSrc: gymImage('shoulders.webp'),
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
        imageSrc: gymImage('back.webp'),
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
        imageSrc: gymImage('back.webp'),
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
        imageSrc: gymImage('biceps.webp'),
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
        imageSrc: gymImage('triceps.webp'),
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
        imageSrc: gymImage('legs-calves.webp'),
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
        imageSrc: gymImage('legs-calves.webp'),
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
        imageSrc: gymImage('abs.webp'),
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
        imageSrc: gymImage('cardio.webp'),
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
        imageSrc: gymImage('yoga.webp'),
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

export interface GuideProps {
  initialCategoryId?: string | null
  onOpenCategory?: (categoryId: string) => void
  onDetailClose?: () => void
}

export default function Guide({
  initialCategoryId = null,
  onOpenCategory,
  onDetailClose,
}: GuideProps) {
  const [query, setQuery] = useState('')
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(initialCategoryId)
  const [activeSectionIndex, setActiveSectionIndex] = useState(0)

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

  const exerciseCarouselItems = useMemo(
    () => categories.flatMap((category) =>
      category.sections.map((section, sectionIndex) => ({
        categoryId: category.id,
        categoryLabel: category.label,
        section,
        sectionIndex,
      })),
    ),
    [],
  )

  const activeCarouselIndex = exerciseCarouselItems.findIndex(
    (item) => item.section.id === activeSection?.id,
  )
  const carouselCardRefs = useRef<Array<HTMLButtonElement | null>>([])

  useEffect(() => {
    if (activeCarouselIndex >= 0) {
      carouselCardRefs.current[activeCarouselIndex]?.scrollIntoView({
        behavior: 'auto',
        block: 'nearest',
        inline: 'center',
      })
    }
  }, [activeCarouselIndex])

  function selectExerciseCard(index: number) {
    const item = exerciseCarouselItems[index]
    if (!item) return
    setActiveCategoryId(item.categoryId)
    setActiveSectionIndex(item.sectionIndex)
  }

  function moveExerciseCarousel(delta: number) {
    if (!exerciseCarouselItems.length) return
    const current = activeCarouselIndex >= 0 ? activeCarouselIndex : 0
    const next = (current + delta + exerciseCarouselItems.length) % exerciseCarouselItems.length
    selectExerciseCard(next)
  }

  function openCategoryById(categoryId: string) {
    setActiveCategoryId(categoryId)
    setActiveSectionIndex(0)
  }

  function returnToOverview() {
    setActiveCategoryId(null)
    setActiveSectionIndex(0)
    onDetailClose?.()
  }

  function handleCategoryClick(categoryId: string) {
    if (onOpenCategory) {
      onOpenCategory(categoryId)
      return
    }
    openCategoryById(categoryId)
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
      {!activeCategory && (
        <>
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
            <div className="gym-guide-grid" role="list" aria-label="เลือกกลุ่มกล้ามเนื้อ" tabIndex={0}>
              {muscleCategories.map((cat) => {
                const IconComponent = cat.icon
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="listitem"
                    className="gym-guide-card"
                    onClick={() => handleCategoryClick(cat.id)}
                  >
                    <span className="gym-guide-card-icon" aria-hidden="true">
                      <IconComponent size={28} strokeWidth={1.75} />
                    </span>
                    <span className="gym-guide-card-label">{cat.label}</span>
                  </button>
                )
              })}
            </div>
            <p className="gym-guide-carousel-hint">ปัดเพื่อดูหมวดหมู่เพิ่มเติม</p>
          </div>

          <div className="gym-guide-group">
            <h3 className="gym-guide-group-title">กิจกรรม &amp; คลาส</h3>
            <div className="gym-guide-pills" role="list" aria-label="กิจกรรมและคลาส" tabIndex={0}>
              {activityCategories.map((cat) => {
                const IconComponent = cat.icon
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="listitem"
                    className="gym-guide-pill"
                    onClick={() => handleCategoryClick(cat.id)}
                  >
                    <IconComponent size={16} strokeWidth={1.75} aria-hidden="true" />
                    <span>{cat.label}</span>
                  </button>
                )
              })}
            </div>
            <p className="gym-guide-carousel-hint">ปัดเพื่อดูกิจกรรมเพิ่มเติม</p>
          </div>
        </>
      )}

      {activeCategory && activeSection && (
        <section className="anatomy-detail-page" aria-label={`Gym Guide ${activeCategory.label}`}>
          <div className="anatomy-exercise-carousel">
            <div className="anatomy-exercise-carousel-heading">
              <h2>เลือกท่าฝึก</h2>
              <div className="anatomy-carousel-controls">
                <button
                  type="button"
                  className="anatomy-carousel-arrow"
                  onClick={() => moveExerciseCarousel(-1)}
                  aria-label="การ์ดก่อนหน้า"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  className="anatomy-carousel-arrow"
                  onClick={() => moveExerciseCarousel(1)}
                  aria-label="การ์ดถัดไป"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="anatomy-exercise-track" role="list" aria-label="เลือกท่าฝึก">
              {exerciseCarouselItems.map((item, index) => (
                <button
                  key={item.section.id}
                  ref={(element) => { carouselCardRefs.current[index] = element }}
                  type="button"
                  role="listitem"
                  className={`anatomy-exercise-card ${item.section.id === activeSection.id ? 'is-active' : ''}`}
                  onClick={() => selectExerciseCard(index)}
                  aria-pressed={item.section.id === activeSection.id}
                >
                  <span className="anatomy-exercise-card-image">
                    <img src={item.section.imageSrc} alt="" loading="lazy" decoding="async" />
                  </span>
                  <span className="anatomy-exercise-card-copy">
                    <small>{item.categoryLabel}</small>
                    <b>{item.section.label}</b>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="anatomy-selected-exercise" aria-live="polite">
            <div className="anatomy-selected-heading">
              <small>{activeCategory.label}</small>
              <h2>{activeSection.label}</h2>
            </div>

            <div className="anatomy-selected-image">
              <img
                key={activeSection.id}
                src={activeSection.imageSrc}
                alt={`ภาพตัวอย่างท่าฝึก: ${activeSection.label}`}
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="anatomy-content">
              <section className="anatomy-box">
                <h3>ท่าแนะนำ</h3>
                <ul>
                  {activeSection.exercises.map((exercise) => (
                    <li key={exercise}>{exercise}</li>
                  ))}
                </ul>
              </section>

              <section className="anatomy-box">
                <h3>จุดสำคัญ</h3>
                <ul>
                  {activeSection.tips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </section>
      )}

    </section>
  )
}

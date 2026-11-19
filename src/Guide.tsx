import { useMemo, useState } from 'react'
import { Activity, Bike, Dumbbell, HeartPulse, MoveRight, Search, ShieldCheck, X, Zap } from 'lucide-react'
import './guide-anatomy.css'

const categories = [
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
        tips: ['ปรับม้านั่งเอียงประมาณ 15–30° และเก็บสะบัก', 'ลดน้ำหนักลงอย่างควบคุม ไม่เด้งดัมเบลที่อก', 'หยุดเมื่อรู้สึกเจ็บแปลบที่หัวไหล่'],
      },
      {
        id: 'lower-chest',
        label: 'อกล่าง (Lower Chest)',
        zone: 'lowerChest',
        exercises: ['Decline Push-up — 3 × 8–15', 'Chest Dip — 3 × 6–10'],
        tips: ['เอนตัวไปข้างหน้าเล็กน้อยระหว่างดัน', 'รักษาหัวไหล่ให้ต่ำและไม่ยกไหล่เข้าหาหู', 'ใช้ระยะการเคลื่อนไหวที่ไม่ทำให้ไหล่เจ็บ'],
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
        label: 'ไหล่บน (Front/Side Delts)',
        zone: 'frontDelts',
        exercises: ['Dumbbell Shoulder Press — 3 × 8–12', 'Lateral Raise — 3 × 12–15'],
        tips: ['เกร็งลำตัวและไม่แอ่นหลัง', 'ยกแขนในระนาบเฉียงไปด้านหน้าเล็กน้อย', 'เลือกน้ำหนักที่ไม่ต้องเหวี่ยงตัว'],
      },
      {
        id: 'rear-delts',
        label: 'ไหล่ล่าง (Rear Delts)',
        zone: 'rearDelts',
        exercises: ['Face Pull — 3 × 12–15', 'Reverse Fly — 3 × 10–15'],
        tips: ['เริ่มจากสะบักและกางแขนอย่างควบคุม', 'รักษาคอผ่อนคลาย ไม่ยักไหล่', 'ใช้แรงต้านเบาเพื่อรักษาท่าทาง'],
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
        tips: ['ดึงศอกลงหรือไปด้านหลัง ไม่กระชากด้วยมือ', 'รักษากระดูกสันหลังเป็นกลาง', 'คืนแขนช้า ๆ เพื่อควบคุมแรงต้าน'],
      },
      {
        id: 'lower-back',
        label: 'หลังล่าง (Lower Back)',
        zone: 'lowerBack',
        exercises: ['Bird Dog — 3 × 8/ข้าง', 'Hip Hinge Drill — 3 × 10'],
        tips: ['เคลื่อนไหวจากสะโพกและคงหลังเป็นกลาง', 'เริ่มโดยไม่ใช้น้ำหนักจนควบคุมท่าได้', 'หยุดหากมีอาการปวดร้าวหรือชา'],
      },
    ],
  },
  {
    id: 'arms',
    label: 'แขน',
    group: 'muscle',
    icon: Dumbbell,
    sections: [
      {
        id: 'biceps',
        label: 'แขนหน้า (Biceps)',
        zone: 'biceps',
        exercises: ['Dumbbell Curl — 3 × 10–12', 'Hammer Curl — 3 × 10–12'],
        tips: ['ตรึงข้อศอกไว้ใกล้ลำตัว', 'ไม่โยกลำตัวช่วยยก', 'ลดน้ำหนักช้า ๆ จนเกือบสุดช่วงที่สบาย'],
      },
      {
        id: 'triceps',
        label: 'แขนหลัง (Triceps)',
        zone: 'triceps',
        exercises: ['Cable Pressdown — 3 × 10–15', 'Overhead Extension — 3 × 10–12'],
        tips: ['ให้ข้อศอกอยู่กับที่ตลอดการเคลื่อนไหว', 'คุมข้อมือให้ตรงและไม่ล็อกข้อศอกแรง', 'เลือกแรงต้านที่ไม่ดึงไหล่หรือหลัง'],
      },
    ],
  },
  {
    id: 'legs',
    label: 'ขา',
    group: 'muscle',
    icon: Activity,
    sections: [
      {
        id: 'quads-hamstrings',
        label: 'ต้นขา (Quads/Hamstrings)',
        zone: 'thighs',
        exercises: ['Goblet Squat — 3 × 8–12', 'Romanian Deadlift — 3 × 8–10'],
        tips: ['ลงน้ำหนักเต็มฝ่าเท้าและให้เข่าไปตามแนวปลายเท้า', 'ดันสะโพกไปด้านหลังในท่า hip hinge', 'เริ่มน้ำหนักเบาและรักษาหลังเป็นกลาง'],
      },
      {
        id: 'calves',
        label: 'น่อง (Calves)',
        zone: 'calves',
        exercises: ['Standing Calf Raise — 3 × 12–15', 'Seated Calf Raise — 3 × 12–15'],
        tips: ['เคลื่อนไหวเต็มช่วงโดยไม่เด้งตัว', 'หยุดค้างสั้น ๆ ที่ด้านบนและล่าง', 'จับที่พยุงเพื่อรักษาสมดุลเมื่อจำเป็น'],
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
        label: 'กล้ามหน้าท้อง (Core & Abs)',
        zone: 'abs',
        exercises: ['Dead Bug — 3 × 8/ข้าง', 'Plank — 3 × 20–45 วินาที', 'Pallof Press — 3 × 10/ข้าง'],
        tips: ['หายใจออกพร้อมเกร็งหน้าท้องเบา ๆ', 'รักษาหลังส่วนล่างให้อยู่ในตำแหน่งสบาย', 'หยุดเซตเมื่อเริ่มเสียการควบคุม'],
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
        id: 'outdoor-run',
        label: 'วิ่งกลางแจ้ง (Outdoor Run)',
        zone: 'fullBody',
        exercises: ['Easy Run — 20–30 นาที', 'เดินสลับวิ่ง — 20 นาที'],
        tips: ['เริ่มด้วยเดินวอร์มอัป 5 นาที', 'เพิ่มระยะหรือความเร็วทีละน้อย', 'เลือกเส้นทางปลอดภัยและดื่มน้ำให้พอ'],
      },
      {
        id: 'treadmill-run',
        label: 'วิ่งบนเทรด (Treadmill Run)',
        zone: 'fullBody',
        exercises: ['Treadmill Easy Run — 20 นาที', 'เดินชัน — 15–25 นาที'],
        tips: ['เริ่มสายพานช้าและก้าวขึ้นอย่างระมัดระวัง', 'มองไปด้านหน้า ไม่จับราวตลอดการวิ่ง', 'ค่อยลดความเร็วเพื่อคูลดาวน์'],
      },
    ],
  },
  {
    id: 'class',
    label: 'Class',
    group: 'activity',
    icon: HeartPulse,
    sections: [
      {
        id: 'yoga',
        label: 'โยคะ (Yoga)',
        zone: 'fullBody',
        exercises: ['Sun Salutation — 3 รอบ', 'ท่าภูเขาและท่านักรบ — 3 × 30 วินาที'],
        tips: ['เคลื่อนไหวตามลมหายใจ ไม่ฝืนช่วงการยืด', 'ใช้อุปกรณ์ช่วยพยุงได้ตามต้องการ', 'แจ้งผู้สอนหากมีอาการบาดเจ็บหรือข้อจำกัด'],
      },
    ],
  },
]

const muscleShapes = {
  upperChest: [<path key="uc1" d="M116 120 Q150 108 184 120 L178 139 Q150 132 122 139Z" />, <path key="uc2" d="M116 120 Q104 119 99 133 L115 143 L124 137Z" />, <path key="uc3" d="M184 120 Q196 119 201 133 L185 143 L176 137Z" />],
  lowerChest: [<path key="lc1" d="M119 140 Q150 133 181 140 L176 158 Q150 164 124 158Z" />],
  frontDelts: [<ellipse key="fd1" cx="106" cy="121" rx="10" ry="13" />, <ellipse key="fd2" cx="194" cy="121" rx="10" ry="13" />],
  rearDelts: [<ellipse key="rd1" cx="106" cy="121" rx="10" ry="13" />, <ellipse key="rd2" cx="194" cy="121" rx="10" ry="13" />],
  upperBack: [<path key="ub1" d="M126 119 Q150 111 174 119 L181 153 Q168 166 150 161 Q132 166 119 153Z" />],
  lowerBack: [<path key="lb1" d="M132 160 Q150 166 168 160 L164 187 Q150 195 136 187Z" />],
  biceps: [<path key="bi1" d="M96 133 Q105 128 111 140 L105 165 Q98 166 94 156Z" />, <path key="bi2" d="M204 133 Q195 128 189 140 L195 165 Q202 166 206 156Z" />],
  triceps: [<path key="tr1" d="M94 134 Q88 143 92 159 L98 166 L104 144Z" />, <path key="tr2" d="M206 134 Q212 143 208 159 L202 166 L196 144Z" />],
  thighs: [<path key="th1" d="M126 198 Q139 193 148 200 L143 251 L128 250 L119 213Z" />, <path key="th2" d="M152 200 Q161 193 174 198 L181 213 L172 250 L157 251Z" />, <path key="th3" d="M127 199 L145 201 L139 251 L128 250Z" />, <path key="th4" d="M155 201 L173 199 L172 250 L161 251Z" />],
  calves: [<path key="ca1" d="M128 255 Q136 251 143 256 L140 306 Q135 315 128 306Z" />, <path key="ca2" d="M157 256 Q164 251 172 255 L172 306 Q165 315 160 306Z" />],
  abs: [<path key="ab1" d="M133 143 Q150 148 167 143 L164 190 Q150 196 136 190Z" />],
  fullBody: [<path key="fb1" d="M150 76 C128 76 111 83 105 99 L91 137 L99 168 L110 164 L116 137 L125 124 L127 184 L119 215 L128 252 L126 309 L140 310 L150 258 L160 310 L174 309 L172 252 L181 215 L173 184 L175 124 L184 137 L190 164 L201 168 L209 137 L195 99 C189 83 172 76 150 76Z" />],
}

function AnatomyDiagram({ zone, label }) {
  const backZones = ['rearDelts', 'upperBack', 'lowerBack', 'triceps', 'thighs', 'calves', 'fullBody']
  const back = backZones.includes(zone)
  return (
    <svg className="anatomy-svg" viewBox="0 0 300 340" role="img" aria-label={`แผนภาพกล้ามเนื้อ: ${label}`}>
      <g className="anatomy-body">
        <circle cx="150" cy="45" r="24" />
        <path d="M132 71 Q150 65 168 71 L188 82 Q196 88 199 101 L214 139 Q217 147 211 151 Q205 154 201 147 L185 116 L180 129 L181 184 Q181 196 176 204 L184 220 L178 253 L176 310 Q175 320 166 320 Q158 320 158 311 L151 264 L144 311 Q143 320 134 320 Q125 320 124 310 L122 253 L116 220 L124 204 Q119 195 119 184 L120 129 L115 116 L99 147 Q95 154 89 151 Q83 147 86 139 L101 101 Q104 88 112 82Z" />
      </g>
      <g className={`anatomy-muscle ${back ? 'back-view' : 'front-view'}`}>{muscleShapes[zone]}</g>
      <text x="150" y="337" textAnchor="middle">{back ? 'ด้านหลัง' : 'ด้านหน้า'} · {label}</text>
    </svg>
  )
}

function matchesSearch(category, query) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  if (category.label.toLowerCase().includes(normalized) || category.id.toLowerCase().includes(normalized)) {
    return true
  }
  return category.sections.some(
    (sec) =>
      sec.label.toLowerCase().includes(normalized) ||
      sec.exercises.some((ex) => ex.toLowerCase().includes(normalized)) ||
      sec.tips.some((tip) => tip.toLowerCase().includes(normalized)),
  )
}

export default function Guide() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSectionId, setSelectedSectionId] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const section = selectedCategory?.sections.find((item) => item.id === selectedSectionId) || selectedCategory?.sections[0]

  const filteredCategories = useMemo(
    () => categories.filter((category) => matchesSearch(category, searchQuery)),
    [searchQuery],
  )
  const muscleCategories = useMemo(
    () => filteredCategories.filter((category) => category.group === 'muscle'),
    [filteredCategories],
  )
  const activityCategories = useMemo(
    () => filteredCategories.filter((category) => category.group === 'activity'),
    [filteredCategories],
  )

  function openCategory(category) {
    setSelectedCategory(category)
    setSelectedSectionId(category.sections[0].id)
  }

  function renderCategoryTiles(items) {
    return (
      <div className="fit-guide-grid">
        {items.map((category) => {
          const Icon = category.icon
          return (
            <button
              key={category.id}
              type="button"
              className="fit-guide-tile"
              onClick={() => openCategory(category)}
              aria-label={`ดูคู่มือท่า${category.label}`}
            >
              <Icon size={20} />
              <b>{category.label}</b>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <section className={`fit-guide ${expanded ? 'expanded' : ''}`} id="gym-guide" aria-labelledby="fit-guide-title">
      <header className="fit-guide-heading">
        <div>
          <div className="fit-eyebrow"><span /> GYM GUIDE</div>
          <h2 id="fit-guide-title">Gym Guide</h2>
        </div>
        <button
          className="fit-guide-more"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
        >
          {expanded ? 'Less' : 'More'}
          <span>{expanded ? 'ซ่อน' : 'ดูทั้งหมด'}</span>
        </button>
      </header>

      <div className="fit-guide-search">
        <Search size={16} aria-hidden="true" />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="ค้นหากล้ามเนื้อ ท่าฝึก หรือคลาส..."
          aria-label="ค้นหากล้ามเนื้อ ท่าฝึก หรือคลาส"
        />
        {searchQuery && (
          <button
            type="button"
            className="fit-guide-search-clear"
            onClick={() => setSearchQuery('')}
            aria-label="ล้างคำค้นหา"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="fit-guide-scroller">
        {filteredCategories.length === 0 ? (
          <p className="fit-guide-empty">ไม่พบหมวดหมู่หรือท่าฝึกที่ตรงกับ "{searchQuery}"</p>
        ) : (
          <div className="fit-guide-groups">
            {muscleCategories.length > 0 && (
              <div className="fit-guide-group">
                <h3 className="fit-guide-group-title">กลุ่มกล้ามเนื้อหลัก</h3>
                {renderCategoryTiles(muscleCategories)}
              </div>
            )}
            {activityCategories.length > 0 && (
              <div className="fit-guide-group">
                <h3 className="fit-guide-group-title">กิจกรรม & คลาส</h3>
                {renderCategoryTiles(activityCategories)}
              </div>
            )}
          </div>
        )}
      </div>

      {section && selectedCategory && (
        <div className="

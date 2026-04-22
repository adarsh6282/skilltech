import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Settings2, Cpu, Flame, Building2, Sparkles, Shield,
  Clock, Award, BarChart3, ChevronDown, Phone, Mail,
  MapPin, ArrowRight, Star, Menu, X, Upload, CheckCircle2
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// FRAME SETUP
// ─────────────────────────────────────────────────────────────────────────────
const _raw = import.meta.glob(
  './assets/*.{jpg,jpeg,png,webp}',
  { eager: true }
)
const FRAME_URLS = Object.keys(_raw).sort().map(k => _raw[k].default)
const TOTAL_FRAMES = FRAME_URLS.length
const HERO_HEIGHT = Math.max(TOTAL_FRAMES * 11, 3000)
const KEYFRAME_STEP = 10

// ─────────────────────────────────────────────────────────────────────────────
// THEME — Sandal & Aged Leather
// ─────────────────────────────────────────────────────────────────────────────
// Primary: warm parchment #f5ede0
// Dark base: deep espresso #1a1108
// Mid: weathered cognac #8b5e3c
// Accent: burnished sienna #c8733a
// Stitching gold: #d4a84b
// Worn leather: #4a2f1a

// ─────────────────────────────────────────────────────────────────────────────
// TEXT PHASES — scroll progress 0 → 1
// Text comes from different directions each phase, smaller size
// ─────────────────────────────────────────────────────────────────────────────
const PHASES = [
  {
    from: 0, to: 0.26,
    eyebrow: 'On-Site Aluminum Fabrication Specialists',
    lines: ['We Come', 'To Your', 'Doorstep.'],
    accent: 1,
    sub: 'Professional aluminum works installed at your home or building.\nWindows, doors, railings, partitions — fitted to perfection.',
    cta: true,
    textAlign: 'left',
    enterFrom: 'left',
    position: 'bottom-left',
  },
  {
    from: 0.26, to: 0.52,
    eyebrow: 'Windows, Doors & Sliding Systems',
    lines: ['Custom Fit.', 'On-Site.', 'On Time.'],
    accent: 2,
    sub: 'Every frame measured, fabricated, and installed at your location.\nNo middlemen. No delays. Just flawless aluminium work.',
    cta: false,
    textAlign: 'right',
    enterFrom: 'right',
    position: 'top-right',
  },
  {
    from: 0.52, to: 0.78,
    eyebrow: 'Residential & Commercial Buildings',
    lines: ['Homes &', 'Buildings', 'We Service.'],
    accent: 0,
    sub: 'From single-home upgrades to full commercial fit-outs.\nTrusted by homeowners and contractors across the region.',
    cta: false,
    textAlign: 'center',
    enterFrom: 'bottom',
    position: 'center',
  },
  {
    from: 0.78, to: 1.0,
    eyebrow: '15+ Years · 3,200+ Installations Completed',
    lines: ['Book Your', 'Free Site', 'Visit Today.'],
    accent: 2,
    sub: 'We visit, measure, and quote — all at your property.\nGet a free consultation within one business day.',
    cta: true,
    textAlign: 'left',
    enterFrom: 'top',
    position: 'bottom-left',
  },
]

const NAV = ['Services', 'About', 'Projects', 'Contact']

const SPECIALTIES = [
  { Icon: Settings2, title: 'Aluminium Windows', desc: 'Sliding, casement, and fixed aluminium window systems installed directly at your home or building.', accent: true },
  { Icon: Cpu, title: 'Doors & Entrances', desc: 'Custom aluminium doors including swing, sliding, and folding types fitted on-site to exact measurements.', accent: false },
  { Icon: Flame, title: 'Railings & Handrails', desc: 'Durable aluminium railings for staircases, balconies, and terraces — welded and installed at your location.', accent: true },
  { Icon: Building2, title: 'Partitions & Cladding', desc: 'Interior aluminium partitions and exterior cladding for residential and commercial buildings.', accent: false },
  { Icon: Sparkles, title: 'Curtain Walls & Facades', desc: 'Full aluminium curtain wall systems for commercial buildings, designed and installed by our field team.', accent: true },
  { Icon: Shield, title: 'Grills & Security Screens', desc: 'Custom aluminium grills, safety screens, and louvers fabricated and fitted on-site for maximum security.', accent: false },
]

const STATS = [
  { v: '15+', l: 'Years of Service' },
  { v: '3,200+', l: 'Installations Done' },
  { v: '100%', l: 'On-Site Work' },
  { v: '98%', l: 'Client Satisfaction' },
]

const WHY = [
  { Icon: Clock, title: 'We Come to You', desc: 'Our team visits your site, takes measurements, and completes the installation — you never leave home.' },
  { Icon: Award, title: 'Skilled Site Teams', desc: 'Experienced fabricators and installers who work directly at your property with care and precision.' },
  { Icon: BarChart3, title: 'All Aluminium Types', desc: 'Powder-coated, anodized, and mill-finish aluminium profiles for every residential or commercial need.' },
]

const GALLERY = [
  { id: 1, label: 'Residential Curtain Wall', tag: 'Facade', tall: true },
  { id: 2, label: 'Aluminium Window Fitting', tag: 'Windows', tall: false },
  { id: 3, label: 'Balcony Railing Install', tag: 'Railings', tall: false },
  { id: 4, label: 'Powder-Coated Door Frame', tag: 'Doors', tall: true },
  { id: 5, label: 'Office Glass Partition', tag: 'Partitions', tall: false },
  { id: 6, label: 'Commercial Storefront', tag: 'Facade', tall: false },
]
const SEEDS = ['forge', 'metal', 'steel', 'aluminum', 'factory', 'frame']

const TESTIMONIALS = [
  { name: 'Rajesh Nair', role: 'Homeowner, Thrissur', stars: 5, text: 'SkillTech came to my house, measured everything, and installed all the aluminium windows in two days. Neat work with no mess left behind.' },
  { name: 'Anitha Mohan', role: 'Interior Designer, Kochi', stars: 5, text: 'I recommend SkillTech to all my clients. Their on-site team is professional, prompt, and the finished aluminium partitions always look stunning.' },
  { name: 'Suresh Babu', role: 'Site Engineer, BuildRight Contractors', stars: 5, text: 'We used SkillTech for a full commercial fit-out. They handled curtain walls, doors, and railings on-site. Zero rework and delivered on schedule.' },
]

// ─────────────────────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────────────────────
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi)

function phaseOpacity(phase, prog) {
  const FADE = 0.055
  if (prog < phase.from || prog > phase.to) return 0
  return Math.min(
    clamp((prog - phase.from) / FADE, 0, 1),
    clamp((phase.to - prog) / FADE, 0, 1)
  )
}

function getEnterTransform(enterFrom, opacity) {
  const dist = (1 - opacity) * 36
  if (opacity > 0.98) return 'translate(0,0)'
  switch (enterFrom) {
    case 'left': return `translate(-${dist}px, 0)`
    case 'right': return `translate(${dist}px, 0)`
    case 'bottom': return `translate(0, ${dist}px)`
    case 'top': return `translate(0, -${dist}px)`
    default: return `translate(0, ${dist}px)`
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE TEXT CARD — positioned at different corners based on phase
// ─────────────────────────────────────────────────────────────────────────────
function PhaseText({ phase, prog }) {
  const opacity = phaseOpacity(phase, prog)
  const transform = getEnterTransform(phase.enterFrom, opacity)

  const posStyles = {
    'bottom-left': {
      position: 'absolute',
      bottom: '14%',
      left: 0,
      right: 0,
      paddingLeft: '5%',
      paddingRight: '55%',
      textAlign: 'left',
    },
    'top-right': {
      position: 'absolute',
      top: '18%',
      left: 0,
      right: 0,
      paddingLeft: '45%',
      paddingRight: '5%',
      textAlign: 'right',
    },
    'center': {
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      transform: transform + ' translateY(-50%)',
      paddingLeft: '10%',
      paddingRight: '10%',
      textAlign: 'center',
    },
  }

  const pos = posStyles[phase.position] || posStyles['bottom-left']
  const isCentered = phase.position === 'center'

  return (
    <div
      style={{
        ...pos,
        opacity,
        transform: isCentered ? pos.transform : transform,
        pointerEvents: opacity > 0.4 ? 'auto' : 'none',
        willChange: 'opacity, transform',
        transition: 'none',
      }}
    >
      {/* Stitched border accent — thin decorative line */}
      <div style={{
        display: 'inline-block',
        borderLeft: phase.textAlign !== 'right' && !isCentered ? '2px solid rgba(212,168,75,0.6)' : 'none',
        borderRight: phase.textAlign === 'right' ? '2px solid rgba(212,168,75,0.6)' : 'none',
        paddingLeft: phase.textAlign !== 'right' && !isCentered ? '16px' : 0,
        paddingRight: phase.textAlign === 'right' ? '16px' : 0,
      }}>
        {/* Eyebrow */}
        <span style={{
          display: 'inline-block',
          color: '#d4a84b',
          fontSize: '9px',
          fontWeight: 700,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          fontFamily: "'Courier New', monospace",
          marginBottom: '10px',
          background: 'rgba(26,17,8,0.55)',
          padding: '4px 10px',
          border: '1px solid rgba(212,168,75,0.25)',
        }}>
          {phase.eyebrow}
        </span>

        {/* Headline — smaller so frames are visible */}
        <h1 style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontWeight: 900,
          fontStyle: 'italic',
          textTransform: 'uppercase',
          lineHeight: 0.9,
          color: '#f5ede0',
          fontSize: 'clamp(2rem,5.5vw,4.2rem)',
          letterSpacing: '-0.01em',
          marginBottom: '10px',
          textShadow: '0 2px 24px rgba(26,17,8,0.8)',
          display: 'block',
        }}>
          {phase.lines.map((ln, i) => (
            <span key={i} style={{ display: 'block' }}>
              {i === phase.accent
                ? <span style={{ color: '#c8733a', fontStyle: 'italic' }}>{ln}</span>
                : ln}
            </span>
          ))}
        </h1>

        {/* Sub */}
        <p style={{
          color: 'rgba(245,237,224,0.72)',
          marginBottom: '14px',
          maxWidth: isCentered ? '420px' : '340px',
          margin: isCentered ? '0 auto 14px' : '0 0 14px',
          lineHeight: 1.6,
          whiteSpace: 'pre-line',
          fontSize: '11px',
          fontFamily: "'Courier New', monospace",
          letterSpacing: '0.04em',
          textShadow: '0 1px 12px rgba(26,17,8,0.9)',
        }}>
          {phase.sub}
        </p>

        {/* CTAs */}
        {phase.cta && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: isCentered ? 'center' : 'flex-start' }}>
            <a href="#contact" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 22px',
              background: '#c8733a',
              color: '#1a1108',
              fontWeight: 800,
              fontSize: '9px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontFamily: "'Courier New', monospace",
              border: '1px solid #d4a84b',
              textDecoration: 'none',
            }}>
              <Phone size={11} /> Book a Free Site Visit
            </a>
            <a href="#projects" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 22px',
              background: 'rgba(26,17,8,0.5)',
              color: '#f5ede0',
              fontWeight: 700,
              fontSize: '9px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontFamily: "'Courier New', monospace",
              border: '1px solid rgba(245,237,224,0.25)',
              textDecoration: 'none',
            }}>
              <ArrowRight size={11} /> View Our Work
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LOADING SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function LoadingScreen({ progress }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 30,
      background: '#1a1108',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px',
    }}>
      {/* Grain texture overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.08\'/%3E%3C/svg%3E")',
        opacity: 0.4, pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', position: 'relative' }}>
        {/* Stitched diamond logo */}
        <svg width="32" height="32" viewBox="0 0 32 32">
          <rect x="4" y="4" width="24" height="24" rx="0" fill="none" stroke="#d4a84b" strokeWidth="1.5" transform="rotate(45 16 16)" />
          <rect x="10" y="10" width="12" height="12" rx="0" fill="#c8733a" transform="rotate(45 16 16)" />
        </svg>
        <span style={{
          fontFamily: "'Georgia', serif",
          fontStyle: 'italic',
          fontWeight: 900,
          fontSize: '22px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#f5ede0',
        }}>
          SKILL<span style={{ color: '#c8733a' }}>TECH</span>
        </span>
      </div>

      {/* Stitched progress track */}
      <div style={{
        width: '200px',
        position: 'relative',
        border: '1px solid rgba(212,168,75,0.2)',
        padding: '3px',
      }}>
        <div style={{
          height: '3px',
          background: 'rgba(255,255,255,0.05)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, left: 0,
            background: 'linear-gradient(90deg, #8b5e3c, #c8733a, #d4a84b)',
            width: `${Math.round(progress * 100)}%`,
            transition: 'width 0.12s linear',
          }} />
        </div>
      </div>

      <span style={{
        fontFamily: "'Courier New', monospace",
        fontSize: '9px',
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        color: '#8b5e3c',
      }}>
        Loading {Math.round(progress * 100)}%
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DECORATIVE STITCHING SVG — used as section dividers
// ─────────────────────────────────────────────────────────────────────────────
function StitchDivider() {
  return (
    <div style={{ width: '100%', overflow: 'hidden', lineHeight: 0 }}>
      <svg viewBox="0 0 1440 12" preserveAspectRatio="none" style={{ width: '100%', height: '12px' }}>
        {Array.from({ length: 72 }).map((_, i) => (
          <rect key={i} x={i * 20 + 2} y="4" width="16" height="4" rx="2"
            fill="none" stroke="rgba(212,168,75,0.25)" strokeWidth="1" />
        ))}
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [heroProgress, setHeroProgress] = useState(0)
  const [loadProgress, setLoadProgress] = useState(0)
  const [firstReady, setFirstReady] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', details: '', file: null })
  const [sent, setSent] = useState(false)

  const scrollSecRef = useRef(null)
  const canvasRef = useRef(null)
  const imagesRef = useRef([])
  const loadedRef = useRef(new Set())
  const drawnIdxRef = useRef(-1)
  const targetIdxRef = useRef(0)
  const rafIdRef = useRef(null)

  const drawIndex = useCallback((idx) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const imgs = imagesRef.current
    let img = imgs[idx] ?? null
    if (!img) {
      for (let d = 1; d < TOTAL_FRAMES; d++) {
        const lo = idx - d, hi = idx + d
        if (lo >= 0 && imgs[lo]) { img = imgs[lo]; break }
        if (hi < TOTAL_FRAMES && imgs[hi]) { img = imgs[hi]; break }
      }
    }
    if (!img) return
    const w = canvas.offsetWidth, h = canvas.offsetHeight
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h
    }
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
    drawnIdxRef.current = idx
  }, [])

  const rafLoop = useCallback(() => {
    const target = targetIdxRef.current
    const current = drawnIdxRef.current < 0 ? target : drawnIdxRef.current
    const next = current + (target - current) * 0.20
    const idx = clamp(Math.round(next), 0, TOTAL_FRAMES - 1)
    if (idx !== drawnIdxRef.current) drawIndex(idx)
    rafIdRef.current = requestAnimationFrame(rafLoop)
  }, [drawIndex])

  useEffect(() => {
    if (TOTAL_FRAMES === 0) { setFirstReady(true); return }
    imagesRef.current = new Array(TOTAL_FRAMES).fill(null)
    const loaded = loadedRef.current
    let totalDone = 0
    function loadAt(i, cb) {
      if (imagesRef.current[i] || loaded.has(i)) { cb?.(); return }
      loaded.add(i)
      const img = new Image()
      img.onload = () => {
        imagesRef.current[i] = img; totalDone++
        setLoadProgress(totalDone / TOTAL_FRAMES); cb?.()
      }
      img.onerror = () => { totalDone++; setLoadProgress(totalDone / TOTAL_FRAMES); cb?.() }
      img.src = FRAME_URLS[i]
    }
    loadAt(0, () => {
      setFirstReady(true); drawIndex(0)
      for (let i = KEYFRAME_STEP; i < TOTAL_FRAMES; i += KEYFRAME_STEP) loadAt(i)
      setTimeout(() => { for (let i = 1; i < TOTAL_FRAMES; i++) loadAt(i) }, 350)
    })
  }, [drawIndex])

  useEffect(() => {
    if (!firstReady) return
    rafIdRef.current = requestAnimationFrame(rafLoop)
    return () => cancelAnimationFrame(rafIdRef.current)
  }, [firstReady, rafLoop])

  const onScroll = useCallback(() => {
    setScrolled(window.scrollY > 50)
    const sec = scrollSecRef.current
    if (!sec) return
    const scrollable = sec.offsetHeight - window.innerHeight
    if (scrollable <= 0) return
    const prog = clamp((window.scrollY - sec.offsetTop) / scrollable, 0, 1)
    targetIdxRef.current = clamp(Math.floor(prog * (TOTAL_FRAMES - 1)), 0, TOTAL_FRAMES - 1)
    setHeroProgress(prog)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) { canvasRef.current.width = 0; canvasRef.current.height = 0 }
      drawIndex(drawnIdxRef.current < 0 ? 0 : drawnIdxRef.current)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [drawIndex])

  const handleForm = e => {
    const { name, value, files } = e.target
    setForm(p => ({ ...p, [name]: files ? files[0] : value }))
  }
  const handleSubmit = e => { e.preventDefault(); setSent(true) }

  // ─── CSS injected once ────────────────────────────────────────────────────
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Mono:wght@400;500&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { background: #1a1108; }
      :root {
        --parchment: #f5ede0;
        --espresso: #1a1108;
        --cognac: #8b5e3c;
        --sienna: #c8733a;
        --gold: #d4a84b;
        --leather: #4a2f1a;
        --mid: #2d1e0f;
        --muted: rgba(245,237,224,0.45);
      }
      .leather-card {
        background: #231508;
        border: 1px solid rgba(212,168,75,0.15);
        position: relative;
        transition: border-color 0.3s, transform 0.3s;
      }
      .leather-card::before {
        content: '';
        position: absolute;
        inset: 4px;
        border: 1px dashed rgba(212,168,75,0.08);
        pointer-events: none;
      }
      .leather-card:hover {
        border-color: rgba(200,115,58,0.4);
        transform: translateY(-2px);
      }
      .stitch-btn {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 12px 28px;
        background: #c8733a;
        color: #1a1108;
        font-weight: 700;
        font-size: 10px;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        font-family: 'DM Mono', monospace;
        border: 2px solid #d4a84b;
        cursor: pointer;
        text-decoration: none;
        transition: background 0.2s, box-shadow 0.2s;
        outline: none;
      }
      .stitch-btn:hover {
        background: #d4a84b;
        box-shadow: 0 0 28px rgba(200,115,58,0.35);
      }
      .stitch-btn-ghost {
        background: transparent;
        color: var(--parchment);
        border: 1px solid rgba(245,237,224,0.3);
        font-family: 'DM Mono', monospace;
      }
      .stitch-btn-ghost:hover {
        background: rgba(245,237,224,0.06);
        box-shadow: none;
      }
      .section-eyebrow {
        display: inline-block;
        color: #d4a84b;
        font-family: 'DM Mono', monospace;
        font-size: 9px;
        font-weight: 500;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        margin-bottom: 12px;
        padding: 4px 0;
        border-bottom: 1px solid rgba(212,168,75,0.3);
      }
      .section-heading {
        font-family: 'Playfair Display', serif;
        font-style: italic;
        font-weight: 900;
        color: #f5ede0;
        line-height: 0.95;
        margin-bottom: 12px;
      }
      .input-leather {
        width: 100%;
        background: rgba(26,17,8,0.8);
        border: 1px solid rgba(212,168,75,0.2);
        padding: 12px 16px;
        color: #f5ede0;
        font-family: 'DM Mono', monospace;
        font-size: 12px;
        outline: none;
        transition: border-color 0.2s;
      }
      .input-leather::placeholder { color: rgba(245,237,224,0.2); }
      .input-leather:focus { border-color: rgba(200,115,58,0.6); }
      .grain-overlay {
        position: absolute; inset: 0; pointer-events: none;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
        opacity: 0.035;
        mix-blend-mode: overlay;
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#1a1108', color: '#f5ede0', fontFamily: "'DM Mono', monospace" }}>

      {/* ══ HEADER ═══════════════════════════════════════════════════════════ */}
      <header style={{
        position: 'fixed', insetInline: 0, top: 0, zIndex: 50,
        transition: 'background 0.3s, border-color 0.3s',
        background: scrolled ? 'rgba(26,17,8,0.94)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(212,168,75,0.15)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <svg width="28" height="28" viewBox="0 0 32 32">
              <rect x="4" y="4" width="24" height="24" fill="none" stroke="#d4a84b" strokeWidth="1.5" transform="rotate(45 16 16)" />
              <rect x="10" y="10" width="12" height="12" fill="#c8733a" transform="rotate(45 16 16)" />
            </svg>
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 900, fontSize: '20px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#f5ede0' }}>
              SKILL<span style={{ color: '#c8733a' }}>TECH</span>
            </span>
          </a>

          {/* Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '36px' }} className="hidden-mobile">
            {NAV.map(n => (
              <a key={n} href={`#${n.toLowerCase()}`} style={{
                fontSize: '9px', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(245,237,224,0.55)', textDecoration: 'none', transition: 'color 0.2s',
                fontFamily: "'DM Mono', monospace",
              }}
                onMouseEnter={e => e.target.style.color = '#d4a84b'}
                onMouseLeave={e => e.target.style.color = 'rgba(245,237,224,0.55)'}>
                {n}
              </a>
            ))}
            <a href="#contact" className="stitch-btn" style={{ padding: '8px 20px', fontSize: '9px' }}>Book Site Visit</a>
          </nav>

          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', color: '#f5ede0', cursor: 'pointer' }}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div style={{ background: 'rgba(26,17,8,0.97)', borderTop: '1px solid rgba(212,168,75,0.12)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {NAV.map(n => (
              <a key={n} href={`#${n.toLowerCase()}`} onClick={() => setMenuOpen(false)} style={{
                padding: '12px 0', borderBottom: '1px solid rgba(212,168,75,0.08)',
                fontSize: '11px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'rgba(245,237,224,0.7)', textDecoration: 'none', fontFamily: "'DM Mono', monospace",
              }}>{n}</a>
            ))}
            <a href="#contact" onClick={() => setMenuOpen(false)} className="stitch-btn" style={{ marginTop: '12px', justifyContent: 'center' }}>Book Site Visit</a>
          </div>
        )}
      </header>

      {/* ══ HERO ═════════════════════════════════════════════════════════════ */}
      <div ref={scrollSecRef} id="top" style={{ height: `${HERO_HEIGHT}px`, position: 'relative' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden' }}>

          {/* Loading overlay */}
          {!firstReady && <LoadingScreen progress={loadProgress} />}

          {/* Canvas */}
          <canvas ref={canvasRef} style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            opacity: firstReady ? 1 : 0,
            transition: 'opacity 0.7s ease',
          }} />

          {/* Warm leather gradient overlays — sepia/brown tint over image */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(135deg, rgba(26,17,8,0.82) 0%, rgba(74,47,26,0.35) 45%, rgba(26,17,8,0.15) 100%)',
          }} />
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(to top, rgba(26,17,8,0.75) 0%, transparent 50%)',
          }} />
          {/* Warm amber cast to tint the frame image */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'rgba(139,94,60,0.12)',
            mixBlendMode: 'multiply',
          }} />

          {/* Grain overlay on hero */}
          <div className="grain-overlay" style={{ opacity: 0.06 }} />

          {/* Scroll progress bar — stitched style */}
          <div style={{ position: 'absolute', top: 0, insetInline: 0, height: '3px', background: 'rgba(212,168,75,0.08)', zIndex: 20, pointerEvents: 'none' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg, #8b5e3c, #c8733a, #d4a84b)', width: `${heroProgress * 100}%` }} />
          </div>

          {/* Text phases */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
            {PHASES.map((ph, i) => (
              <PhaseText key={i} phase={ph} prog={heroProgress} />
            ))}
          </div>

          {/* Phase indicator — leather notches on right */}
          <div style={{
            position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
            zIndex: 20, display: 'flex', flexDirection: 'column', gap: '10px', pointerEvents: 'none',
          }}>
            {PHASES.map((ph, i) => {
              const active = heroProgress >= ph.from && heroProgress < ph.to
              return (
                <div key={i} style={{
                  width: '3px',
                  height: active ? '28px' : '5px',
                  background: active ? '#c8733a' : 'rgba(212,168,75,0.2)',
                  borderRadius: '2px',
                  transition: 'height 0.4s ease, background 0.4s ease',
                  boxShadow: active ? '0 0 8px rgba(200,115,58,0.5)' : 'none',
                }} />
              )
            })}
          </div>

          {/* Stats bar */}
          <div style={{
            position: 'absolute', bottom: '40px', left: 0, right: 0, padding: '0 24px', zIndex: 10, pointerEvents: 'none',
            opacity: clamp(1 - heroProgress * 5, 0, 1),
          }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
              <div style={{
                display: 'inline-flex', flexWrap: 'wrap', gap: '0',
                background: 'rgba(26,17,8,0.72)',
                border: '1px solid rgba(212,168,75,0.2)',
                backdropFilter: 'blur(8px)',
                overflow: 'hidden',
              }}>
                {STATS.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center', padding: '16px 28px' }}>
                      <div style={{
                        fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
                        fontWeight: 900, color: '#c8733a', fontSize: '1.8rem', lineHeight: 1,
                      }}>{s.v}</div>
                      <div style={{
                        fontFamily: "'DM Mono', monospace", fontSize: '8px',
                        color: 'rgba(245,237,224,0.45)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '3px',
                      }}>{s.l}</div>
                    </div>
                    {i < STATS.length - 1 && (
                      <div style={{ width: '1px', height: '36px', background: 'rgba(212,168,75,0.2)' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll nudge */}
          <a href="#services" style={{
            position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            color: 'rgba(245,237,224,0.4)', zIndex: 20, textDecoration: 'none',
            opacity: clamp(1 - heroProgress * 12, 0, 1),
          }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '8px', letterSpacing: '0.28em', textTransform: 'uppercase' }}>Scroll</span>
            <ChevronDown size={14} style={{ animation: 'bounce 2s infinite' }} />
          </a>

          {/* Dev overlay */}
          {import.meta.env.DEV && TOTAL_FRAMES > 0 && (
            <div style={{
              position: 'absolute', bottom: '16px', right: '20px', zIndex: 30,
              fontSize: '9px', color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', letterSpacing: '0.1em', pointerEvents: 'none',
            }}>
              {Math.min(Math.floor(heroProgress * (TOTAL_FRAMES - 1)) + 1, TOTAL_FRAMES)}&nbsp;/&nbsp;{TOTAL_FRAMES}
              &nbsp;·&nbsp;{Math.round(loadProgress * 100)}% loaded
            </div>
          )}
        </div>
      </div>

      <StitchDivider />

      {/* ══ SERVICES ═════════════════════════════════════════════════════════ */}
      <section id="services" style={{ padding: '96px 24px', background: '#1a1108', position: 'relative' }}>
        <div className="grain-overlay" />
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
          <span className="section-eyebrow">What We Do</span>
          <h2 className="section-heading" style={{ fontSize: 'clamp(2rem,5vw,3.8rem)' }}>
            On-Site Aluminium<br /><em style={{ color: '#c8733a' }}>Services</em>
          </h2>
          {/* Stitched underline */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '40px' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ width: '12px', height: '3px', background: i < 3 ? '#c8733a' : 'rgba(200,115,58,0.2)', borderRadius: '2px' }} />
            ))}
          </div>
          <p style={{ color: 'rgba(245,237,224,0.45)', marginBottom: '52px', maxWidth: '480px', lineHeight: 1.8, fontSize: '11px', fontFamily: "'DM Mono', monospace" }}>
            We visit your home or building, take precise measurements, and complete every installation on-site — no factory detours, just expert work at your doorstep.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
            {SPECIALTIES.map(({ Icon, title, desc, accent }, i) => (
              <div key={i} className="leather-card" style={{ padding: '32px 28px' }}>
                <div style={{
                  marginBottom: '20px', display: 'inline-flex', padding: '10px',
                  border: `1px solid ${accent ? 'rgba(200,115,58,0.3)' : 'rgba(139,94,60,0.3)'}`,
                  background: accent ? 'rgba(200,115,58,0.08)' : 'rgba(139,94,60,0.08)',
                  color: accent ? '#c8733a' : '#8b5e3c',
                }}>
                  <Icon size={20} />
                </div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 700,
                  textTransform: 'uppercase', color: '#f5ede0', marginBottom: '10px', fontSize: '1.05rem', letterSpacing: '0.04em',
                }}>{title}</h3>
                <p style={{ color: 'rgba(245,237,224,0.45)', fontSize: '11px', lineHeight: 1.8, fontFamily: "'DM Mono', monospace" }}>{desc}</p>
                <div style={{
                  marginTop: '18px', display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '9px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: '#d4a84b', fontFamily: "'DM Mono', monospace",
                }}>
                  Learn more <ArrowRight size={10} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StitchDivider />

      {/* ══ ABOUT ════════════════════════════════════════════════════════════ */}
      <section id="about" style={{ padding: '96px 24px', background: '#231508', position: 'relative' }}>
        <div className="grain-overlay" />
        {/* Large decorative letter */}
        <div style={{
          position: 'absolute', right: '5%', top: '10%', zIndex: 0,
          fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 900,
          fontSize: 'clamp(120px, 20vw, 240px)', color: 'rgba(139,94,60,0.05)', lineHeight: 1,
          userSelect: 'none', pointerEvents: 'none',
        }}>A</div>
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '64px', alignItems: 'center' }}>
            <div>
              <span className="section-eyebrow">Why SkillTech</span>
              <h2 className="section-heading" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
                Installed at Your<br />Location.<br /><em style={{ color: '#c8733a' }}>Done Right.</em>
              </h2>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ width: '12px', height: '3px', background: i < 2 ? '#c8733a' : 'rgba(200,115,58,0.2)', borderRadius: '2px' }} />
                ))}
              </div>
              <p style={{ color: 'rgba(245,237,224,0.45)', fontSize: '11px', lineHeight: 1.9, maxWidth: '380px', fontFamily: "'DM Mono', monospace" }}>
                With over 15 years serving homes and commercial buildings, our field teams bring everything needed
                to your site — tools, materials, and the expertise to get every aluminium installation done perfectly, first time.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {WHY.map(({ Icon, title, desc }, i) => (
                <div key={i} className="leather-card" style={{ display: 'flex', gap: '18px', alignItems: 'flex-start', padding: '22px 20px' }}>
                  <div style={{ flexShrink: 0, padding: '10px', border: '1px solid rgba(200,115,58,0.3)', background: 'rgba(200,115,58,0.08)', color: '#c8733a' }}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 700, color: '#f5ede0', marginBottom: '4px', fontSize: '1rem', letterSpacing: '0.02em' }}>{title}</h3>
                    <p style={{ color: 'rgba(245,237,224,0.45)', fontSize: '11px', lineHeight: 1.7, fontFamily: "'DM Mono', monospace" }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div style={{ marginTop: '72px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', border: '1px solid rgba(212,168,75,0.15)' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                padding: '32px 24px', textAlign: 'center', background: '#1a1108',
                borderRight: i < STATS.length - 1 ? '1px solid rgba(212,168,75,0.1)' : 'none',
              }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 900, color: '#c8733a', fontSize: '2.4rem', lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '8px', color: 'rgba(245,237,224,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '6px' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StitchDivider />

      {/* ══ GALLERY ══════════════════════════════════════════════════════════ */}
      <section id="projects" style={{ padding: '96px 24px', background: '#1a1108', position: 'relative' }}>
        <div className="grain-overlay" />
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
          <span className="section-eyebrow">Our Work</span>
          <h2 className="section-heading" style={{ fontSize: 'clamp(2rem,5vw,3.8rem)' }}>
            Project <em style={{ color: '#c8733a' }}>Gallery</em>
          </h2>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '48px' }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} style={{ width: '12px', height: '3px', background: i < 4 ? '#c8733a' : 'rgba(200,115,58,0.2)', borderRadius: '2px' }} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: '220px', gap: '10px' }}>
            {GALLERY.map(({ id, label, tag, tall }) => (
              <div key={id} style={{
                position: 'relative', overflow: 'hidden', background: '#231508',
                border: '1px solid rgba(212,168,75,0.12)',
                gridRow: tall ? 'span 2' : 'span 1',
                cursor: 'pointer',
              }}
                onMouseEnter={e => {
                  e.currentTarget.querySelector('img').style.opacity = '0.65'
                  e.currentTarget.querySelector('img').style.transform = 'scale(1.07)'
                  e.currentTarget.querySelector('.gal-border').style.opacity = '1'
                }}
                onMouseLeave={e => {
                  e.currentTarget.querySelector('img').style.opacity = '0.45'
                  e.currentTarget.querySelector('img').style.transform = 'scale(1)'
                  e.currentTarget.querySelector('.gal-border').style.opacity = '0'
                }}>
                <img src={`https://picsum.photos/seed/${SEEDS[id - 1]}/800/600`} alt={label}
                  style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                    opacity: 0.45, transition: 'opacity 0.5s, transform 0.5s', filter: 'sepia(0.3) contrast(1.1)',
                  }} />
                {/* warm overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,17,8,0.9) 0%, rgba(74,47,26,0.2) 60%, transparent 100%)' }} />
                {/* hover border */}
                <div className="gal-border" style={{
                  position: 'absolute', inset: '6px', border: '1px solid rgba(200,115,58,0.5)',
                  opacity: 0, transition: 'opacity 0.3s', pointerEvents: 'none',
                }} />
                <div style={{ position: 'absolute', insetInline: 0, bottom: 0, padding: '18px 16px' }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", color: '#d4a84b', fontSize: '8px', fontWeight: 500, letterSpacing: '0.24em', textTransform: 'uppercase' }}>{tag}</span>
                  <p style={{ color: '#f5ede0', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '14px', marginTop: '4px' }}>{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StitchDivider />

      {/* ══ TESTIMONIALS ═════════════════════════════════════════════════════ */}
      <section style={{ padding: '96px 24px', background: '#231508', position: 'relative' }}>
        <div className="grain-overlay" />
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
          <span className="section-eyebrow">Client Voices</span>
          <h2 className="section-heading" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
            What Our <em style={{ color: '#c8733a' }}>Clients Say</em>
          </h2>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '48px' }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} style={{ width: '12px', height: '3px', background: i < 3 ? '#c8733a' : 'rgba(200,115,58,0.2)', borderRadius: '2px' }} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
            {TESTIMONIALS.map(({ name, role, stars, text }, i) => (
              <div key={i} className="leather-card" style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Stars */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  {Array.from({ length: stars }).map((_, j) => (
                    <Star key={j} size={12} style={{ color: '#d4a84b', fill: '#d4a84b' }} />
                  ))}
                </div>
                {/* Large opening quote */}
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', color: 'rgba(200,115,58,0.2)', lineHeight: 0.8, marginBottom: '-8px' }}>"</div>
                <p style={{ color: 'rgba(245,237,224,0.6)', fontSize: '11px', lineHeight: 1.9, fontFamily: "'DM Mono', monospace', flex: 1" }}>{text}</p>
                <div style={{ paddingTop: '16px', borderTop: '1px dashed rgba(212,168,75,0.15)' }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#f5ede0', fontSize: '13px' }}>{name}</p>
                  <p style={{ fontFamily: "'DM Mono', monospace", color: 'rgba(245,237,224,0.35)', fontSize: '9px', marginTop: '2px', letterSpacing: '0.08em' }}>{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ═══════════════════════════════════════════════════════ */}
      <section style={{ padding: '88px 24px', background: '#c8733a', position: 'relative', overflow: 'hidden' }}>
        {/* Texture grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: 'repeating-linear-gradient(0deg, #1a1108 0, #1a1108 1px, transparent 1px, transparent 48px), repeating-linear-gradient(90deg, #1a1108 0, #1a1108 1px, transparent 1px, transparent 48px)',
        }} />
        {/* Stitched border inset */}
        <div style={{ position: 'absolute', inset: '12px', border: '1px dashed rgba(26,17,8,0.2)', pointerEvents: 'none' }} />
        <div className="grain-overlay" style={{ opacity: 0.04 }} />
        <div style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 900,
            color: '#1a1108', fontSize: 'clamp(2rem,5vw,3.8rem)', lineHeight: 0.95, marginBottom: '16px', textTransform: 'uppercase',
          }}>
            Ready for Your<br />Free Site Visit?
          </h2>
          <p style={{ color: 'rgba(26,17,8,0.7)', marginBottom: '36px', fontSize: '11px', lineHeight: 1.8, maxWidth: '480px', margin: '0 auto 36px', fontFamily: "'DM Mono', monospace" }}>
            Tell us your location and requirements. Our team will visit your property and provide a detailed quote within one business day.
          </p>
          <a href="#contact" className="stitch-btn" style={{ background: '#1a1108', color: '#f5ede0', border: '2px solid rgba(245,237,224,0.3)' }}>
            <Phone size={13} /> Book a Site Visit
          </a>
        </div>
      </section>

      <StitchDivider />

      {/* ══ CONTACT ══════════════════════════════════════════════════════════ */}
      <section id="contact" style={{ padding: '96px 24px', background: '#1a1108', position: 'relative' }}>
        <div className="grain-overlay" />
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '64px', position: 'relative' }}>
          <div>
            <span className="section-eyebrow">Get in Touch</span>
            <h2 className="section-heading" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
              Book Your<br /><em style={{ color: '#c8733a' }}>Site Visit Today</em>
            </h2>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '32px' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ width: '12px', height: '3px', background: i < 2 ? '#c8733a' : 'rgba(200,115,58,0.2)', borderRadius: '2px' }} />
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {[
                { Icon: Phone, label: 'Phone', val: '+91 98765 43210' },
                { Icon: Mail, label: 'Email', val: 'info@skilltechaluminium.com' },
                { Icon: MapPin, label: 'Service Area', val: 'Thrissur, Ernakulam & Palakkad Districts' },
              ].map(({ Icon, label, val }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ padding: '10px', border: '1px solid rgba(200,115,58,0.3)', background: 'rgba(200,115,58,0.08)', color: '#c8733a', flexShrink: 0 }}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '8px', color: 'rgba(245,237,224,0.35)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '3px' }}>{label}</p>
                    <p style={{ color: '#f5ede0', fontSize: '12px', fontFamily: "'DM Mono', monospace" }}>{val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="leather-card" style={{ padding: '36px 32px' }}>
            {sent ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', textAlign: 'center', padding: '40px 0' }}>
                <CheckCircle2 size={44} style={{ color: '#c8733a' }} />
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#f5ede0', fontSize: '1.4rem' }}>Request Received!</h3>
                <p style={{ color: 'rgba(245,237,224,0.45)', fontSize: '11px', fontFamily: "'DM Mono', monospace" }}>We'll call you to confirm your site visit within one business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 700, color: '#f5ede0', fontSize: '1.3rem', letterSpacing: '0.02em' }}>Request a Site Visit</h3>
                {[
                  { id: 'name', label: 'Full Name', type: 'text', placeholder: 'John Thomas' },
                  { id: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com' },
                ].map(({ id, label, type, placeholder }) => (
                  <div key={id}>
                    <label htmlFor={id} style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '8px', color: 'rgba(245,237,224,0.4)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '6px' }}>{label}</label>
                    <input id={id} name={id} type={type} placeholder={placeholder} required value={form[id]} onChange={handleForm} className="input-leather" />
                  </div>
                ))}
                <div>
                  <label htmlFor="details" style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '8px', color: 'rgba(245,237,224,0.4)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '6px' }}>Work Details & Location</label>
                  <textarea id="details" name="details" rows={4} required
                    placeholder="Describe the aluminium work needed, your property address, and preferred visit time..."
                    value={form.details} onChange={handleForm}
                    className="input-leather" style={{ resize: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '8px', color: 'rgba(245,237,224,0.4)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '6px' }}>Attach Photo (optional)</label>
                  <label style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    border: '1px dashed rgba(212,168,75,0.2)', padding: '14px 16px', cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(200,115,58,0.4)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(212,168,75,0.2)'}>
                    <Upload size={14} style={{ color: 'rgba(245,237,224,0.3)' }} />
                    <span style={{ color: 'rgba(245,237,224,0.35)', fontSize: '11px', fontFamily: "'DM Mono', monospace" }}>
                      {form.file ? form.file.name : 'Upload photos of your site or existing frames'}
                    </span>
                    <input type="file" name="file" style={{ display: 'none' }} onChange={handleForm} accept=".pdf,.png,.jpg,.jpeg" />
                  </label>
                </div>
                <button type="submit" className="stitch-btn" style={{ justifyContent: 'center', marginTop: '4px' }}>
                  Book My Site Visit
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════════════════ */}
      <footer style={{ background: '#0f0a04', borderTop: '1px solid rgba(212,168,75,0.1)', padding: '64px 24px 32px', position: 'relative' }}>
        <StitchDivider />
        <div className="grain-overlay" style={{ opacity: 0.05 }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', paddingBottom: '48px', borderBottom: '1px dashed rgba(212,168,75,0.1)' }}>
            <div>
              <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', textDecoration: 'none' }}>
                <svg width="24" height="24" viewBox="0 0 32 32">
                  <rect x="4" y="4" width="24" height="24" fill="none" stroke="#d4a84b" strokeWidth="1.5" transform="rotate(45 16 16)" />
                  <rect x="10" y="10" width="12" height="12" fill="#c8733a" transform="rotate(45 16 16)" />
                </svg>
                <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 900, fontSize: '17px', color: '#f5ede0', textTransform: 'uppercase' }}>
                  SKILL<span style={{ color: '#c8733a' }}>TECH</span>
                </span>
              </a>
              <p style={{ color: 'rgba(245,237,224,0.35)', fontSize: '10px', lineHeight: 1.9, fontFamily: "'DM Mono', monospace" }}>
                On-site aluminium fabrication and installation for homes and buildings across Kerala since 2009.
              </p>
            </div>
            {[
              { title: 'Quick Links', links: ['Services', 'About', 'Projects', 'Contact', 'Book Site Visit'] },
              { title: 'Services', links: ['Aluminium Windows', 'Doors & Entrances', 'Railings & Handrails', 'Partitions & Cladding', 'Curtain Walls'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '8px', color: 'rgba(245,237,224,0.35)', letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: '16px', borderBottom: '1px dashed rgba(212,168,75,0.12)', paddingBottom: '8px' }}>{title}</p>
                {links.map(l => (
                  <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, '')}`} style={{
                    display: 'block', padding: '6px 0', fontFamily: "'DM Mono', monospace",
                    fontSize: '10px', color: 'rgba(245,237,224,0.5)', textDecoration: 'none', transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => e.target.style.color = '#c8733a'}
                    onMouseLeave={e => e.target.style.color = 'rgba(245,237,224,0.5)'}>{l}</a>
                ))}
              </div>
            ))}
            <div>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '8px', color: 'rgba(245,237,224,0.35)', letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: '16px', borderBottom: '1px dashed rgba(212,168,75,0.12)', paddingBottom: '8px' }}>Contact</p>
              {[
                { Icon: Phone, val: '+91 98765 43210' },
                { Icon: Mail, val: 'info@skilltechaluminium.com' },
                { Icon: MapPin, val: 'Thrissur, Ernakulam\n& Palakkad Districts' },
              ].map(({ Icon, val }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                  <Icon size={12} style={{ color: '#c8733a', flexShrink: 0, marginTop: '1px' }} />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'rgba(245,237,224,0.5)', whiteSpace: 'pre-line' }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ paddingTop: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <p style={{ fontFamily: "'DM Mono', monospace", color: 'rgba(245,237,224,0.25)', fontSize: '9px' }}>© 2024 SkillTech Aluminium Works. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '24px' }}>
              {['Privacy Policy', 'Terms of Service', 'Sitemap'].map(l => (
                <a key={l} href="#" style={{ fontFamily: "'DM Mono', monospace", color: 'rgba(245,237,224,0.25)', fontSize: '9px', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#c8733a'}
                  onMouseLeave={e => e.target.style.color = 'rgba(245,237,224,0.25)'}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }
        @media (min-width: 768px) {
          .hidden-mobile { display: flex !important; }
          button[aria-label="Menu"] { display: none; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </div>
  )
}
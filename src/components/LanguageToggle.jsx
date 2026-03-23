import { useI18n } from '../i18n.jsx'

// Inline SVG flags — no emoji dependency
function NlFlag({ className = '' }) {
  return (
    <svg viewBox="0 0 24 16" className={className} aria-label="Nederlands">
      <rect width="24" height="5.33" fill="#AE1C28" />
      <rect y="5.33" width="24" height="5.33" fill="#fff" />
      <rect y="10.67" width="24" height="5.33" fill="#21468B" />
    </svg>
  )
}

function GbFlag({ className = '' }) {
  return (
    <svg viewBox="0 0 24 16" className={className} aria-label="English">
      <rect width="24" height="16" fill="#012169" />
      <path d="M0,0 L24,16 M24,0 L0,16" stroke="#fff" strokeWidth="2.5" />
      <path d="M0,0 L24,16 M24,0 L0,16" stroke="#C8102E" strokeWidth="1.5" />
      <path d="M12,0 V16 M0,8 H24" stroke="#fff" strokeWidth="4" />
      <path d="M12,0 V16 M0,8 H24" stroke="#C8102E" strokeWidth="2.5" />
    </svg>
  )
}

export default function LanguageToggle() {
  const { lang, toggleLang } = useI18n()

  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 rounded-full px-2.5 py-1.5 transition-colors"
      title={lang === 'nl' ? 'Switch to English' : 'Schakel naar Nederlands'}
    >
      {/* Current language flag (bright) */}
      {lang === 'nl' ? (
        <NlFlag className="w-5 h-3.5 rounded-[1px] shadow-sm" />
      ) : (
        <GbFlag className="w-5 h-3.5 rounded-[1px] shadow-sm" />
      )}
      {/* Label */}
      <span className="text-white text-[11px] font-medium uppercase tracking-wide">
        {lang === 'nl' ? 'NL' : 'EN'}
      </span>
      {/* Switch arrow */}
      <svg className="w-3 h-3 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    </button>
  )
}

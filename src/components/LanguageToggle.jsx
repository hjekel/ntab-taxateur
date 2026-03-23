import { useI18n } from '../i18n'

export default function LanguageToggle() {
  const { lang, toggleLang } = useI18n()

  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-1 bg-white/15 hover:bg-white/25 rounded-full px-2 py-1 transition-colors"
      title={lang === 'nl' ? 'Switch to English' : 'Schakel naar Nederlands'}
    >
      {/* Inactive flag (smaller, dimmed) */}
      <span className={`text-sm ${lang === 'nl' ? 'opacity-40 text-[12px]' : 'opacity-100'}`}>
        {lang === 'nl' ? '🇬🇧' : '🇳🇱'}
      </span>
      {/* Divider */}
      <span className="text-white/30 text-[10px]">|</span>
      {/* Active flag (larger) */}
      <span className={`text-sm ${lang === 'en' ? 'opacity-40 text-[12px]' : 'opacity-100'}`}>
        {lang === 'nl' ? '🇳🇱' : '🇬🇧'}
      </span>
    </button>
  )
}

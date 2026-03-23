// NTAB logo matching official branding:
// Dark border frame, N T on top row (dark navy), A (red) B (dark navy) on bottom
// Bold condensed block letters, tight grid, no rounded corners
export default function NtabLogo({ size = 'md', variant = 'light' }) {
  const sizes = {
    sm: { box: 'w-8 h-8', letter: 'text-[11px]', border: 'border-[1.5px]' },
    md: { box: 'w-10 h-10', letter: 'text-[14px]', border: 'border-2' },
    lg: { box: 'w-14 h-14', letter: 'text-[20px]', border: 'border-[2.5px]' },
    xl: { box: 'w-20 h-20', letter: 'text-[28px]', border: 'border-[3px]' },
  }
  const s = sizes[size] || sizes.md

  // Colors based on official NTAB logo
  const navy = '#1b2a4a'
  const red = '#c8102e'

  const bgColor = variant === 'light' ? 'bg-white' : 'bg-[#2a2a2a]'
  const borderColor = variant === 'light' ? `border-[${navy}]` : 'border-white/80'
  const blueStyle = { color: variant === 'light' ? navy : 'white' }
  const redStyle = { color: variant === 'dark' ? '#ff6b6b' : red }

  return (
    <div
      className={`${s.box} ${bgColor} ${s.border} grid grid-cols-2 grid-rows-2 shrink-0`}
      style={{ borderColor: variant === 'light' ? navy : 'rgba(255,255,255,0.8)' }}
    >
      <div className={`flex items-center justify-center ${s.letter} leading-none`}
        style={{ ...blueStyle, fontFamily: "'Arial Black','Arial',sans-serif", fontWeight: 900 }}>N</div>
      <div className={`flex items-center justify-center ${s.letter} leading-none`}
        style={{ ...blueStyle, fontFamily: "'Arial Black','Arial',sans-serif", fontWeight: 900 }}>T</div>
      <div className={`flex items-center justify-center ${s.letter} leading-none`}
        style={{ ...redStyle, fontFamily: "'Arial Black','Arial',sans-serif", fontWeight: 900 }}>A</div>
      <div className={`flex items-center justify-center ${s.letter} leading-none`}
        style={{ ...blueStyle, fontFamily: "'Arial Black','Arial',sans-serif", fontWeight: 900 }}>B</div>
    </div>
  )
}

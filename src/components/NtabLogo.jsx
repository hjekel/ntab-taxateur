// NTAB logo: NT in dark blue, A in red, B in dark blue — 2x2 grid block letters
export default function NtabLogo({ size = 'md', variant = 'light' }) {
  const sizes = {
    sm: { box: 'w-8 h-8', letter: 'text-[9px]' },
    md: { box: 'w-10 h-10', letter: 'text-[11px]' },
    lg: { box: 'w-14 h-14', letter: 'text-[15px]' },
  }
  const s = sizes[size] || sizes.md

  const bgColor = variant === 'light' ? 'bg-white' : 'bg-ntab-primary'
  const blueText = variant === 'light' ? 'text-[#1a2b5e]' : 'text-white'
  const redText = 'text-[#c41e3a]'

  return (
    <div className={`${s.box} ${bgColor} rounded-sm grid grid-cols-2 grid-rows-2 shrink-0 overflow-hidden`}>
      <div className={`flex items-center justify-center font-black ${s.letter} ${blueText} leading-none`}>N</div>
      <div className={`flex items-center justify-center font-black ${s.letter} ${blueText} leading-none`}>T</div>
      <div className={`flex items-center justify-center font-black ${s.letter} ${redText} leading-none`}>A</div>
      <div className={`flex items-center justify-center font-black ${s.letter} ${blueText} leading-none`}>B</div>
    </div>
  )
}

import { useRef, useEffect, useState } from 'react'

// Photo object: { name: string, dataUrl: string, type: 'file'|'clipboard'|'demo' }

export default function PhotoUpload({ photos, onChange }) {
  const fileInputRef = useRef(null)
  const dropZoneRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  function addPhoto(name, dataUrl, type = 'file') {
    onChange([...photos, { name, dataUrl, type }])
  }

  function removePhoto(index) {
    onChange(photos.filter((_, i) => i !== index))
  }

  function handleFiles(files) {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = e => addPhoto(file.name, e.target.result, 'file')
      reader.readAsDataURL(file)
    })
  }

  function handleFileInput(e) {
    handleFiles(e.target.files)
    e.target.value = ''
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
  }

  // Clipboard paste (Ctrl+V / Prt Sc)
  useEffect(() => {
    function handlePaste(e) {
      const items = e.clipboardData?.items
      if (!items) return
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault()
          const file = item.getAsFile()
          const reader = new FileReader()
          reader.onload = ev => {
            const timestamp = new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            addPhoto(`screenshot_${timestamp}.png`, ev.target.result, 'clipboard')
          }
          reader.readAsDataURL(file)
          break
        }
      }
    }
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  })

  function addDemoPhoto() {
    const demoNames = ['voorzijde.jpg', 'linkerzijde.jpg', 'rechterzijde.jpg', 'typeplaat.jpg', 'bedieningspaneel.jpg', 'detail_slijtage.jpg']
    const nextName = demoNames[photos.length % demoNames.length]
    addPhoto(nextName, null, 'demo')
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-ntab-border p-4 sm:p-6 hover:shadow-md transition-shadow">
      <h2 className="text-base sm:text-lg font-semibold text-ntab-primary mb-4 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        Foto&apos;s
        {photos.length > 0 && <span className="text-xs font-normal text-ntab-text-light ml-1">({photos.length})</span>}
      </h2>

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
          {photos.map((photo, i) => (
            <div key={i} className="relative group aspect-square bg-ntab-light rounded-lg border border-ntab-border overflow-hidden">
              {photo.dataUrl ? (
                <img src={photo.dataUrl} alt={photo.name} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-ntab-text-light/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] px-1.5 py-0.5 truncate flex items-center gap-1">
                {photo.type === 'clipboard' && <span title="Screenshot">📷</span>}
                {photo.type === 'file' && <span title="Bestand">📁</span>}
                {photo.type === 'demo' && <span title="Demo">🔲</span>}
                {photo.name}
              </div>
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      <div
        ref={dropZoneRef}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all ${
          dragging ? 'border-ntab-accent bg-ntab-accent/5 scale-[1.01]' : 'border-ntab-border hover:border-ntab-secondary hover:bg-ntab-light/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />
        <svg className="w-7 h-7 mx-auto text-gray-400 mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        <p className="text-sm text-ntab-text-light">
          <span className="text-ntab-secondary font-medium">Klik om bestanden te kiezen</span> of sleep hierheen
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Plak een screenshot met <kbd className="bg-gray-200 px-1 rounded text-[10px]">Ctrl+V</kbd> of <kbd className="bg-gray-200 px-1 rounded text-[10px]">Prt Sc</kbd>
        </p>
      </div>

      {/* Demo button */}
      <button
        type="button"
        onClick={addDemoPhoto}
        className="mt-2 w-full text-xs text-ntab-text-light hover:text-ntab-secondary py-1.5 transition-colors"
      >
        + Demo foto toevoegen (simulatie)
      </button>
    </div>
  )
}

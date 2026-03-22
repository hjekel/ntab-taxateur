import { useState, useMemo } from 'react'
import { categories, brands, exampleModels, conditionLabels } from '../data/categories'

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

export default function AssetForm({ onSubmit }) {
  const [form, setForm] = useState({
    category: '',
    subcategory: '',
    brand: '',
    model: '',
    year: '',
    hours: '',
    condition: 3,
    notes: '',
    photos: [],
  })
  const [errors, setErrors] = useState({})

  const selectedCategory = useMemo(
    () => categories.find(c => c.id === form.category),
    [form.category]
  )

  const availableBrands = useMemo(
    () => brands[form.category] || [],
    [form.category]
  )

  const availableModels = useMemo(() => {
    if (!form.brand || !form.subcategory) return []
    const key = `${form.brand}|${form.subcategory}`
    return exampleModels[key] || []
  }, [form.brand, form.subcategory])

  function update(field, value) {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      if (field === 'category') {
        next.subcategory = ''
        next.brand = ''
        next.model = ''
      }
      if (field === 'brand') {
        next.model = ''
      }
      return next
    })
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  function validate() {
    const e = {}
    if (!form.category) e.category = 'Selecteer een categorie'
    if (!form.subcategory) e.subcategory = 'Selecteer een subcategorie'
    if (!form.brand) e.brand = 'Voer een merk in'
    if (!form.model) e.model = 'Voer een model in'
    if (!form.year) e.year = 'Selecteer een bouwjaar'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (validate()) {
      onSubmit({
        ...form,
        year: parseInt(form.year),
        hours: form.hours ? parseInt(form.hours) : null,
        condition: parseInt(form.condition),
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-ntab-border p-4 sm:p-6 hover:shadow-md transition-shadow">
        <h2 className="text-base sm:text-lg font-semibold text-ntab-primary mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          Asset Identificatie
        </h2>

        {/* Categorie */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-ntab-text mb-1">Categorie *</label>
            <select
              value={form.category}
              onChange={e => update('category', e.target.value)}
              className={`w-full rounded-lg border ${errors.category ? 'border-red-500' : 'border-ntab-border'} px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ntab-secondary`}
            >
              <option value="">-- Selecteer categorie --</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-ntab-text mb-1">Subcategorie *</label>
            <select
              value={form.subcategory}
              onChange={e => update('subcategory', e.target.value)}
              disabled={!selectedCategory}
              className={`w-full rounded-lg border ${errors.subcategory ? 'border-red-500' : 'border-ntab-border'} px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ntab-secondary disabled:bg-gray-100 disabled:text-gray-400`}
            >
              <option value="">-- Selecteer subcategorie --</option>
              {selectedCategory?.subcategories.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
            {errors.subcategory && <p className="text-red-500 text-xs mt-1">{errors.subcategory}</p>}
          </div>
        </div>

        {/* Merk & Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-ntab-text mb-1">Merk *</label>
            <select
              value={form.brand}
              onChange={e => update('brand', e.target.value)}
              disabled={!form.category}
              className={`w-full rounded-lg border ${errors.brand ? 'border-red-500' : 'border-ntab-border'} px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ntab-secondary disabled:bg-gray-100 disabled:text-gray-400`}
            >
              <option value="">-- Selecteer merk --</option>
              {availableBrands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-ntab-text mb-1">Model *</label>
            {availableModels.length > 0 ? (
              <select
                value={form.model}
                onChange={e => update('model', e.target.value)}
                className={`w-full rounded-lg border ${errors.model ? 'border-red-500' : 'border-ntab-border'} px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ntab-secondary`}
              >
                <option value="">-- Selecteer model --</option>
                {availableModels.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={form.model}
                onChange={e => update('model', e.target.value)}
                placeholder={form.brand ? 'Voer model in' : 'Selecteer eerst een merk'}
                disabled={!form.brand}
                className={`w-full rounded-lg border ${errors.model ? 'border-red-500' : 'border-ntab-border'} px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ntab-secondary disabled:bg-gray-100 disabled:text-gray-400`}
              />
            )}
            {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model}</p>}
          </div>
        </div>

        {/* Bouwjaar & Draaiuren */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-ntab-text mb-1">Bouwjaar *</label>
            <select
              value={form.year}
              onChange={e => update('year', e.target.value)}
              className={`w-full rounded-lg border ${errors.year ? 'border-red-500' : 'border-ntab-border'} px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ntab-secondary`}
            >
              <option value="">-- Selecteer jaar --</option>
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-ntab-text mb-1">Draaiuren / KM-stand</label>
            <input
              type="number"
              value={form.hours}
              onChange={e => update('hours', e.target.value)}
              placeholder="bijv. 4500"
              className="w-full rounded-lg border border-ntab-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ntab-secondary"
            />
          </div>
        </div>
      </div>

      {/* Conditie */}
      <div className="bg-white rounded-xl shadow-sm border border-ntab-border p-4 sm:p-6 hover:shadow-md transition-shadow">
        <h2 className="text-base sm:text-lg font-semibold text-ntab-primary mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Conditiebeoordeling
        </h2>

        {/* Professional condition scale bar */}
        <div className="mb-4">
          <div className="flex items-stretch border border-ntab-border rounded-lg overflow-hidden">
            {conditionLabels.map((c, i) => {
              const isSelected = form.condition === c.value
              const barColors = [
                'bg-red-700', 'bg-amber-600', 'bg-yellow-500', 'bg-emerald-600', 'bg-ntab-primary'
              ]
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => update('condition', c.value)}
                  className={`flex-1 py-3 px-1 text-center transition-all relative ${
                    i < conditionLabels.length - 1 ? 'border-r border-ntab-border' : ''
                  } ${isSelected
                    ? `${barColors[i]} text-white font-semibold`
                    : 'bg-white text-ntab-text hover:bg-ntab-light'
                  }`}
                >
                  <div className={`text-xs font-bold mb-0.5 ${isSelected ? 'text-white/80' : 'text-ntab-text-light'}`}>
                    {c.value}
                  </div>
                  <div className="text-[11px] sm:text-xs leading-tight">{c.label}</div>
                </button>
              )
            })}
          </div>
          {/* Scale gradient indicator */}
          <div className="flex mt-1.5">
            <div className="h-1 flex-1 rounded-l-full bg-red-700" />
            <div className="h-1 flex-1 bg-amber-600" />
            <div className="h-1 flex-1 bg-yellow-500" />
            <div className="h-1 flex-1 bg-emerald-600" />
            <div className="h-1 flex-1 rounded-r-full bg-ntab-primary" />
          </div>
        </div>

        {/* Selected condition detail */}
        <div className="bg-ntab-light rounded-lg p-3 flex items-start gap-3">
          <div className={`shrink-0 w-8 h-8 rounded flex items-center justify-center text-white font-bold text-sm ${
            form.condition === 1 ? 'bg-red-700' : form.condition === 2 ? 'bg-amber-600' : form.condition === 3 ? 'bg-yellow-500' : form.condition === 4 ? 'bg-emerald-600' : 'bg-ntab-primary'
          }`}>
            {form.condition}
          </div>
          <div>
            <div className="text-sm font-medium text-ntab-text">
              {conditionLabels.find(c => c.value === form.condition)?.label}
            </div>
            <div className="text-xs text-ntab-text-light mt-0.5">
              {conditionLabels.find(c => c.value === form.condition)?.description}
            </div>
          </div>
        </div>
      </div>

      {/* Foto upload simulatie */}
      <div className="bg-white rounded-xl shadow-sm border border-ntab-border p-4 sm:p-6 hover:shadow-md transition-shadow">
        <h2 className="text-base sm:text-lg font-semibold text-ntab-primary mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          Foto&apos;s
          {form.photos?.length > 0 && <span className="text-xs font-normal text-ntab-text-light ml-1">({form.photos.length})</span>}
        </h2>

        {/* Uploaded photos grid */}
        {form.photos?.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
            {form.photos.map((photo, i) => (
              <div key={i} className="relative group aspect-square bg-ntab-light rounded-lg border border-ntab-border overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-ntab-text-light/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] px-1.5 py-0.5 truncate">
                  {photo}
                </div>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, photos: prev.photos.filter((_, j) => j !== i) }))}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            const demoNames = ['voorzijde.jpg', 'linkerzijde.jpg', 'rechterzijde.jpg', 'typeplaat.jpg', 'bedieningspaneel.jpg', 'detail_slijtage.jpg']
            const nextName = demoNames[(form.photos?.length || 0) % demoNames.length]
            setForm(prev => ({ ...prev, photos: [...(prev.photos || []), nextName] }))
          }}
          className="w-full border-2 border-dashed border-ntab-border rounded-lg p-6 text-center hover:border-ntab-secondary hover:bg-ntab-light/50 transition-colors cursor-pointer"
        >
          <svg className="w-8 h-8 mx-auto text-gray-400 mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
          <p className="text-sm text-ntab-text-light">Foto toevoegen <span className="text-ntab-secondary font-medium">(demo)</span></p>
          <p className="text-xs text-gray-400 mt-0.5">Klik om een gesimuleerde foto toe te voegen</p>
        </button>
      </div>

      {/* Notities */}
      <div className="bg-white rounded-xl shadow-sm border border-ntab-border p-4 sm:p-6 hover:shadow-md transition-shadow">
        <label className="block text-sm font-medium text-ntab-text mb-1">Aanvullende opmerkingen</label>
        <textarea
          value={form.notes}
          onChange={e => update('notes', e.target.value)}
          rows={3}
          placeholder="Bijzonderheden, opties, accessoires..."
          className="w-full rounded-lg border border-ntab-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ntab-secondary resize-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-ntab-accent hover:bg-orange-800 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        Start Marktanalyse
      </button>
    </form>
  )
}

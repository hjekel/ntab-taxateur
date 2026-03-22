import { useState, useMemo } from 'react'
import { categories, brands, conditionLabels } from '../data/categories'

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

  function update(field, value) {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      if (field === 'category') {
        next.subcategory = ''
        next.brand = ''
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
            <input
              type="text"
              list="brand-list"
              value={form.brand}
              onChange={e => update('brand', e.target.value)}
              placeholder="bijv. DMG Mori"
              className={`w-full rounded-lg border ${errors.brand ? 'border-red-500' : 'border-ntab-border'} px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ntab-secondary`}
            />
            <datalist id="brand-list">
              {availableBrands.map(b => (
                <option key={b} value={b} />
              ))}
            </datalist>
            {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-ntab-text mb-1">Model *</label>
            <input
              type="text"
              value={form.model}
              onChange={e => update('model', e.target.value)}
              placeholder="bijv. CLX 350"
              className={`w-full rounded-lg border ${errors.model ? 'border-red-500' : 'border-ntab-border'} px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ntab-secondary`}
            />
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

        <div className="flex gap-2 mb-3">
          {conditionLabels.map(c => (
            <button
              key={c.value}
              type="button"
              onClick={() => update('condition', c.value)}
              className={`flex-1 py-3 px-2 rounded-lg text-sm font-medium transition-all ${
                form.condition === c.value
                  ? 'bg-ntab-primary text-white shadow-md scale-105'
                  : 'bg-ntab-light text-ntab-text hover:bg-gray-200'
              }`}
            >
              <div className="text-lg mb-1">
                {c.value === 1 ? '😟' : c.value === 2 ? '😐' : c.value === 3 ? '🙂' : c.value === 4 ? '😊' : '🤩'}
              </div>
              {c.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-ntab-text-light italic">
          {conditionLabels.find(c => c.value === form.condition)?.description}
        </p>
      </div>

      {/* Foto upload simulatie */}
      <div className="bg-white rounded-xl shadow-sm border border-ntab-border p-4 sm:p-6 hover:shadow-md transition-shadow">
        <h2 className="text-base sm:text-lg font-semibold text-ntab-primary mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          Foto&apos;s
        </h2>
        <div className="border-2 border-dashed border-ntab-border rounded-lg p-8 text-center hover:border-ntab-secondary transition-colors cursor-pointer">
          <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
          <p className="text-sm text-ntab-text-light">Sleep foto&apos;s hierheen of <span className="text-ntab-secondary font-medium">klik om te uploaden</span></p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG tot 10MB (demo modus)</p>
        </div>
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
        className="w-full bg-ntab-accent hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        Start Marktanalyse
      </button>
    </form>
  )
}

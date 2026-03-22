import { useState, useEffect } from 'react'
import AssetForm from './components/AssetForm'
import PriceEngine from './components/PriceEngine'
import TaxateurAdjust from './components/TaxateurAdjust'
import ReportPreview from './components/ReportPreview'
import { formatCurrency } from './utils/priceCalculator'
import { categories, conditionLabels } from './data/categories'

const steps = [
  { id: 'input', label: 'Asset Invoer', icon: '📋' },
  { id: 'analysis', label: 'Marktanalyse', icon: '🔍' },
  { id: 'adjust', label: 'Aanpassing', icon: '✏️' },
  { id: 'report', label: 'Rapport', icon: '📄' },
]

const STORAGE_KEY = 'ntab-taxatool-session'

function loadSession() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch { return null }
}

function saveSession(session) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(session)) } catch {}
}

export default function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [asset, setAsset] = useState(null)
  const [priceData, setPriceData] = useState(null)
  const [adjustment, setAdjustment] = useState(null)
  const [completedAssets, setCompletedAssets] = useState([])
  const [showAssetList, setShowAssetList] = useState(false)
  const [sessionRestored, setSessionRestored] = useState(false)

  // Restore session from localStorage
  useEffect(() => {
    const saved = loadSession()
    if (saved?.completedAssets?.length > 0) {
      setCompletedAssets(saved.completedAssets)
      setSessionRestored(true)
      setTimeout(() => setSessionRestored(false), 3000)
    }
  }, [])

  // Save completed assets to localStorage
  useEffect(() => {
    if (completedAssets.length > 0) {
      saveSession({ completedAssets, savedAt: new Date().toISOString() })
    }
  }, [completedAssets])

  function handleAssetSubmit(data) {
    setAsset(data)
    setCurrentStep(1)
  }

  function handlePriceComplete(data) {
    setPriceData(data)
    setCurrentStep(2)
  }

  function handleAdjustComplete(data) {
    setAdjustment(data)
    setCurrentStep(3)
  }

  function handleSaveAsset() {
    if (asset && adjustment) {
      const completed = {
        id: Date.now(),
        asset,
        priceData,
        adjustment,
        timestamp: new Date().toISOString(),
      }
      setCompletedAssets(prev => [...prev, completed])
    }
  }

  function startNewAsset() {
    setCurrentStep(0)
    setAsset(null)
    setPriceData(null)
    setAdjustment(null)
  }

  function removeAsset(id) {
    setCompletedAssets(prev => {
      const next = prev.filter(a => a.id !== id)
      if (next.length === 0) localStorage.removeItem(STORAGE_KEY)
      return next
    })
  }

  function goToStep(stepIndex) {
    if (stepIndex < currentStep) setCurrentStep(stepIndex)
  }

  function clearSession() {
    localStorage.removeItem(STORAGE_KEY)
    setCompletedAssets([])
  }

  return (
    <div className="min-h-screen bg-ntab-light flex flex-col">
      {/* Header */}
      <header className="bg-ntab-primary shadow-lg no-print">
        <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-white rounded-lg p-1 sm:p-1.5 shrink-0">
              <div className="text-ntab-primary font-black text-sm sm:text-lg leading-none tracking-tight">NTAB</div>
            </div>
            <div className="min-w-0">
              <h1 className="text-white font-bold text-base sm:text-lg">TaxaTool</h1>
              <p className="text-blue-200 text-[10px] sm:text-xs hidden sm:block">Taxateur Field Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Live data indicator */}
            <div className="hidden sm:flex items-center gap-1.5 bg-blue-900/50 rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-ntab-success rounded-full animate-pulse-dot" />
              <span className="text-[10px] text-blue-200">Live marktdata</span>
            </div>
            {/* Asset counter */}
            {completedAssets.length > 0 && (
              <button
                onClick={() => setShowAssetList(!showAssetList)}
                className="flex items-center gap-1.5 bg-ntab-accent/20 text-ntab-accent rounded-full px-3 py-1 text-xs font-medium hover:bg-ntab-accent/30 transition-colors"
              >
                📦 {completedAssets.length} asset{completedAssets.length !== 1 && 's'}
              </button>
            )}
            <div className="text-right">
              <div className="text-blue-200 text-[10px] sm:text-xs">Demo versie</div>
              <div className="text-white text-xs sm:text-sm font-medium">Maart 2026</div>
            </div>
          </div>
        </div>
      </header>

      {/* Session restored toast */}
      {sessionRestored && (
        <div className="bg-ntab-success text-white text-center text-sm py-2 animate-fade-in no-print">
          ✅ Sessie hersteld — {completedAssets.length} eerder getaxeerde asset{completedAssets.length !== 1 && 's'} geladen
        </div>
      )}

      {/* Step indicator */}
      <div className="bg-white border-b border-ntab-border shadow-sm no-print">
        <div className="max-w-5xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  onClick={() => goToStep(i)}
                  disabled={i > currentStep}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all ${
                    i === currentStep
                      ? 'bg-ntab-accent text-white font-semibold shadow-md scale-105'
                      : i < currentStep
                        ? 'bg-ntab-light text-ntab-primary font-medium cursor-pointer hover:bg-gray-200 hover:scale-102'
                        : 'text-ntab-text-light bg-gray-50 border border-gray-200 cursor-not-allowed'
                  }`}
                >
                  <span>{step.icon}</span>
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 sm:mx-2 transition-colors duration-500 ${i < currentStep ? 'bg-ntab-accent' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Asset list sidebar */}
      {showAssetList && completedAssets.length > 0 && (
        <div className="bg-white border-b border-ntab-border no-print animate-fade-in">
          <div className="max-w-5xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-ntab-primary">Getaxeerde Assets</h3>
              <div className="flex gap-2">
                <button onClick={clearSession} className="text-xs text-red-500 hover:text-red-700 transition-colors">Wis sessie</button>
                <button onClick={() => setShowAssetList(false)} className="text-xs text-ntab-text-light hover:text-ntab-text transition-colors">Sluiten ✕</button>
              </div>
            </div>
            <div className="space-y-1.5">
              {completedAssets.map(ca => (
                <div key={ca.id} className="flex items-center justify-between bg-ntab-light rounded-lg px-3 py-2 text-sm hover:bg-gray-100 transition-colors">
                  <div>
                    <span className="font-medium">{ca.asset.brand} {ca.asset.model}</span>
                    <span className="text-ntab-text-light ml-2">({ca.asset.year})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-ntab-primary">{formatCurrency(ca.adjustment.adjustedPrices.marktwaarde)}</span>
                    <button onClick={() => removeAsset(ca.id)} className="text-red-400 hover:text-red-600 text-xs transition-colors">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex-1 w-full">
        <div className="animate-fade-in" key={currentStep}>
          {currentStep === 0 && <AssetForm onSubmit={handleAssetSubmit} />}
          {currentStep === 1 && asset && <PriceEngine asset={asset} onComplete={handlePriceComplete} />}
          {currentStep === 2 && priceData && <TaxateurAdjust prices={priceData.prices} onComplete={handleAdjustComplete} />}
          {currentStep === 3 && adjustment && (
            <ReportPreview
              asset={asset}
              priceData={priceData}
              adjustment={adjustment}
              onSaveAsset={handleSaveAsset}
              onNewAsset={startNewAsset}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-ntab-primary mt-auto no-print">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between text-[10px] sm:text-xs text-blue-300 gap-1">
          <span>NTAB - Nederlands Taxatie &amp; Adviesbureau · Sinds 1904 · ISO 27001</span>
          <span>TaxaTool v0.2 Demo · Marktdata van {new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </footer>
    </div>
  )
}

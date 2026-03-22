import { useState } from 'react'
import AssetForm from './components/AssetForm'
import PriceEngine from './components/PriceEngine'
import TaxateurAdjust from './components/TaxateurAdjust'
import ReportPreview from './components/ReportPreview'

const steps = [
  { id: 'input', label: 'Asset Invoer', icon: '📋' },
  { id: 'analysis', label: 'Marktanalyse', icon: '🔍' },
  { id: 'adjust', label: 'Aanpassing', icon: '✏️' },
  { id: 'report', label: 'Rapport', icon: '📄' },
]

export default function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [asset, setAsset] = useState(null)
  const [priceData, setPriceData] = useState(null)
  const [adjustment, setAdjustment] = useState(null)

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

  function goToStep(stepIndex) {
    if (stepIndex < currentStep) setCurrentStep(stepIndex)
  }

  return (
    <div className="min-h-screen bg-ntab-light">
      {/* Header */}
      <header className="bg-ntab-primary shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-lg p-1.5">
              <div className="text-ntab-primary font-black text-lg leading-none tracking-tight">NTAB</div>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">TaxaTool</h1>
              <p className="text-blue-200 text-xs">Taxateur Field Assistant</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-blue-200 text-xs">Demo versie</div>
            <div className="text-white text-sm font-medium">Maart 2026</div>
          </div>
        </div>
      </header>

      {/* Step indicator */}
      <div className="bg-white border-b border-ntab-border shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  onClick={() => goToStep(i)}
                  disabled={i > currentStep}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                    i === currentStep
                      ? 'bg-ntab-accent text-white font-semibold shadow-md'
                      : i < currentStep
                        ? 'bg-ntab-light text-ntab-primary font-medium cursor-pointer hover:bg-gray-200'
                        : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span>{step.icon}</span>
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${i < currentStep ? 'bg-ntab-accent' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {currentStep === 0 && <AssetForm onSubmit={handleAssetSubmit} />}
        {currentStep === 1 && asset && <PriceEngine asset={asset} onComplete={handlePriceComplete} />}
        {currentStep === 2 && priceData && <TaxateurAdjust prices={priceData.prices} onComplete={handleAdjustComplete} />}
        {currentStep === 3 && adjustment && <ReportPreview asset={asset} priceData={priceData} adjustment={adjustment} />}
      </main>

      {/* Footer */}
      <footer className="bg-ntab-primary mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between text-xs text-blue-300">
          <span>NTAB - Nederlands Taxatie & Adviesbureau · Sinds 1904</span>
          <span>TaxaTool v0.1 Demo</span>
        </div>
      </footer>
    </div>
  )
}

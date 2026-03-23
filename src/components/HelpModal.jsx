export default function HelpModal({ onClose }) {
  const steps = [
    {
      nr: 1,
      title: 'Asset Invoer',
      description: 'Identificeer het object: selecteer categorie, merk, model, bouwjaar en beoordeel de conditie. Voeg optioneel foto\'s toe voor documentatie.',
      buttonColor: 'bg-ntab-accent text-white',
    },
    {
      nr: 2,
      title: 'Marktanalyse',
      description: 'TaxaTool doorzoekt automatisch marktplaatsen (Mascus, Troostwijk, BVA Auctions) en de NTAB Waardedatabase voor vergelijkbare objecten. U ontvangt een prijssuggestie per waardebegrip.',
      buttonColor: 'bg-gray-50 border border-gray-200 text-ntab-text-light',
    },
    {
      nr: 3,
      title: 'Taxateur Aanpassing',
      description: 'Pas de gesuggereerde waardes aan op basis van uw expertise en locatiebezoek. Voeg een onderbouwing toe met reden en notities.',
      buttonColor: 'bg-gray-50 border border-gray-200 text-ntab-text-light',
    },
    {
      nr: 4,
      title: 'Rapport',
      description: 'Genereer een RICS/TMV-conform taxatierapport met volledige bronvermelding. Exporteer als PDF of sla op in uw sessie voor meerdere assets.',
      buttonColor: 'bg-gray-50 border border-gray-200 text-ntab-text-light',
    },
  ]

  const valueTerms = [
    { term: 'Liquidatiewaarde', desc: 'Opbrengst bij gedwongen openbare verkoop (WHOA-relevant)' },
    { term: 'Marktwaarde', desc: 'Waarde bij normale transactie tussen bereidwillige partijen' },
    { term: 'Onderhandse verkoopwaarde', desc: 'Waarde bij vrijwillige, niet-gedwongen verkoop' },
    { term: 'Vervangingswaarde', desc: 'Kosten om het object te vervangen met economisch equivalent' },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-ntab-primary text-white p-5 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Hoe werkt TaxaTool?</h2>
              <p className="text-blue-200 text-sm mt-1">Taxateur Field Assistant — stap voor stap</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Visual step bar — mirrors the real navigation */}
          <div>
            <h3 className="text-sm font-semibold text-ntab-text-light uppercase tracking-wider mb-3">Navigatiebalk</h3>
            <div className="flex items-center gap-0 bg-white rounded-xl border border-ntab-border p-2">
              {steps.map((step, i) => (
                <div key={step.nr} className="flex items-center flex-1">
                  <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs ${step.buttonColor}`}>
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold shrink-0 ${
                      i === 0 ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>{step.nr}</span>
                    <span className="hidden sm:inline">{step.title}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex-1 h-0.5 mx-1 bg-gray-200" />
                  )}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-ntab-text-light mt-1.5 italic">
              Dit is hoe de navigatiebalk eruitziet. Stap 1 (oranje) is actief. Volgende stappen worden beschikbaar na voltooiing.
            </p>
          </div>

          {/* Process steps with matching visual */}
          <div>
            <h3 className="text-sm font-semibold text-ntab-text-light uppercase tracking-wider mb-3">Werkproces</h3>
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={step.nr} className="flex gap-3 items-start">
                  {/* Step number styled like the nav bar buttons */}
                  <div className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                    i === 0 ? 'bg-ntab-accent text-white' : 'bg-ntab-primary text-white'
                  }`}>
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-white/25 text-[10px] font-bold">{step.nr}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-ntab-text text-sm">{step.title}</div>
                    <div className="text-xs text-ntab-text-light mt-0.5 leading-relaxed">{step.description}</div>
                  </div>
                  {/* Arrow to next */}
                  {i < steps.length - 1 && (
                    <div className="hidden sm:flex shrink-0 self-center text-ntab-text-light">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick visual flow */}
          <div className="bg-ntab-light rounded-xl p-4">
            <h3 className="text-sm font-semibold text-ntab-primary mb-2">Snelle samenvatting</h3>
            <div className="flex items-center justify-center gap-1 text-xs flex-wrap">
              <span className="bg-ntab-accent text-white px-2 py-1 rounded font-medium">1 Invoer</span>
              <span className="text-ntab-text-light">→</span>
              <span className="bg-ntab-primary text-white px-2 py-1 rounded font-medium">2 Analyse</span>
              <span className="text-ntab-text-light">→</span>
              <span className="bg-ntab-primary text-white px-2 py-1 rounded font-medium">3 Aanpassing</span>
              <span className="text-ntab-text-light">→</span>
              <span className="bg-ntab-primary text-white px-2 py-1 rounded font-medium">4 Rapport</span>
              <span className="text-ntab-text-light">→</span>
              <span className="bg-ntab-success text-white px-2 py-1 rounded font-medium">PDF</span>
            </div>
          </div>

          {/* Value terms */}
          <div>
            <h3 className="text-sm font-semibold text-ntab-text-light uppercase tracking-wider mb-3">Waardebegrippen</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {valueTerms.map(vt => (
                <div key={vt.term} className="bg-ntab-light rounded-lg p-3">
                  <div className="font-semibold text-ntab-primary text-sm">{vt.term}</div>
                  <div className="text-xs text-ntab-text-light mt-0.5">{vt.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Data sources */}
          <div>
            <h3 className="text-sm font-semibold text-ntab-text-light uppercase tracking-wider mb-3">Databronnen</h3>
            <div className="flex flex-wrap gap-2">
              {['Mascus.nl', 'Troostwijk Auctions', 'BVA Auctions', 'Machineseeker.nl', 'Ritchie Bros', 'TractorPool.nl', 'NTAB Waardedatabase'].map(src => (
                <span key={src} className="text-xs bg-ntab-light text-ntab-text px-2.5 py-1 rounded-full border border-ntab-border">
                  {src}
                </span>
              ))}
            </div>
          </div>

          {/* Ecosystem */}
          <div className="border-t border-ntab-border pt-4">
            <h3 className="text-sm font-semibold text-ntab-text-light uppercase tracking-wider mb-2">NTAB Ecosysteem</h3>
            <p className="text-xs text-ntab-text-light leading-relaxed">
              TaxaTool is ontworpen als onderdeel van het NTAB digitaal ecosysteem, complementair aan
              Smart Stock (voorraadbeheer) en NTAB Alcore (debiteurenbeheer). Samen bieden deze tools
              volledige dekking van alle asset-categorieën.
            </p>
          </div>

          {/* Footer */}
          <div className="text-center pt-2">
            <button
              onClick={onClose}
              className="bg-ntab-accent hover:bg-orange-800 text-white font-semibold py-2.5 px-8 rounded-xl transition-all hover:shadow-md text-sm"
            >
              Aan de slag
            </button>
            <p className="text-[10px] text-ntab-text-light mt-3">
              NTAB · Nederlands Taxatie &amp; Adviesbureau · Sinds 1904 · ISO 27001
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

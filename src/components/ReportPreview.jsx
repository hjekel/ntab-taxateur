import { useState, useRef } from 'react'
import { jsPDF } from 'jspdf'
import NtabLogo from './NtabLogo'
import { formatCurrency } from '../utils/priceCalculator'
import { categories, conditionLabels } from '../data/categories'

const valueTypeLabels = {
  liquidatiewaarde: 'Liquidatiewaarde',
  marktwaarde: 'Marktwaarde',
  onderhandseVerkoopwaarde: 'Onderhandse verkoopwaarde',
  vervangingswaarde: 'Vervangingswaarde',
}

export default function ReportPreview({ asset, priceData, adjustment, onSaveAsset, onNewAsset }) {
  const [exporting, setExporting] = useState(false)
  const [saved, setSaved] = useState(false)
  const reportRef = useRef(null)

  const categoryLabel = categories.find(c => c.id === asset.category)?.label || asset.category
  const subcategoryLabel = categories
    .find(c => c.id === asset.category)
    ?.subcategories.find(s => s.id === asset.subcategory)?.label || asset.subcategory
  const conditionLabel = conditionLabels.find(c => c.value === asset.condition)?.label || asset.condition
  const reportNr = useRef(Math.floor(Math.random() * 9000 + 1000))

  const today = new Date().toLocaleDateString('nl-NL', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  async function handleExport() {
    setExporting(true)
    try {
      const pdf = new jsPDF('p', 'mm', 'a4')
      const W = pdf.internal.pageSize.getWidth()    // 210
      const H = pdf.internal.pageSize.getHeight()    // 297
      const M = 20 // margin
      const cw = W - 2 * M // content width
      let y = M

      // Colors
      const blue = [0, 51, 153]     // #003399
      const orange = [224, 85, 0]   // #E05500
      const darkText = [51, 51, 51]
      const lightText = [102, 102, 102]

      // ── HEADER BAR ──
      pdf.setFillColor(...blue)
      pdf.rect(0, 0, W, 40, 'F')

      // NTAB logo block — 2x2 grid: NT blue, A red, B blue
      const logoX = M
      const logoY = 8
      const cellW = 11
      const cellH = 11
      const ntabBlue = [26, 43, 94]   // #1a2b5e
      const ntabRed = [196, 30, 58]    // #c41e3a
      // White background
      pdf.setFillColor(255, 255, 255)
      pdf.roundedRect(logoX, logoY, cellW * 2 + 2, cellH * 2 + 2, 2, 2, 'F')
      // Letters
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(12)
      // N (blue)
      pdf.setTextColor(...ntabBlue)
      pdf.text('N', logoX + 1 + cellW / 2, logoY + 1 + cellH / 2 + 2, { align: 'center' })
      // T (blue)
      pdf.text('T', logoX + 1 + cellW + cellW / 2, logoY + 1 + cellH / 2 + 2, { align: 'center' })
      // A (red)
      pdf.setTextColor(...ntabRed)
      pdf.text('A', logoX + 1 + cellW / 2, logoY + 1 + cellH + cellH / 2 + 2, { align: 'center' })
      // B (blue)
      pdf.setTextColor(...ntabBlue)
      pdf.text('B', logoX + 1 + cellW + cellW / 2, logoY + 1 + cellH + cellH / 2 + 2, { align: 'center' })

      // Title text
      pdf.setTextColor(255, 255, 255)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(18)
      pdf.text('Taxatierapport', M + 30, 16)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.text('NTAB - Nederlands Taxatie & Adviesbureau', M + 30, 23)
      pdf.text('Opgericht 1904 \u00b7 ISO 27001 gecertificeerd', M + 30, 29)

      // Right side - report info
      pdf.setFontSize(8)
      pdf.text(`Rapport #${reportNr.current}`, W - M, 16, { align: 'right' })
      pdf.text(today, W - M, 23, { align: 'right' })

      y = 50

      // ── Helper functions ──
      function sectionHeader(title) {
        pdf.setFillColor(...blue)
        pdf.rect(M, y, cw, 7, 'F')
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(10)
        pdf.setTextColor(255, 255, 255)
        pdf.text(title, M + 3, y + 5)
        y += 11
      }

      function row(label, value, bold = false) {
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(9)
        pdf.setTextColor(...lightText)
        pdf.text(label, M + 2, y)
        pdf.setTextColor(...darkText)
        if (bold) pdf.setFont('helvetica', 'bold')
        pdf.text(String(value), M + 60, y)
        y += 5.5
      }

      function checkPage(need = 20) {
        if (y + need > H - 25) {
          addPageFooter()
          pdf.addPage()
          y = M
        }
      }

      let pageNum = 1
      function addPageFooter() {
        pdf.setFillColor(...blue)
        pdf.rect(0, H - 12, W, 12, 'F')
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(7)
        pdf.setTextColor(200, 200, 220)
        pdf.text('NTAB - Nederlands Taxatie & Adviesbureau \u00b7 Sinds 1904 \u00b7 Vertrouwelijk', M, H - 5)
        pdf.text(`Pagina ${pageNum}`, W - M, H - 5, { align: 'right' })
        pageNum++
      }

      // ── 1. OBJECT IDENTIFICATIE ──
      sectionHeader('1. Object Identificatie')
      row('Categorie:', categoryLabel)
      row('Subcategorie:', subcategoryLabel)
      row('Merk:', asset.brand, true)
      row('Model:', asset.model, true)
      row('Bouwjaar:', String(asset.year))
      row('Draaiuren:', asset.hours ? asset.hours.toLocaleString('nl-NL') : 'Onbekend')
      row('Conditie:', `${conditionLabel} (${asset.condition}/5)`)
      if (asset.notes) {
        y += 2
        row('Opmerkingen:', asset.notes)
      }
      y += 6

      // ── 2. WAARDEBEPALING ──
      checkPage(45)
      sectionHeader('2. Waardebepaling')

      // Table header
      pdf.setFillColor(240, 242, 245)
      pdf.rect(M, y - 1, cw, 7, 'F')
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(8)
      pdf.setTextColor(...darkText)
      pdf.text('Waardebegrip', M + 3, y + 4)
      pdf.text('AI-suggestie', M + 75, y + 4, { align: 'right' })
      pdf.text('Taxateur', M + 110, y + 4, { align: 'right' })
      pdf.text('Verschil', M + cw - 2, y + 4, { align: 'right' })
      y += 9

      // Table rows
      Object.entries(valueTypeLabels).forEach(([key, label]) => {
        const suggested = priceData.prices[key].mid
        const adjusted = adjustment.adjustedPrices[key]
        const diff = adjusted - suggested
        const diffPct = suggested > 0 ? Math.round((diff / suggested) * 100) : 0

        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(9)
        pdf.setTextColor(...darkText)
        pdf.text(label, M + 3, y)
        pdf.setTextColor(...lightText)
        pdf.text(formatCurrency(suggested), M + 75, y, { align: 'right' })
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(...blue)
        pdf.text(formatCurrency(adjusted), M + 110, y, { align: 'right' })

        if (diff !== 0) {
          pdf.setFont('helvetica', 'normal')
          pdf.setFontSize(8)
          pdf.setTextColor(diff > 0 ? 34 : 220, diff > 0 ? 139 : 38, diff > 0 ? 34 : 38)
          pdf.text(`${diff > 0 ? '+' : ''}${diffPct}%`, M + cw - 2, y, { align: 'right' })
        } else {
          pdf.setTextColor(...lightText)
          pdf.setFontSize(8)
          pdf.text('\u2013', M + cw - 2, y, { align: 'right' })
        }

        // Separator line
        y += 2
        pdf.setDrawColor(230, 230, 230)
        pdf.line(M, y, M + cw, y)
        y += 5
      })
      y += 4

      // ── 3. ONDERBOUWING ──
      checkPage(30)
      sectionHeader('3. Onderbouwing')
      row('Reden aanpassing:', adjustment.reason)
      row('Betrouwbaarheid:', `${adjustment.confidence}%`)
      if (adjustment.notes) {
        y += 2
        pdf.setFillColor(245, 247, 250)
        const noteLines = pdf.splitTextToSize(adjustment.notes, cw - 10)
        const noteH = noteLines.length * 4.5 + 8
        pdf.roundedRect(M, y, cw, noteH, 2, 2, 'F')
        pdf.setFont('helvetica', 'italic')
        pdf.setFontSize(7)
        pdf.setTextColor(...lightText)
        pdf.text('Taxateur notities:', M + 4, y + 5)
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(8)
        pdf.setTextColor(...darkText)
        pdf.text(noteLines, M + 4, y + 10)
        y += noteH + 4
      }
      y += 4

      // ── 4. BRONVERMELDING ──
      checkPage(30)
      sectionHeader('4. Bronvermelding')
      row('Marktlistings geraadpleegd:', String(priceData.prices.dataPoints.marketListings))
      row('Historische taxaties:', String(priceData.prices.dataPoints.historicalTaxaties))
      row('Veilingresultaten:', String(priceData.prices.dataPoints.veilingResultaten))
      y += 2
      pdf.setFont('helvetica', 'italic')
      pdf.setFontSize(7)
      pdf.setTextColor(...lightText)
      const bronLines = pdf.splitTextToSize('Bronnen: Mascus.nl, Troostwijk Auctions, BVA Auctions, Machineseeker.nl, Ritchie Bros, TractorPool.nl, NTAB Waardedatabase', cw - 4)
      pdf.text(bronLines, M + 2, y)
      y += bronLines.length * 4 + 4

      // ── ECOSYSTEEM ──
      checkPage(16)
      pdf.setFillColor(245, 247, 250)
      pdf.roundedRect(M, y, cw, 12, 2, 2, 'F')
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(7)
      pdf.setTextColor(...blue)
      pdf.text('Onderdeel van NTAB digitaal ecosysteem', M + 4, y + 5)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(6.5)
      pdf.setTextColor(...lightText)
      pdf.text('Complementair aan Smart Stock voorraadbeheer \u00b7 Integratie met NTAB Alcore debiteurenbeheer', M + 4, y + 10)
      y += 16

      // ── DISCLAIMER ──
      checkPage(20)
      pdf.setDrawColor(...orange)
      pdf.setLineWidth(0.5)
      pdf.line(M, y, M + cw, y)
      y += 5
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(6.5)
      pdf.setTextColor(...lightText)
      const disclaimer = 'Disclaimer: Dit taxatierapport is opgesteld conform de richtlijnen van RICS en TMV. De genoemde waardes zijn gebaseerd op marktonderzoek, historische data en professioneel oordeel van de taxateur. NTAB aanvaardt geen aansprakelijkheid voor beslissingen die uitsluitend op dit rapport zijn gebaseerd. Dit is een demonstratieversie.'
      const discLines = pdf.splitTextToSize(disclaimer, cw)
      pdf.text(discLines, M, y)

      // Footer
      addPageFooter()

      pdf.save(`NTAB_Taxatierapport_${asset.brand}_${asset.model}_${reportNr.current}.pdf`)
    } catch (err) {
      console.error('PDF export error:', err)
      alert(`PDF export mislukt: ${err.message}\n\nProbeer Ctrl+P (Print) als alternatief.`)
    } finally {
      setExporting(false)
    }
  }

  function handleSave() {
    onSaveAsset?.()
    setSaved(true)
  }

  function handleNewTaxatie() {
    // Auto-save current asset before starting new one
    if (!saved) {
      onSaveAsset?.()
    }
    onNewAsset?.()
  }

  function handlePrint() {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Report */}
      <div ref={reportRef} className="bg-white rounded-xl shadow-lg border border-ntab-border overflow-hidden" id="ntab-report">
        {/* Header */}
        <div className="bg-ntab-primary text-white p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <NtabLogo size="md" variant="light" />
              </div>
              <div>
                <div className="text-xs sm:text-sm opacity-75 mb-1">NTAB - Nederlands Taxatie &amp; Adviesbureau</div>
                <h1 className="text-xl sm:text-2xl font-bold">Taxatierapport</h1>
                <div className="text-xs sm:text-sm opacity-75 mt-1">Opgericht 1904 · ISO 27001 gecertificeerd</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-bold opacity-20">NTAB</div>
              <div className="text-xs sm:text-sm opacity-75">Rapport #{reportNr.current}</div>
              <div className="text-xs sm:text-sm opacity-75">{today}</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          {/* Asset info */}
          <section>
            <h2 className="text-base sm:text-lg font-semibold text-ntab-primary border-b-2 border-ntab-accent pb-1 mb-3">
              1. Object Identificatie
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
              <div><span className="text-ntab-text-light">Categorie:</span> <span className="font-medium">{categoryLabel}</span></div>
              <div><span className="text-ntab-text-light">Subcategorie:</span> <span className="font-medium">{subcategoryLabel}</span></div>
              <div><span className="text-ntab-text-light">Merk:</span> <span className="font-medium">{asset.brand}</span></div>
              <div><span className="text-ntab-text-light">Model:</span> <span className="font-medium">{asset.model}</span></div>
              <div><span className="text-ntab-text-light">Bouwjaar:</span> <span className="font-medium">{asset.year}</span></div>
              <div><span className="text-ntab-text-light">Draaiuren:</span> <span className="font-medium">{asset.hours ? asset.hours.toLocaleString('nl-NL') : 'Onbekend'}</span></div>
              <div><span className="text-ntab-text-light">Conditie:</span> <span className="font-medium">{conditionLabel} ({asset.condition}/5)</span></div>
            </div>
            {asset.notes && (
              <div className="mt-2 text-sm"><span className="text-ntab-text-light">Opmerkingen:</span> {asset.notes}</div>
            )}
          </section>

          {/* Waardetabel */}
          <section>
            <h2 className="text-base sm:text-lg font-semibold text-ntab-primary border-b-2 border-ntab-accent pb-1 mb-3">
              2. Waardebepaling
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-ntab-light">
                    <th className="text-left py-2 px-3 font-medium text-ntab-text">Waardebegrip</th>
                    <th className="text-right py-2 px-3 font-medium text-ntab-text">AI-suggestie</th>
                    <th className="text-right py-2 px-3 font-medium text-ntab-text">Taxateur</th>
                    <th className="text-right py-2 px-3 font-medium text-ntab-text">Verschil</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(valueTypeLabels).map(([key, label]) => {
                    const suggested = priceData.prices[key].mid
                    const adjusted = adjustment.adjustedPrices[key]
                    const diff = adjusted - suggested
                    const diffPct = suggested > 0 ? Math.round((diff / suggested) * 100) : 0
                    return (
                      <tr key={key} className="border-b border-gray-100">
                        <td className="py-2 px-3 font-medium whitespace-nowrap">{label}</td>
                        <td className="py-2 px-3 text-right text-ntab-text-light whitespace-nowrap">{formatCurrency(suggested)}</td>
                        <td className="py-2 px-3 text-right font-bold text-ntab-primary whitespace-nowrap">{formatCurrency(adjusted)}</td>
                        <td className={`py-2 px-3 text-right text-xs whitespace-nowrap ${diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                          {diff !== 0 ? `${diff > 0 ? '+' : ''}${diffPct}%` : '–'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Onderbouwing */}
          <section>
            <h2 className="text-base sm:text-lg font-semibold text-ntab-primary border-b-2 border-ntab-accent pb-1 mb-3">
              3. Onderbouwing
            </h2>
            <div className="text-sm space-y-2">
              <div><span className="text-ntab-text-light">Reden aanpassing:</span> <span className="font-medium">{adjustment.reason}</span></div>
              <div><span className="text-ntab-text-light">Betrouwbaarheid:</span> <span className="font-medium">{adjustment.confidence}%</span></div>
              {adjustment.notes && (
                <div className="bg-ntab-light rounded-lg p-3 mt-2">
                  <span className="text-ntab-text-light block mb-1">Taxateur notities:</span>
                  <span className="font-medium">{adjustment.notes}</span>
                </div>
              )}
            </div>
          </section>

          {/* Bronnen */}
          <section>
            <h2 className="text-base sm:text-lg font-semibold text-ntab-primary border-b-2 border-ntab-accent pb-1 mb-3">
              4. Bronvermelding
            </h2>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-ntab-text-light">Marktlistings geraadpleegd:</span>
                <span className="font-medium">{priceData.prices.dataPoints.marketListings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ntab-text-light">Historische taxaties:</span>
                <span className="font-medium">{priceData.prices.dataPoints.historicalTaxaties}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ntab-text-light">Veilingresultaten:</span>
                <span className="font-medium">{priceData.prices.dataPoints.veilingResultaten}</span>
              </div>
              <div className="mt-2 text-xs text-ntab-text-light">
                Bronnen: Mascus.nl, Troostwijk Auctions, BVA Auctions, Machineseeker.nl, Ritchie Bros, TractorPool.nl, NTAB Waardedatabase
              </div>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="border-t-2 border-ntab-border pt-4">
            <p className="text-xs text-ntab-text-light leading-relaxed">
              <strong>Disclaimer:</strong> Dit taxatierapport is opgesteld conform de richtlijnen van RICS en TMV.
              De genoemde waardes zijn gebaseerd op marktonderzoek, historische data en professioneel oordeel van
              de taxateur. NTAB aanvaardt geen aansprakelijkheid voor beslissingen die uitsluitend op dit rapport
              zijn gebaseerd. Dit is een demonstratieversie.
            </p>
          </section>
        </div>

        {/* Ecosystem footer */}
        <div className="bg-ntab-light border-t border-ntab-border px-4 sm:px-6 py-3">
          <div className="text-xs font-medium text-ntab-primary">Onderdeel van NTAB digitaal ecosysteem</div>
          <div className="text-[10px] text-ntab-text-light mt-0.5">Complementair aan Smart Stock voorraadbeheer · Integratie met NTAB Alcore debiteurenbeheer</div>
        </div>

        {/* Footer */}
        <div className="bg-ntab-primary text-white px-4 sm:px-6 py-3 flex justify-between text-xs opacity-75">
          <span>NTAB - Nederlands Taxatie &amp; Adviesbureau · Sinds 1904</span>
          <span>Vertrouwelijk</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 no-print">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex-1 bg-ntab-primary hover:bg-blue-900 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          {exporting ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Exporteren...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Exporteer als PDF
            </>
          )}
        </button>
        <button
          onClick={handlePrint}
          className="flex-1 bg-white hover:bg-gray-50 text-ntab-primary font-semibold py-3 px-6 rounded-xl border-2 border-ntab-primary transition-all hover:shadow-md hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Print
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 no-print">
        {!saved ? (
          <button
            onClick={handleSave}
            className="flex-1 bg-ntab-success hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Opslaan in sessie
          </button>
        ) : (
          <div className="flex-1 bg-ntab-success/10 text-ntab-success font-semibold py-3 px-6 rounded-xl border border-ntab-success/30 flex items-center justify-center gap-2">
            ✅ Opgeslagen
          </div>
        )}
        <button
          onClick={handleNewTaxatie}
          className="flex-1 bg-ntab-accent hover:bg-orange-800 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          {saved ? 'Nieuwe Taxatie' : 'Opslaan & Nieuwe Taxatie'}
        </button>
      </div>
    </div>
  )
}

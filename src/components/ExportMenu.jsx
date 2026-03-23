import { useState } from 'react'
import { useI18n } from '../i18n'
import { formatCurrency } from '../utils/priceCalculator'
import { categories, conditionLabels } from '../data/categories'

const valueTypeLabels = {
  liquidatiewaarde: { nl: 'Liquidatiewaarde', en: 'Liquidation Value' },
  marktwaarde: { nl: 'Marktwaarde', en: 'Market Value' },
  onderhandseVerkoopwaarde: { nl: 'Onderhandse verkoopwaarde', en: 'Private Sale Value' },
  vervangingswaarde: { nl: 'Vervangingswaarde', en: 'Replacement Value' },
}

export default function ExportMenu({ asset, priceData, adjustment, reportNr }) {
  const { lang, t } = useI18n()
  const [showMenu, setShowMenu] = useState(false)

  const categoryLabel = categories.find(c => c.id === asset.category)?.label || asset.category
  const subcategoryLabel = categories
    .find(c => c.id === asset.category)
    ?.subcategories.find(s => s.id === asset.subcategory)?.label || asset.subcategory
  const conditionLabel = conditionLabels.find(c => c.value === asset.condition)?.label || asset.condition
  const today = new Date().toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  const filename = `NTAB_${t('taxationReport')}_${asset.brand}_${asset.model}_${reportNr}`

  function getReportData() {
    const rows = []
    Object.entries(valueTypeLabels).forEach(([key, labels]) => {
      rows.push({
        concept: labels[lang],
        aiSuggestion: priceData.prices[key].mid,
        taxateur: adjustment.adjustedPrices[key],
        diff: adjustment.adjustedPrices[key] - priceData.prices[key].mid,
      })
    })
    return rows
  }

  function exportMarkdown() {
    const rows = getReportData()
    const md = `# ${t('taxationReport')}
**NTAB - Nederlands Taxatie & Adviesbureau**
${t('reportNr')} #${reportNr} · ${today}

---

## ${t('objectIdentification')}

| | |
|---|---|
| ${t('category')} | ${categoryLabel} |
| ${t('subcategory')} | ${subcategoryLabel} |
| ${t('brand')} | **${asset.brand}** |
| ${t('model')} | **${asset.model}** |
| ${t('buildYear')} | ${asset.year} |
| ${t('hours')} | ${asset.hours ? asset.hours.toLocaleString() : t('unknown')} |
| ${t('conditionAssessment')} | ${conditionLabel} (${asset.condition}/5) |
${asset.notes ? `| ${t('remarks')} | ${asset.notes} |` : ''}

## ${t('valuation')}

| ${t('valueConcept')} | ${t('aiSuggestion')} | ${t('taxateur')} | ${t('difference')} |
|---|---:|---:|---:|
${rows.map(r => {
  const diffPct = r.aiSuggestion > 0 ? Math.round((r.diff / r.aiSuggestion) * 100) : 0
  return `| ${r.concept} | ${formatCurrency(r.aiSuggestion)} | **${formatCurrency(r.taxateur)}** | ${r.diff !== 0 ? `${r.diff > 0 ? '+' : ''}${diffPct}%` : '–'} |`
}).join('\n')}

## ${t('justificationSection')}

- **${t('adjustmentReasonLabel')}:** ${adjustment.reason}
- **${t('reliability')}:** ${adjustment.confidence}%
${adjustment.notes ? `\n> ${adjustment.notes}` : ''}

## ${t('sourceAttribution')}

- ${t('marketListingsConsulted')}: ${priceData.prices.dataPoints.marketListings}
- ${t('historicalTaxationsLabel')}: ${priceData.prices.dataPoints.historicalTaxaties}
- ${t('auctionResultsLabel')}: ${priceData.prices.dataPoints.veilingResultaten}

${t('sources')}: Mascus.nl, Troostwijk Auctions, BVA Auctions, Machineseeker.nl, Ritchie Bros, TractorPool.nl, NTAB Waardedatabase

---

*${t('ecosystemTitle')}*
*${t('ecosystemDesc')}*

**${t('disclaimer')}:** ${t('disclaimerText')}

---
NTAB · ${t('established')} · ${t('isoCertified')} · ${t('confidential')}
`
    downloadFile(md, `${filename}.md`, 'text/markdown')
    setShowMenu(false)
  }

  function exportCsv() {
    const rows = getReportData()
    const sep = ';' // Excel-friendly in NL
    const header = [t('valueConcept'), t('aiSuggestion'), t('taxateur'), t('difference') + ' (%)', t('brand'), t('model'), t('buildYear'), t('hours'), t('conditionAssessment'), t('adjustmentReasonLabel'), t('reliability') + ' (%)', t('reportNr')]
    const data = rows.map(r => {
      const diffPct = r.aiSuggestion > 0 ? Math.round((r.diff / r.aiSuggestion) * 100) : 0
      return [r.concept, r.aiSuggestion, r.taxateur, diffPct, asset.brand, asset.model, asset.year, asset.hours || '', `${conditionLabel} (${asset.condition}/5)`, adjustment.reason, adjustment.confidence, reportNr]
    })
    const csv = [header.join(sep), ...data.map(row => row.join(sep))].join('\n')
    // BOM for Excel UTF-8 support
    downloadFile('\uFEFF' + csv, `${filename}.csv`, 'text/csv;charset=utf-8')
    setShowMenu(false)
  }

  function exportExcel() {
    // Simple XML-based Excel format (opens in Excel without dependencies)
    const rows = getReportData()
    const xmlRows = rows.map(r => {
      const diffPct = r.aiSuggestion > 0 ? Math.round((r.diff / r.aiSuggestion) * 100) : 0
      return `<Row>
        <Cell><Data ss:Type="String">${r.concept}</Data></Cell>
        <Cell><Data ss:Type="Number">${r.aiSuggestion}</Data></Cell>
        <Cell><Data ss:Type="Number">${r.taxateur}</Data></Cell>
        <Cell><Data ss:Type="Number">${diffPct}</Data></Cell>
      </Row>`
    }).join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="header"><Font ss:Bold="1"/><Interior ss:Color="#003399" ss:Pattern="Solid"/><Font ss:Color="#FFFFFF" ss:Bold="1"/></Style>
    <Style ss:ID="bold"><Font ss:Bold="1"/></Style>
    <Style ss:ID="currency"><NumberFormat ss:Format="€#,##0"/></Style>
  </Styles>
  <Worksheet ss:Name="${t('taxationReport')}">
    <Table>
      <Column ss:Width="180"/>
      <Column ss:Width="120"/>
      <Column ss:Width="120"/>
      <Column ss:Width="80"/>
      <Row ss:StyleID="header">
        <Cell><Data ss:Type="String">${t('valueConcept')}</Data></Cell>
        <Cell><Data ss:Type="String">${t('aiSuggestion')}</Data></Cell>
        <Cell><Data ss:Type="String">${t('taxateur')}</Data></Cell>
        <Cell><Data ss:Type="String">${t('difference')} (%)</Data></Cell>
      </Row>
      ${xmlRows}
      <Row/>
      <Row ss:StyleID="bold">
        <Cell><Data ss:Type="String">${t('brand')}</Data></Cell>
        <Cell><Data ss:Type="String">${asset.brand}</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">${t('model')}</Data></Cell>
        <Cell><Data ss:Type="String">${asset.model}</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">${t('buildYear')}</Data></Cell>
        <Cell><Data ss:Type="Number">${asset.year}</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">${t('hours')}</Data></Cell>
        <Cell><Data ss:Type="String">${asset.hours || t('unknown')}</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">${t('conditionAssessment')}</Data></Cell>
        <Cell><Data ss:Type="String">${conditionLabel} (${asset.condition}/5)</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">${t('adjustmentReasonLabel')}</Data></Cell>
        <Cell><Data ss:Type="String">${adjustment.reason}</Data></Cell>
      </Row>
      <Row>
        <Cell><Data ss:Type="String">${t('reliability')}</Data></Cell>
        <Cell><Data ss:Type="Number">${adjustment.confidence}</Data></Cell>
      </Row>
    </Table>
  </Worksheet>
</Workbook>`
    downloadFile(xml, `${filename}.xls`, 'application/vnd.ms-excel')
    setShowMenu(false)
  }

  function exportWord() {
    const rows = getReportData()
    const tableRows = rows.map(r => {
      const diffPct = r.aiSuggestion > 0 ? Math.round((r.diff / r.aiSuggestion) * 100) : 0
      return `<tr><td>${r.concept}</td><td style="text-align:right">${formatCurrency(r.aiSuggestion)}</td><td style="text-align:right;font-weight:bold;color:#003399">${formatCurrency(r.taxateur)}</td><td style="text-align:right">${r.diff !== 0 ? `${r.diff > 0 ? '+' : ''}${diffPct}%` : '–'}</td></tr>`
    }).join('')

    const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="UTF-8"><title>${t('taxationReport')}</title>
<style>
  body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #333; margin: 2cm; }
  h1 { color: #003399; font-size: 18pt; border-bottom: 3px solid #E05500; padding-bottom: 5pt; }
  h2 { color: #003399; font-size: 13pt; border-bottom: 1px solid #E05500; padding-bottom: 3pt; margin-top: 18pt; }
  table { border-collapse: collapse; width: 100%; margin: 10pt 0; }
  th { background: #003399; color: white; padding: 6pt 8pt; text-align: left; font-size: 10pt; }
  td { border-bottom: 1px solid #eee; padding: 5pt 8pt; font-size: 10pt; }
  .meta { color: #666; font-size: 9pt; }
  .note { background: #f5f7fa; padding: 8pt; border-radius: 4pt; margin-top: 8pt; font-style: italic; }
  .footer { margin-top: 24pt; padding-top: 8pt; border-top: 2px solid #003399; font-size: 8pt; color: #666; }
</style></head>
<body>
<div style="background:#003399;color:white;padding:16pt;margin:-2cm -2cm 16pt -2cm;">
  <div style="font-size:8pt;opacity:0.7">NTAB - Nederlands Taxatie & Adviesbureau</div>
  <div style="font-size:20pt;font-weight:bold;margin:4pt 0">${t('taxationReport')}</div>
  <div style="font-size:8pt;opacity:0.7">${t('established')} · ${t('isoCertified')}</div>
  <div style="float:right;margin-top:-40pt;font-size:9pt">${t('reportNr')} #${reportNr}<br/>${today}</div>
</div>

<h2>${t('objectIdentification')}</h2>
<table>
  <tr><td class="meta">${t('category')}:</td><td>${categoryLabel}</td><td class="meta">${t('subcategory')}:</td><td>${subcategoryLabel}</td></tr>
  <tr><td class="meta">${t('brand')}:</td><td><b>${asset.brand}</b></td><td class="meta">${t('model')}:</td><td><b>${asset.model}</b></td></tr>
  <tr><td class="meta">${t('buildYear')}:</td><td>${asset.year}</td><td class="meta">${t('hours')}:</td><td>${asset.hours ? asset.hours.toLocaleString() : t('unknown')}</td></tr>
  <tr><td class="meta">${t('conditionAssessment')}:</td><td>${conditionLabel} (${asset.condition}/5)</td><td></td><td></td></tr>
</table>
${asset.notes ? `<div class="note">${t('remarks')}: ${asset.notes}</div>` : ''}

<h2>${t('valuation')}</h2>
<table>
  <tr><th>${t('valueConcept')}</th><th style="text-align:right">${t('aiSuggestion')}</th><th style="text-align:right">${t('taxateur')}</th><th style="text-align:right">${t('difference')}</th></tr>
  ${tableRows}
</table>

<h2>${t('justificationSection')}</h2>
<p><span class="meta">${t('adjustmentReasonLabel')}:</span> <b>${adjustment.reason}</b></p>
<p><span class="meta">${t('reliability')}:</span> <b>${adjustment.confidence}%</b></p>
${adjustment.notes ? `<div class="note">${adjustment.notes}</div>` : ''}

<h2>${t('sourceAttribution')}</h2>
<p>${t('marketListingsConsulted')}: <b>${priceData.prices.dataPoints.marketListings}</b> · ${t('historicalTaxationsLabel')}: <b>${priceData.prices.dataPoints.historicalTaxaties}</b> · ${t('auctionResultsLabel')}: <b>${priceData.prices.dataPoints.veilingResultaten}</b></p>
<p class="meta">${t('sources')}: Mascus.nl, Troostwijk Auctions, BVA Auctions, Machineseeker.nl, Ritchie Bros, TractorPool.nl, NTAB Waardedatabase</p>

<div style="background:#f5f7fa;padding:8pt;margin-top:16pt;border-radius:4pt;">
  <b style="color:#003399">${t('ecosystemTitle')}</b><br/>
  <span class="meta">${t('ecosystemDesc')}</span>
</div>

<div class="footer">
  <b>${t('disclaimer')}:</b> ${t('disclaimerText')}
  <br/><br/>
  NTAB · ${t('established')} · ${t('isoCertified')} · ${t('confidential')}
</div>
</body></html>`

    downloadFile(html, `${filename}.doc`, 'application/msword')
    setShowMenu(false)
  }

  function downloadFile(content, name, type) {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formats = [
    { id: 'word', label: t('exportWord'), icon: '📝', color: 'text-blue-600', action: exportWord },
    { id: 'excel', label: t('exportExcel'), icon: '📊', color: 'text-green-600', action: exportExcel },
    { id: 'csv', label: t('exportCsv'), icon: '📋', color: 'text-gray-600', action: exportCsv },
    { id: 'md', label: t('exportMd'), icon: '📄', color: 'text-purple-600', action: exportMarkdown },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex-1 w-full bg-white hover:bg-gray-50 text-ntab-text font-semibold py-3 px-6 rounded-xl border-2 border-ntab-border transition-all hover:shadow-md hover:scale-[1.02] flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
        {t('exportFormats')}...
        <svg className={`w-4 h-4 transition-transform ${showMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>

      {showMenu && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-ntab-border overflow-hidden z-10 animate-fade-in">
          {formats.map(fmt => (
            <button
              key={fmt.id}
              onClick={fmt.action}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-ntab-light transition-colors text-left"
            >
              <span className="text-lg">{fmt.icon}</span>
              <span className={`font-medium ${fmt.color}`}>{fmt.label}</span>
              <span className="text-xs text-ntab-text-light ml-auto">.{fmt.id === 'word' ? 'doc' : fmt.id === 'excel' ? 'xls' : fmt.id}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

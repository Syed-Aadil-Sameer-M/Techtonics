import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ── helpers ──────────────────────────────────────────────────────────────────

export function downloadText(filename: string, content: string, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export function escapeCsv(value: unknown): string {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function downloadCsv(filename: string, headers: string[], rows: unknown[][]) {
  const csv = [headers, ...rows].map(row => row.map(escapeCsv).join(',')).join('\n');
  downloadText(filename, `\ufeff${csv}`, 'text/csv;charset=utf-8');
}

// ── date filter helpers ───────────────────────────────────────────────────────

export function filterByDateRange<T>(
  items: T[],
  getDate: (item: T) => string,
  from: string,
  to: string,
): T[] {
  if (!from && !to) return items;
  const start = from ? new Date(from).setHours(0, 0, 0, 0) : -Infinity;
  const end = to ? new Date(to).setHours(23, 59, 59, 999) : Infinity;
  return items.filter(item => {
    const t = new Date(getDate(item)).getTime();
    return t >= start && t <= end;
  });
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function formatExportTimestamp() {
  return new Date().toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ── Excel export ──────────────────────────────────────────────────────────────

export function downloadExcel(filename: string, sheetName: string, headers: string[], rows: unknown[][]) {
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  // Column widths
  ws['!cols'] = headers.map((h, i) => ({
    wch: Math.max(h.length + 2, ...rows.map(r => String(r[i] ?? '').length + 2), 12),
  }));

  // Header style (bold + background)
  headers.forEach((_, i) => {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
    if (ws[cellRef]) {
      ws[cellRef].s = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '0EA5E9' } },
        alignment: { horizontal: 'center' },
      };
    }
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}

// ── PDF export ────────────────────────────────────────────────────────────────

export function downloadPdf(
  filename: string,
  title: string,
  subtitle: string,
  headers: string[],
  rows: unknown[][],
  dateRange?: { from: string; to: string },
) {
  const doc = new jsPDF({ orientation: headers.length > 6 ? 'landscape' : 'portrait' });

  // Header bar
  doc.setFillColor(14, 165, 233); // sky-500
  doc.rect(0, 0, doc.internal.pageSize.width, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ProcureX', 14, 11);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(title, 14, 20);

  // Subtitle + date range
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  let y = 36;
  doc.text(subtitle, 14, y);

  if (dateRange?.from || dateRange?.to) {
    const rangeLabel = [
      dateRange.from ? `From: ${dateRange.from}` : '',
      dateRange.to ? `To: ${dateRange.to}` : '',
    ].filter(Boolean).join('   ');
    doc.text(rangeLabel, 14, (y += 6));
  }

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generated: ${formatExportTimestamp()}`, 14, (y += 6));

  // Table
  autoTable(doc, {
    head: [headers],
    body: rows.map(r => r.map(v => String(v ?? '—'))),
    startY: y + 6,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: {
      fillColor: [14, 165, 233],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: { fillColor: [245, 250, 255] },
    margin: { left: 14, right: 14 },
  });

  // Page numbers
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 8,
      { align: 'center' },
    );
  }

  doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}

// ── legacy print helper (kept for compatibility) ──────────────────────────────

export function downloadPrintableDocument(title: string, body: string, filename: string) {
  const printWindow = window.open('', '_blank', 'noopener,noreferrer');
  if (!printWindow) return;
  printWindow.document.write(`<!doctype html><html><head><title>${title}</title><style>body{font-family:Arial,sans-serif;color:#172033;padding:40px;line-height:1.5}h1{margin-bottom:4px}table{width:100%;border-collapse:collapse;margin-top:24px}th,td{text-align:left;padding:10px;border-bottom:1px solid #d9e1ea}th{background:#f3f6f9}</style></head><body>${body}</body></html>`);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

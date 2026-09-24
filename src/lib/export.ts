export function downloadText(filename: string, content: string, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
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

export function downloadPrintableDocument(title: string, body: string, filename: string) {
  const printWindow = window.open('', '_blank', 'noopener,noreferrer');
  if (!printWindow) return;
  printWindow.document.write(`<!doctype html><html><head><title>${title}</title><style>body{font-family:Arial,sans-serif;color:#172033;padding:40px;line-height:1.5}h1{margin-bottom:4px}table{width:100%;border-collapse:collapse;margin-top:24px}th,td{text-align:left;padding:10px;border-bottom:1px solid #d9e1ea}th{background:#f3f6f9}</style></head><body>${body}</body></html>`);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

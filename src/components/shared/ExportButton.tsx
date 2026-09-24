import { Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ExportButtonProps {
  onCsv: () => void;
  onPrint?: () => void;
}

export function ExportButton({ onCsv, onPrint }: ExportButtonProps) {
  return <div className="flex items-center gap-2"><Button variant="secondary" size="sm" onClick={onCsv}><Download size={15} /> CSV</Button>{onPrint && <Button variant="ghost" size="sm" onClick={onPrint}><Printer size={15} /> Print</Button>}</div>;
}

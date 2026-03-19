'use client';
import { Printer } from 'lucide-react';
export default function PrintButton() {
  return (
    <button onClick={() => window.print()} title="Print / Save as PDF"
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200
                 text-slate-500 hover:border-blue-300 hover:text-blue-600 text-xs font-semibold
                 transition-all print:hidden">
      <Printer size={13} />Print / PDF
    </button>
  );
}

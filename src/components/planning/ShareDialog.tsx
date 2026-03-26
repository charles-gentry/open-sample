import { useState, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { usePlanStore } from '../../stores/planStore';
import { encodePlan } from '../../services/sharing';

export default function ShareDialog({ onClose }: { onClose: () => void }) {
  const { params, points } = usePlanStore();
  const [copied, setCopied] = useState(false);

  const url = useMemo(() => {
    const encoded = encodePlan(params.name, points, params.type);
    return `${window.location.origin}/navigate/${encoded}`;
  }, [params.name, points, params.type]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full mx-4 border border-slate-200/60">
        <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2">Share Sampling Plan</h3>
        <p className="text-sm text-slate-500 mb-4">
          Scan this QR code or copy the link below to open the plan on a mobile
          device.
        </p>
        <div className="flex justify-center mb-4">
          <QRCodeSVG value={url} size={200} />
        </div>
        <div className="flex gap-2 mb-4">
          <input
            readOnly
            value={url}
            className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono bg-slate-50 truncate text-slate-600"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-brand text-white text-sm rounded-xl hover:bg-brand-hover font-semibold shadow-sm shadow-brand-glow transition-all duration-150"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          {points.length} points encoded ({url.length} chars)
        </p>
        <button
          onClick={onClose}
          className="text-sm text-slate-400 hover:text-slate-700 transition-colors duration-150"
        >
          Close
        </button>
      </div>
    </div>
  );
}

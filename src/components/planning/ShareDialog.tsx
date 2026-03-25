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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-retro-panel border-2 border-retro-green p-6 max-w-lg w-full mx-4">
        <h3 className="text-lg font-bold text-retro-green uppercase tracking-wider mb-2">Share Sampling Plan</h3>
        <p className="text-sm text-retro-text mb-4">
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
            className="flex-1 border border-retro-green-muted bg-retro-bg text-retro-green px-3 py-2 text-xs font-mono truncate"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 border-2 border-retro-green text-retro-green text-sm font-bold uppercase tracking-wider hover:bg-retro-green hover:text-retro-bg transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-xs text-retro-green-dim mb-4">
          {points.length} points encoded ({url.length} chars)
        </p>
        <button
          onClick={onClose}
          className="text-sm text-retro-green-dim hover:text-retro-green uppercase tracking-wider transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

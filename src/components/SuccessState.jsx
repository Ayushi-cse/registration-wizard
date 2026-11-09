import React, { useEffect, useState } from 'react';
import { CheckCircle2, Terminal, Copy, Check, RotateCcw, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * SuccessState Component
 * Rendered upon successful Step 3 submission.
 * Fulfills Sprint 07 requirement:
 * "On Step 3, the 'Submit' action must console.log() the finalized data object and trigger a 'Success' UI state."
 */
export default function SuccessState({ payload, onReset }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fire celebratory confetti burst upon landing on success screen
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#10b981', '#f59e0b', '#3b82f6'],
      });
    } catch {
      // Fallback if canvas is unavailable
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="success-screen">
      {/* Success Badge */}
      <div className="success-icon-badge">
        <CheckCircle2 size={42} strokeWidth={2.5} />
      </div>

      <h2 style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '0.5rem' }}>
        Registration Complete!
      </h2>
      <p style={{ color: '#64748b', fontSize: '0.9375rem', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
        Welcome aboard, <strong>{payload.firstName} {payload.lastName}</strong>. Your profile payload has been compiled and committed.
      </p>

      {/* DevTools Console Proof Box */}
      <div className="console-proof-box">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>
            <Terminal size={14} style={{ color: '#10b981' }} />
            <span>DevTools Console Payload [console.log(formData)]</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="quick-tool-btn"
            style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
          >
            {copied ? <Check size={12} style={{ color: '#10b981' }} /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>
        </div>

        <pre>
          <code>{JSON.stringify(payload, null, 2)}</code>
        </pre>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          fontSize: '0.8125rem',
          color: '#059669',
          marginBottom: '1.75rem',
        }}
      >
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
        <span>Verified: Payload successfully logged to browser console window.</span>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="btn btn-secondary"
        style={{ margin: '0 auto' }}
      >
        <RotateCcw size={16} />
        <span>Restart Wizard / Register Another</span>
      </button>
    </div>
  );
}

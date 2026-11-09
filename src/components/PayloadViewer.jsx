import React, { useState } from 'react';
import { Code2, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * PayloadViewer Component
 * Live inspector panel for evaluators and QA recording, displaying real-time
 * lifted state transitions and form validity status.
 */
export default function PayloadViewer({ formData, currentStep, isStepValid, activeMode }) {
  const [isOpen, setIsOpen] = useState(false);

  // Mask password in preview for security
  const sanitizedData = {
    ...formData,
    password: formData.password ? `•••••••• (${formData.password.length} chars)` : '',
    confirmPassword: formData.confirmPassword ? `•••••••• (${formData.confirmPassword.length} chars)` : '',
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '680px',
        marginTop: '1rem',
        borderRadius: '0.75rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(10px)',
        overflow: 'hidden',
        color: '#cbd5e1',
        fontSize: '0.8125rem',
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.625rem 1rem',
          background: 'none',
          border: 'none',
          color: '#cbd5e1',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: '0.8125rem',
          fontWeight: 500,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Code2 size={16} style={{ color: '#818cf8' }} />
          <span>Real-Time State Inspector</span>
          <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: '#312e81', color: '#c7d2fe' }}>
            {activeMode}
          </span>
          <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: isStepValid ? '#064e3b' : '#7f1d1d', color: isStepValid ? '#6ee7b7' : '#fca5a5' }}>
            Step {currentStep} {isStepValid ? 'Valid' : 'Invalid'}
          </span>
        </div>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div style={{ padding: '0.75rem 1rem 1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <pre
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              color: '#38bdf8',
              margin: 0,
              overflowX: 'auto',
            }}
          >
            <code>{JSON.stringify(sanitizedData, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

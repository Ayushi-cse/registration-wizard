import React from 'react';
import { Check } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Personal Info' },
  { id: 2, label: 'Account Details' },
  { id: 3, label: 'Review & Submit' },
];

/**
 * ProgressBar Component
 * Renders the top-level progress indicator, active step node states,
 * and percentage bar required by Phase 2 UX specifications.
 */
export default function ProgressBar({ currentStep }) {
  // Calculate percentage width for visual bar (Step 1: 33%, Step 2: 66%, Step 3: 100%)
  const progressPercent = Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100);

  return (
    <div className="stepper-container" aria-label="Registration Progress">
      {/* Dynamic textual progress indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Step {currentStep} of {STEPS.length}
        </span>
        <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 500 }}>
          {STEPS[currentStep - 1]?.label}
        </span>
      </div>

      {/* Stepper nodes with connecting track */}
      <div className="stepper-steps">
        <div className="stepper-track-bg" />
        <div
          className="stepper-track-fill"
          style={{ width: `${progressPercent}%` }}
        />

        {STEPS.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          let statusClass = '';
          if (isCompleted) statusClass = 'completed';
          else if (isActive) statusClass = 'active';

          return (
            <div
              key={step.id}
              className={`step-node ${statusClass}`}
              aria-current={isActive ? 'step' : undefined}
            >
              <div className="step-circle">
                {isCompleted ? (
                  <Check size={16} strokeWidth={3} />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <span className="step-node-label">{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Linear progress strip */}
      <div className="progress-strip" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-strip-fill" style={{ width: `${Math.max(10, progressPercent)}%` }} />
      </div>
    </div>
  );
}

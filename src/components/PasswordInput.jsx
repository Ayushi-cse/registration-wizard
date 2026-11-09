import React, { useState } from 'react';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getPasswordStrength } from '../utils/validationRegex';

/**
 * PasswordInput Component
 * Implements Sprint 07 Phase 2 Requirement:
 * - Real-time password length validation
 * - Dynamic Show/Hide password toggle via eyeball icon (FAQ #4)
 * - Accessible aria-pressed and aria-label states
 * - Optional password strength meter for enhanced FinTech UX
 */
export default function PasswordInput({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  isValid,
  placeholder = '••••••••',
  required = true,
  registrationProps = {},
  showMeter = false,
  helperText,
}) {
  // Phase 2 FAQ #4: Boolean state for password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const hasError = Boolean(error);
  const showValidCheck = isValid && !hasError && value;
  const strength = showMeter && value ? getPasswordStrength(value) : null;

  return (
    <div className="field-group">
      <label htmlFor={id} className="field-label">
        <span>
          {label}
          {required && <span className="field-required">*</span>}
        </span>
        {helperText && !hasError && (
          <span className="field-helper-text">{helperText}</span>
        )}
      </label>

      <div className="input-container">
        <div className="input-icon-left">
          <Lock size={18} />
        </div>

        {/* Dynamic input type toggle (text <-> password) */}
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value ?? ''}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={name === 'password' ? 'new-password' : 'new-password'}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className={`custom-input has-right-action ${hasError ? 'is-invalid' : ''} ${showValidCheck ? 'is-valid' : ''}`}
          {...registrationProps}
        />

        <div className="input-action-right">
          {showValidCheck && (
            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center' }} title="Password requirement met">
              <CheckCircle2 size={16} />
            </span>
          )}

          {/* Eyeball toggle button (Sprint 07 Phase 2) */}
          <button
            type="button"
            onClick={toggleVisibility}
            className="toggle-eye-btn"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            title={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Real-time Dynamic Error String (Sprint 07 Phase 2 Requirement) */}
      {hasError && (
        <div id={`${id}-error`} className="field-error-msg" role="alert">
          <AlertCircle size={14} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Optional Password Strength Indicator Meter */}
      {showMeter && value && (
        <div className="password-meter-wrap" aria-live="polite">
          <div className="password-meter-bars">
            {[1, 2, 3, 4].map((seg) => (
              <div
                key={seg}
                className="password-meter-segment"
                style={{
                  backgroundColor: seg <= (strength?.score || 0) ? strength?.color : '#e2e8f0',
                }}
              />
            ))}
          </div>
          <div className="password-meter-caption">
            <span>Strength: <strong style={{ color: strength?.color }}>{strength?.label}</strong></span>
            <span>{value.length}/8+ chars</span>
          </div>
        </div>
      )}
    </div>
  );
}

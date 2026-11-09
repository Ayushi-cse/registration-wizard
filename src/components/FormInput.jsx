import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * FormInput Component
 * Accessible input component with floating icon, real-time error message,
 * and support for both standard onChange props and React Hook Form registration.
 */
export default function FormInput({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  isValid,
  placeholder,
  required = true,
  icon: Icon,
  registrationProps = {},
  helperText,
  max,
  autoComplete,
}) {
  const hasError = Boolean(error);
  const showValidCheck = isValid && !hasError && value;

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
        {Icon && (
          <div className="input-icon-left">
            <Icon size={18} />
          </div>
        )}

        <input
          id={id}
          name={name}
          type={type}
          value={value ?? ''}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          max={max}
          autoComplete={autoComplete}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className={`custom-input ${hasError ? 'is-invalid' : ''} ${showValidCheck ? 'is-valid' : ''}`}
          {...registrationProps}
        />

        <div className="input-action-right">
          {showValidCheck && (
            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center' }} title="Field validated">
              <CheckCircle2 size={16} />
            </span>
          )}
        </div>
      </div>

      {/* Real-time Dynamic Error String (Sprint 07 Phase 2 Requirement) */}
      {hasError && (
        <div id={`${id}-error`} className="field-error-msg" role="alert">
          <AlertCircle size={14} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

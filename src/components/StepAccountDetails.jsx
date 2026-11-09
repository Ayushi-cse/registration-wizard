import React from 'react';
import { Mail, ShieldCheck } from 'lucide-react';
import FormInput from './FormInput';
import PasswordInput from './PasswordInput';

/**
 * Step 2: Account Details View
 * Fields: Email, Password, Confirm Password
 *
 * Implements Phase 2 Requirements:
 * - Real-time email validation (detects lack of '@' symbol immediately)
 * - Minimum 8-character password constraint
 * - Confirm password strict equality checking
 * - Show/Hide password eyeball toggle
 */
export default function StepAccountDetails({
  formData,
  errors = {},
  onChange,
  onBlur,
  register,
  isHookForm = false,
}) {
  return (
    <div className="step-view" style={{ animation: 'fadeIn 0.25s ease' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>Account Security</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.5rem', background: '#ecfdf5', color: '#059669', borderRadius: '9999px' }}>
            Credentials
          </span>
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
          Set your login credentials. Real-time validation checks will evaluate each input on change.
        </p>
      </div>

      <div className="form-grid" style={{ gap: '1.25rem' }}>
        {/* Email Address */}
        <FormInput
          id="email"
          name="email"
          label="Email Address"
          type="email"
          placeholder="alex.mercer@company.com"
          icon={Mail}
          value={formData.email}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.email}
          isValid={Boolean(formData.email && !errors.email)}
          autoComplete="email"
          registrationProps={isHookForm && register ? register('email') : {}}
          helperText="We will send your verification token here"
        />

        {/* Password with Eye Toggle & Strength Meter */}
        <PasswordInput
          id="password"
          name="password"
          label="Password"
          placeholder="Minimum 8 characters"
          value={formData.password}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.password}
          isValid={Boolean(formData.password && !errors.password && formData.password.length >= 8)}
          showMeter={true}
          helperText="At least 8 characters required"
          registrationProps={isHookForm && register ? register('password') : {}}
        />

        {/* Confirm Password with Eye Toggle */}
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Re-enter password to match"
          value={formData.confirmPassword}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.confirmPassword}
          isValid={Boolean(
            formData.confirmPassword &&
            !errors.confirmPassword &&
            formData.confirmPassword === formData.password
          )}
          showMeter={false}
          helperText="Must match primary password exactly"
          registrationProps={isHookForm && register ? register('confirmPassword') : {}}
        />
      </div>

      {/* Security Tip Box */}
      <div
        style={{
          marginTop: '1.5rem',
          padding: '0.875rem 1rem',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '0.625rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.8125rem',
          color: '#166534',
        }}
      >
        <ShieldCheck size={20} style={{ color: '#10b981', flexShrink: 0 }} />
        <span>
          <strong>Live Evaluation:</strong> The "Next" button remains disabled until email format is valid, password is at least 8 characters, and confirm password matches strictly.
        </span>
      </div>
    </div>
  );
}

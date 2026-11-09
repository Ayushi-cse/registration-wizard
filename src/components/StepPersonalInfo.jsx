import React from 'react';
import { User, Calendar, Sparkles } from 'lucide-react';
import FormInput from './FormInput';

/**
 * Step 1: Personal Info View
 * Fields: First Name, Last Name, Date of Birth
 *
 * Implements Phase 1 state lifting:
 * Receives values and change handlers from Parent to ensure
 * data persists when returning via the "Back" button.
 */
export default function StepPersonalInfo({
  formData,
  errors = {},
  onChange,
  onBlur,
  register,
  isHookForm = false,
}) {
  // Compute max date (today minus 18 years) for helpful calendar bounds
  const today = new Date();
  const maxDobDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    .toISOString()
    .split('T')[0];

  return (
    <div className="step-view" style={{ animation: 'fadeIn 0.25s ease' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>Personal Information</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.5rem', background: '#eef2ff', color: '#4f46e5', borderRadius: '9999px' }}>
            Identity KYC
          </span>
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
          Please provide your legal name and date of birth for identity verification.
        </p>
      </div>

      <div className="form-grid form-grid-2col" style={{ marginBottom: '1.25rem' }}>
        {/* First Name */}
        <FormInput
          id="firstName"
          name="firstName"
          label="First Name"
          placeholder="e.g. Alex"
          icon={User}
          value={formData.firstName}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.firstName}
          isValid={Boolean(formData.firstName && !errors.firstName)}
          autoComplete="given-name"
          registrationProps={isHookForm && register ? register('firstName') : {}}
        />

        {/* Last Name */}
        <FormInput
          id="lastName"
          name="lastName"
          label="Last Name"
          placeholder="e.g. Mercer"
          icon={User}
          value={formData.lastName}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.lastName}
          isValid={Boolean(formData.lastName && !errors.lastName)}
          autoComplete="family-name"
          registrationProps={isHookForm && register ? register('lastName') : {}}
        />
      </div>

      {/* Date of Birth */}
      <FormInput
        id="dateOfBirth"
        name="dateOfBirth"
        label="Date of Birth"
        type="date"
        icon={Calendar}
        value={formData.dateOfBirth}
        onChange={onChange}
        onBlur={onBlur}
        max={maxDobDate}
        helperText="Must be 18 years of age or older"
        error={errors.dateOfBirth}
        isValid={Boolean(formData.dateOfBirth && !errors.dateOfBirth)}
        registrationProps={isHookForm && register ? register('dateOfBirth') : {}}
      />

      {/* Helpful Hint Callout */}
      <div
        style={{
          marginTop: '1.5rem',
          padding: '0.875rem 1rem',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '0.625rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          fontSize: '0.8125rem',
          color: '#475569',
        }}
      >
        <Sparkles size={18} style={{ color: '#6366f1', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ color: '#1e293b' }}>State Persistence Guarantee:</strong> You can transition to Step 2 and return back via the "Back" button at any time. Form state is lifted to the parent architecture and will not reset on view switch.
        </div>
      </div>
    </div>
  );
}

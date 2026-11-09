import React, { useState } from 'react';
import { User, Shield, Edit2, CheckCircle2, Lock } from 'lucide-react';

/**
 * Step 3: Review & Submit View
 *
 * Implements Phase 1 Mandatory Deliverable:
 * - Renders a complete, structured summary of all captured form data
 * - Allows quick-edit jump triggers to return to Step 1 or Step 2
 * - Masked password display for FinTech privacy
 */
export default function StepReviewSubmit({
  formData,
  onGoToStep,
  agreedToTerms,
  setAgreedToTerms,
}) {
  const [showMaskedPassword, setShowMaskedPassword] = useState(false);

  // Format Date of Birth nicely for display
  const formattedDob = formData.dateOfBirth
    ? new Date(formData.dateOfBirth + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Not provided';

  // Compute calculated age
  const calculateAge = (dobString) => {
    if (!dobString) return '';
    const birth = new Date(dobString);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(formData.dateOfBirth);

  return (
    <div className="step-view" style={{ animation: 'fadeIn 0.25s ease' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>Review & Submit</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.5rem', background: '#fef3c7', color: '#b45309', borderRadius: '9999px' }}>
            Final Audit
          </span>
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
          Review your unified onboarding payload before committing to the enterprise directory.
        </p>
      </div>

      <div className="review-container">
        {/* Section 1: Personal Information Card */}
        <div className="review-card">
          <div className="review-card-header">
            <div className="review-card-title">
              <User size={18} style={{ color: '#4f46e5' }} />
              <span>Personal Information</span>
            </div>
            <button
              type="button"
              className="btn-edit-jump"
              onClick={() => onGoToStep(1)}
              title="Edit personal details"
            >
              <Edit2 size={13} />
              <span>Edit</span>
            </button>
          </div>

          <div className="review-data-grid">
            <div className="review-item">
              <span className="review-item-label">First Name</span>
              <span className="review-item-value">{formData.firstName || '—'}</span>
            </div>
            <div className="review-item">
              <span className="review-item-label">Last Name</span>
              <span className="review-item-value">{formData.lastName || '—'}</span>
            </div>
            <div className="review-item">
              <span className="review-item-label">Date of Birth</span>
              <span className="review-item-value">
                {formattedDob} {age ? `(${age} years old)` : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Account Details Card */}
        <div className="review-card">
          <div className="review-card-header">
            <div className="review-card-title">
              <Shield size={18} style={{ color: '#10b981' }} />
              <span>Account Credentials</span>
            </div>
            <button
              type="button"
              className="btn-edit-jump"
              onClick={() => onGoToStep(2)}
              title="Edit account credentials"
            >
              <Edit2 size={13} />
              <span>Edit</span>
            </button>
          </div>

          <div className="review-data-grid">
            <div className="review-item">
              <span className="review-item-label">Email Address</span>
              <span className="review-item-value">{formData.email || '—'}</span>
            </div>
            <div className="review-item">
              <span className="review-item-label">Password</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.125rem' }}>
                <span className="review-item-value" style={{ fontFamily: 'monospace' }}>
                  {showMaskedPassword ? formData.password : '••••••••••••'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowMaskedPassword((prev) => !prev)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '0.75rem',
                    color: '#6366f1',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  {showMaskedPassword ? 'Hide' : 'Reveal'}
                </button>
              </div>
            </div>
            <div className="review-item">
              <span className="review-item-label">Password Match</span>
              <span className="review-item-value" style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <CheckCircle2 size={15} />
                <span>Verified Match</span>
              </span>
            </div>
          </div>
        </div>

        {/* Legal Confirmation / Submission Agreement */}
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#ffffff',
            border: '1.5px dashed #cbd5e1',
            borderRadius: '0.75rem',
          }}
        >
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              style={{
                marginTop: '0.2rem',
                width: '1.125rem',
                height: '1.125rem',
                accentColor: '#4f46e5',
                cursor: 'pointer',
              }}
            />
            <span style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.4 }}>
              I certify that all details submitted above are accurate and valid. Clicking <strong>Submit Registration</strong> will compile the unified payload, log it to the browser console, and conclude onboarding.
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}

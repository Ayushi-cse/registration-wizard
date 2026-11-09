import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Zap,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

import ProgressBar from './components/ProgressBar';
import StepPersonalInfo from './components/StepPersonalInfo';
import StepAccountDetails from './components/StepAccountDetails';
import StepReviewSubmit from './components/StepReviewSubmit';
import SuccessState from './components/SuccessState';
import PayloadViewer from './components/PayloadViewer';

import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateName,
  validateDateOfBirth,
} from './utils/validationRegex';
import {
  registrationSchema,
  stepOneSchema,
  stepTwoSchema,
} from './schemas/registrationSchema';

const INITIAL_FORM_VALUES = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  email: '',
  password: '',
  confirmPassword: '',
};

/**
 * RegistrationWizard Component
 * Master Parent Component orchestrating the multi-step onboarding lifecycle.
 *
 * Implements:
 * - Phase 1 (P0): Conditional rendering of 3 distinct views & state lifting to parent.
 * - Phase 2 (P1): Real-time onChange regex validation, conditional "Next" button disabling,
 *                 eyeball password toggle & dynamic progress bar.
 * - Phase 3 (P2): React Hook Form library migration + Zod type-safe schema validation.
 */
export default function RegistrationWizard() {
  // Navigation active view state (Step 1, Step 2, Step 3) - Sprint 07 FAQ #2
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Architecture toggle: Allows evaluator to toggle between Phase 3 (RHF + Zod) and Phase 1/2 (Lifted useState + Regex)
  const [formArchitecture, setFormArchitecture] = useState('enterprise'); // 'enterprise' | 'classic'

  // =========================================================================
  // Phase 1 & 2: Master Lifted useState (State survives unmounting on Back)
  // =========================================================================
  const [classicFormData, setClassicFormData] = useState(INITIAL_FORM_VALUES);
  const [classicErrors, setClassicErrors] = useState({});

  // =========================================================================
  // Phase 3: React Hook Form + Zod Schema Validation Engine
  // =========================================================================
  const rhfMethods = useForm({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange', // Real-time validation on keystroke (Phase 2 & 3)
    defaultValues: INITIAL_FORM_VALUES,
    shouldUnregister: false, // Critical: Retains values when step views unmount!
  });

  const {
    register: rhfRegister,
    handleSubmit: rhfHandleSubmit,
    watch: rhfWatch,
    setValue: rhfSetValue,
    reset: rhfReset,
    formState: { errors: rhfErrors },
  } = rhfMethods;

  // Live watched values in RHF mode
  const rhfValues = rhfWatch();

  // Active form data depending on selected architecture mode
  const activeFormData = formArchitecture === 'enterprise' ? rhfValues : classicFormData;

  // Active error messages map
  const activeErrors = useMemo(() => {
    if (formArchitecture === 'classic') {
      return classicErrors;
    }
    // Transform RHF errors object to string map
    const errMap = {};
    if (rhfErrors.firstName?.message) errMap.firstName = rhfErrors.firstName.message;
    if (rhfErrors.lastName?.message) errMap.lastName = rhfErrors.lastName.message;
    if (rhfErrors.dateOfBirth?.message) errMap.dateOfBirth = rhfErrors.dateOfBirth.message;
    if (rhfErrors.email?.message) errMap.email = rhfErrors.email.message;
    if (rhfErrors.password?.message) errMap.password = rhfErrors.password.message;
    if (rhfErrors.confirmPassword?.message) errMap.confirmPassword = rhfErrors.confirmPassword.message;
    return errMap;
  }, [formArchitecture, classicErrors, rhfErrors]);

  // =========================================================================
  // Phase 2: Real-Time onChange Validation Logic (Classic Lifted State)
  // =========================================================================
  const handleClassicChange = (e) => {
    const { name, value } = e.target;

    // 1. Update lifted parent state immediately
    const updatedForm = { ...classicFormData, [name]: value };
    setClassicFormData(updatedForm);

    // 2. Perform real-time validation on the target field
    let fieldError = '';

    if (name === 'firstName') {
      const res = validateName(value, 'First name');
      fieldError = res.error;
    } else if (name === 'lastName') {
      const res = validateName(value, 'Last name');
      fieldError = res.error;
    } else if (name === 'dateOfBirth') {
      const res = validateDateOfBirth(value);
      fieldError = res.error;
    } else if (name === 'email') {
      const res = validateEmail(value);
      fieldError = res.error;
    } else if (name === 'password') {
      const res = validatePassword(value);
      fieldError = res.error;
      // Re-evaluate confirmPassword match if user edits password
      if (updatedForm.confirmPassword) {
        const matchRes = validateConfirmPassword(updatedForm.confirmPassword, value);
        setClassicErrors((prev) => ({
          ...prev,
          password: fieldError,
          confirmPassword: matchRes.error,
        }));
        return;
      }
    } else if (name === 'confirmPassword') {
      const res = validateConfirmPassword(value, updatedForm.password);
      fieldError = res.error;
    }

    setClassicErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  // =========================================================================
  // Step Validity Evaluation for Conditional Disabling of "Next" (Phase 2 P1)
  // =========================================================================
  const isStepOneValid = useMemo(() => {
    if (formArchitecture === 'enterprise') {
      const parsed = stepOneSchema.safeParse({
        firstName: activeFormData.firstName,
        lastName: activeFormData.lastName,
        dateOfBirth: activeFormData.dateOfBirth,
      });
      return parsed.success;
    } else {
      const f1 = validateName(classicFormData.firstName, 'First name');
      const f2 = validateName(classicFormData.lastName, 'Last name');
      const f3 = validateDateOfBirth(classicFormData.dateOfBirth);
      return f1.isValid && f2.isValid && f3.isValid;
    }
  }, [formArchitecture, activeFormData, classicFormData]);

  const isStepTwoValid = useMemo(() => {
    if (formArchitecture === 'enterprise') {
      const parsed = stepTwoSchema.safeParse({
        email: activeFormData.email,
        password: activeFormData.password,
        confirmPassword: activeFormData.confirmPassword,
      });
      return parsed.success;
    } else {
      const e1 = validateEmail(classicFormData.email);
      const e2 = validatePassword(classicFormData.password);
      const e3 = validateConfirmPassword(classicFormData.confirmPassword, classicFormData.password);
      return e1.isValid && e2.isValid && e3.isValid;
    }
  }, [formArchitecture, activeFormData, classicFormData]);

  // Evaluates whether the "Next" button should be enabled for current step
  const isCurrentStepValid = useMemo(() => {
    if (step === 1) return isStepOneValid;
    if (step === 2) return isStepTwoValid;
    if (step === 3) return agreedToTerms && isStepOneValid && isStepTwoValid;
    return false;
  }, [step, isStepOneValid, isStepTwoValid, agreedToTerms]);

  // =========================================================================
  // Navigation Triggers ("Next" & "Back")
  // =========================================================================
  const handleNextStep = () => {
    if (!isCurrentStepValid) return;
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    // Navigating back retains all lifted state
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleGoToStep = (targetStep) => {
    setStep(targetStep);
  };

  // =========================================================================
  // Phase 1 Submission Payload Execution
  // Requirement: console.log() finalized payload & trigger Success UI state
  // =========================================================================
  const handleFormSubmit = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault(); // Sprint 07 FAQ #6: Prevent native hard-refresh
    }

    if (!isCurrentStepValid) return;

    const payload = {
      ...activeFormData,
      submittedAt: new Date().toISOString(),
      architecture: formArchitecture === 'enterprise' ? 'React Hook Form + Zod' : 'Lifted useState + Regex',
      meta: {
        environment: 'Client-Side Browser Audit',
        sprint: 'Sprint 07 — The Registration Wizard',
      },
    };

    // Mandatory Sprint 07 Deliverable: Finalized data object logged to console
    console.log('=== REGISTRATION WIZARD FINAL SUBMISSION PAYLOAD ===');
    console.log(payload);

    setSubmittedData(payload);
    setIsSubmitted(true);
  };

  // Switch architecture with bidirectional state sync
  const handleSwitchArchitecture = (newMode) => {
    if (newMode === formArchitecture) return;

    if (newMode === 'classic') {
      // Transfer current RHF values to classic useState
      const currentValues = rhfWatch();
      setClassicFormData({ ...currentValues });
    } else {
      // Transfer classic values to RHF
      Object.entries(classicFormData).forEach(([key, val]) => {
        rhfSetValue(key, val, { shouldValidate: true, shouldDirty: true });
      });
    }

    setFormArchitecture(newMode);
  };
    setClassicFormData(INITIAL_FORM_VALUES);
    setClassicErrors({});
    rhfReset(INITIAL_FORM_VALUES);
    setAgreedToTerms(false);
    setIsSubmitted(false);
    setSubmittedData(null);
    setStep(1);
  };

  // QA Demo Fast-Fill Helper
  const handleFastFill = () => {
    const sampleData = {
      firstName: 'Alexander',
      lastName: 'Mercer',
      dateOfBirth: '1995-04-18',
      email: 'alex.mercer@fintech-demo.io',
      password: 'EnterprisePassword@2026',
      confirmPassword: 'EnterprisePassword@2026',
    };

    if (formArchitecture === 'enterprise') {
      Object.entries(sampleData).forEach(([key, val]) => {
        rhfSetValue(key, val, { shouldValidate: true, shouldDirty: true });
      });
    } else {
      setClassicFormData(sampleData);
      setClassicErrors({});
    }
  };

  return (
    <div className="app-viewport">
      {/* Top Architecture Controls Bar (Evaluator & Demo Helper) */}
      <header className="top-nav-bar">
        <div className="architecture-badge-group">
          <span style={{ fontWeight: 600, color: '#94a3b8' }}>Architecture Engine:</span>
          <button
            type="button"
            onClick={() => handleSwitchArchitecture('enterprise')}
            className={`mode-pill-btn ${formArchitecture === 'enterprise' ? 'active' : ''}`}
            title="React Hook Form + Zod Schema (Phase 3)"
          >
            <Zap size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Phase 3: RHF + Zod
          </button>
          <button
            type="button"
            onClick={() => handleSwitchArchitecture('classic')}
            className={`mode-pill-btn ${formArchitecture === 'classic' ? 'active' : ''}`}
            title="Parent Lifted useState + Regex (Phase 1 & 2)"
          >
            Phase 1/2: Lifted useState
          </button>
        </div>

        <div className="quick-tools-group">
          <button
            type="button"
            onClick={handleFastFill}
            className="quick-tool-btn"
            title="Auto-fill sample credentials for QA demo recording"
          >
            <Sparkles size={13} style={{ color: '#fbbf24' }} />
            <span>Fast Fill (QA)</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="quick-tool-btn"
            title="Reset form state"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </header>

      {/* Main Wizard Card */}
      <main className="wizard-card">
        {/* Card Header & Progress Indicator */}
        {!isSubmitted && (
          <div className="wizard-header">
            <div className="wizard-badge">
              <span>SaaS Onboarding Flow</span>
              <span>•</span>
              <span>Sprint 07</span>
            </div>
            <h1 className="wizard-title">The Registration Wizard</h1>
            <p className="wizard-subtitle">
              Segmented multi-step onboarding with resilient state lifting and real-time schema validation.
            </p>

            {/* Dynamic Progress Indicator (Phase 2 Requirement) */}
            <ProgressBar currentStep={step} />
          </div>
        )}

        {/* Wizard View Container */}
        {isSubmitted && submittedData ? (
          <SuccessState payload={submittedData} onReset={handleReset} />
        ) : (
          <form
            onSubmit={step === 3 ? handleFormSubmit : (e) => { e.preventDefault(); handleNextStep(); }}
            noValidate
          >
            <div className="wizard-body">
              {/* Conditional View Rendering (Sprint 07 FAQ #2 & Phase 1 Requirement) */}
              {step === 1 && (
                <StepPersonalInfo
                  formData={activeFormData}
                  errors={activeErrors}
                  onChange={formArchitecture === 'classic' ? handleClassicChange : undefined}
                  onBlur={undefined}
                  register={formArchitecture === 'enterprise' ? rhfRegister : undefined}
                  isHookForm={formArchitecture === 'enterprise'}
                />
              )}

              {step === 2 && (
                <StepAccountDetails
                  formData={activeFormData}
                  errors={activeErrors}
                  onChange={formArchitecture === 'classic' ? handleClassicChange : undefined}
                  onBlur={undefined}
                  register={formArchitecture === 'enterprise' ? rhfRegister : undefined}
                  isHookForm={formArchitecture === 'enterprise'}
                />
              )}

              {step === 3 && (
                <StepReviewSubmit
                  formData={activeFormData}
                  onGoToStep={handleGoToStep}
                  agreedToTerms={agreedToTerms}
                  setAgreedToTerms={setAgreedToTerms}
                />
              )}
            </div>

            {/* Navigation Triggers (Phase 1 & 2 Requirements) */}
            <div className="wizard-footer">
              <div>
                {step > 1 ? (
                  <button
                    type="button" // Sprint 07 FAQ #6: Prevents form submission on Back
                    onClick={handlePrevStep}
                    className="btn btn-secondary"
                  >
                    <ChevronLeft size={18} />
                    <span>Back</span>
                  </button>
                ) : (
                  <span style={{ fontSize: '0.8125rem', color: '#94a3b8', fontStyle: 'italic' }}>
                    Step 1 of 3
                  </span>
                )}
              </div>

              <div>
                {step < 3 ? (
                  <button
                    type="button" // Sprint 07 FAQ #6: Explicit type="button" on navigation
                    onClick={handleNextStep}
                    disabled={!isCurrentStepValid} // Sprint 07 Phase 2: Conditional Disabling
                    className="btn btn-primary"
                  >
                    <span>Next</span>
                    <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    type="submit" // Triggers final submission handler on Step 3
                    disabled={!isCurrentStepValid}
                    className="btn btn-success"
                  >
                    <span>Submit Registration</span>
                    <Send size={16} />
                  </button>
                )}
              </div>
            </div>
          </form>
        )}
      </main>

      {/* Real-time State & Payload Inspector (for QA audit demo) */}
      <PayloadViewer
        formData={activeFormData}
        currentStep={step}
        isStepValid={isCurrentStepValid}
        activeMode={formArchitecture === 'enterprise' ? 'RHF + Zod' : 'Lifted useState'}
      />

      <footer className="app-footer">
        Sprint 07 Technical Residency • Registration Wizard Module • Clean Architecture
      </footer>
    </div>
  );
}

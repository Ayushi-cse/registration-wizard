# The Registration Wizard — Enterprise Multi-Step Onboarding

[![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4.11-646cff.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7.53.2-ec5990.svg?style=flat-square&logo=reacthookform)](https://react-hook-form.com/)
[![Zod](https://img.shields.io/badge/Zod-3.23.8-3e67b1.svg?style=flat-square&logo=zod)](https://zod.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=flat-square)](LICENSE)

An enterprise-grade multi-step onboarding wizard architected for modern SaaS and FinTech web applications. This application segments user data collection across localized views, guarantees payload persistence across backward and forward transitions through lifted state architecture, and pairs real-time client-side validation with React Hook Form and Zod schema enforcement.

---

## 🎯 Engineering Objectives & Deliverables

| Phase | Priority | Requirement | Implementation Summary |
|---|:---:|---|---|
| **Phase 1: Base MVP & State Architecture** | **P0** | UI Segmentation (3 Views) | Conditionally renders `StepPersonalInfo`, `StepAccountDetails`, and `StepReviewSubmit` on a single route. |
| | **P0** | Navigation Logic | "Next" and "Back" action triggers toggle active step views smoothly without hard page reloads. |
| | **P0** | State Lifting | Master state is lifted to parent component (`RegistrationWizard.jsx`); navigating forward and backward strictly retains all input values. |
| | **P0** | Submission Payload | Step 3 final submit logs `console.log(formData)` and transitions the interface to an interactive `SuccessState`. |
| **Phase 2: Client-Side Validation & UX Polish** | **P1** | Real-Time Validation (`onChange`) | Instant regex evaluation: flags missing `@` in email, verifies minimum 8-character password length, and checks strict password confirmation match. |
| | **P1** | Conditional Next Button Disabling | "Next" button remains physically unclickable (`disabled={true}`) with custom disabled styling until all fields in active step pass validation. |
| | **P1** | Show/Hide Password Toggle | Eyeball toggle icon dynamically alters input type between `password` and `text` with accessible `aria` attributes. |
| | **P1** | Dynamic Progress Bar | Stepper header displays "Step X of 3", animated completion line, active ring glows, and completed step checkmarks. |
| **Phase 3: Enterprise Form Architecture** | **P2** | React Hook Form Migration | Integrates `react-hook-form` with `shouldUnregister: false` to eliminate keystroke re-render thrashing across large form trees. |
| | **P2** | Zod Schema Validation | Enforces declarative, type-safe schemas with cross-field `.refine()` validation for passwords and 18+ age checks. |

---

## 🚀 Live Demo & QA Video Outline

- **Live URL**: Deployed to Vercel (see [Deployment Guide](#-deployment-guide))
- **QA Demo Video**: 3-minute recording walkthrough covering real-time error messages, the "Back" button retaining state, and the DevTools console payload output.

### 3-Minute QA Recording Script
1. **0:00 - 0:40 (Step 1 — Personal Info & State Persistence)**
   - Type in First Name (`Alex`) and Last Name (`Mercer`).
   - Select Date of Birth (demonstrating minimum 18-year age validation).
   - Click **"Next"** to transition to Step 2.
   - Click **"Back"** to return to Step 1. **Crucial QA Check**: Show that First Name, Last Name, and Date of Birth values are preserved in the DOM.
2. **0:40 - 1:40 (Step 2 — Real-Time Validation & Eyeball Toggle)**
   - Click **"Next"** back to Step 2. Point out that the "Next" button is disabled.
   - Type `alex` in the email field. Point out the dynamic red error string: `"Email must contain an "@" symbol"`.
   - Add `@example.com` to clear the error.
   - In Password, type `secret` (6 characters). Point out the real-time warning: `"Password must be at least 8 characters (currently 6)"`.
   - Extend password to 8+ characters. Click the **Eyeball icon** to demonstrate the toggle between obscured `••••••••` and visible text.
   - In Confirm Password, type a mismatched string. Show `"Passwords must strictly match"`. Type matching string to clear error.
   - Notice the "Next" button is now active. Click **"Next"**.
3. **1:40 - 2:30 (Step 3 — Review, Edit Triggers & Final Submission)**
   - Point out the unified summary cards with masked credentials.
   - Click the **"Edit"** badge on Personal Info to jump back to Step 1, verify data, and jump back to Step 3.
   - Check the certification checkbox.
   - Open Developer Tools Console (`F12` or `Ctrl+Shift+I`).
   - Click **"Submit Registration"**.
   - Show the confetti animation, the Success State, and highlight the payload logged to the console:
     ```javascript
     console.log("=== REGISTRATION WIZARD FINAL SUBMISSION PAYLOAD ===");
     console.log(formData);
     ```

---

## 🏗️ Architecture & Component Hierarchy

```
registration-wizard/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── FormInput.jsx            # Accessible input with icons and dynamic error strings
│   │   ├── PasswordInput.jsx        # Password input with eyeball toggle & strength meter
│   │   ├── ProgressBar.jsx          # Stepper indicator ("Step X of 3") with animated fill
│   │   ├── StepPersonalInfo.jsx    # Step 1: First Name, Last Name, Date of Birth
│   │   ├── StepAccountDetails.jsx   # Step 2: Email, Password, Confirm Password
│   │   ├── StepReviewSubmit.jsx     # Step 3: Structured summary cards & Edit shortcuts
│   │   ├── SuccessState.jsx         # Submission success view with confetti & payload viewer
│   │   └── PayloadViewer.jsx        # Real-time state inspector drawer for QA auditing
│   ├── schemas/
│   │   └── registrationSchema.js    # Zod schema definitions (Step 1, Step 2, Full payload)
│   ├── utils/
│   │   └── validationRegex.js       # RFC email regex, name validation & age calculations
│   ├── App.jsx                      # App root
│   ├── RegistrationWizard.jsx       # Master orchestrator holding lifted state & nav logic
│   ├── index.css                    # Design system (typography, variables, micro-interactions)
│   └── main.jsx                     # React entrypoint
├── index.html
├── vite.config.js
├── vercel.json                      # Vercel SPA rewrite configuration
├── package.json
└── Prompts.md                       # Residency AI debugging & architectural sessions log
```

### Architectural Highlights

1. **Lifting State Up (Phase 1 — P0)**
   The parent component (`RegistrationWizard.jsx`) maintains the master form payload. When navigating between steps, child view components mount and unmount via conditional rendering (`{step === 1 && <StepPersonalInfo />}`), but the underlying payload remains anchored in parent state.

2. **Isolated Keystroke Re-Renders (Phase 3 — P2)**
   In **Enterprise Mode** (React Hook Form + Zod), inputs are registered into uncontrolled states. Keystrokes do not trigger component tree re-renders, dramatically improving performance for large-scale enterprise applications.

3. **Dual Architecture Switcher**
   For auditing transparency, the top navigation bar includes an interactive engine toggle:
   - **Phase 3: RHF + Zod**: Enterprise uncontrolled state engine with `@hookform/resolvers/zod`.
   - **Phase 1/2: Lifted useState**: Pure lifted React state engine with custom regular expressions.

---

## 🛠️ Installation & Local Development

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/registration-wizard.git
   cd registration-wizard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Execute production build**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## 🌐 Deployment Guide

### Deploying to Vercel

1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `registration-wizard` repository.
4. Set Build Settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**. The included `vercel.json` ensures client-side routing rewrites are handled seamlessly without 404 errors.

---

## 📋 Technical FAQ Compliance Reference

- **FAQ #1 (Custom Validation vs HTML5)**: Handled via real-time onChange listeners with custom styled red error banners and accessible ARIA attributes.
- **FAQ #2 (No React Router)**: Single-route conditional view toggling (`{step === 1 && ...}`).
- **FAQ #3 (State Survival Across Unmounting)**: Master payload lifted to `RegistrationWizard.jsx` parent component.
- **FAQ #4 (Show/Hide Password Architecture)**: `showPassword` boolean state toggles input `type={showPassword ? 'text' : 'password'}`.
- **FAQ #5 (Regex Pattern)**: Verified standard RFC email format `^[^\s@]+@[^\s@]+\.[^\s@]+$`.
- **FAQ #6 (Preventing Hard-Refreshes)**: Navigation buttons explicitly declare `type="button"`, and form encapsulates `e.preventDefault()`.
- **FAQ #7 (Console Logging)**: Final compiled payload outputted cleanly via `console.log(formData)`.
- **FAQ #8 & #9 (RHF & Zod)**: Implemented in Phase 3 with type-safe schema definitions and `.refine()` cross-field constraints.
- **FAQ #10 (Conditional Disabling)**: Inline evaluation disables "Next" button until all active view fields pass validation.
- **FAQ #12 (Case-Sensitivity Audit)**: Strict PascalCase audit completed across all file imports.

# Sprint 07 AI Debugging & Architectural Sessions Log (Prompts.md)

> **Residency AI Compliance**: *"Learn, Don't Copy" Mandate*  
> This document logs the conceptual inquiries, architectural evaluations, and debugging sessions conducted with AI models during the engineering of **The Registration Wizard**. All code committed to this repository was synthesized, understood, typed, and audited by the engineer.

---

## Session 1: State Lifting vs Component Unmounting (Phase 1 — P0)

### 1. Context & Objective
In modern multi-step onboarding flows, segmenting monolithic 20-field forms into distinct localized views is essential for FinTech/SaaS conversion rates. However, in React, conditional rendering (`{step === 1 && <StepOne />}`) unmounts child step components when transitioning forward or backward. Without architectural foresight, all user input is garbage-collected upon unmount.

### 2. Prompt Submitted to AI
```text
I am building a 3-step registration wizard in React (Step 1: Personal Info, Step 2: Account Credentials, Step 3: Review & Submit). I am using conditional rendering to toggle views ({step === 1 && <StepOne />}) without React Router. 

When a user enters their name in Step 1, navigates to Step 2, and clicks "Back", all Step 1 inputs reset to empty because the component unmounted. 

Explain the 'Lifting State Up' design pattern for this use case. How should the unified payload be structured in the Parent component, and how should handlers be passed to children to ensure zero data loss across view toggles?
```

### 3. Key Concepts Learned & Architectural Synthesis
- **Single Source of Truth**: The parent component (`RegistrationWizard.jsx`) must hold the master state object (`formData`).
- **Unidirectional Data Flow**: The parent passes down current values (`value={formData.firstName}`) and mutation triggers down to the active step component.
- **Persistence Across Lifecycle**: Because the parent component never unmounts during the wizard session, child unmounting has zero destructive effect on the data. When `<StepPersonalInfo />` mounts again on the "Back" action, it reads the current values straight from the parent's memory.

---

## Session 2: Real-Time onChange Validation & Conditional Navigation (Phase 2 — P1)

### 1. Context & Objective
Native HTML5 validation (`required`, `type="email"`) is insufficient for enterprise applications because it fires only on submit events, looks visually jarring across operating systems, and cannot be custom-styled. We required instant keystroke (`onChange`) feedback with dynamic error strings (such as detecting when an email lacks an `@` symbol) and conditionally disabling the "Next" trigger.

### 2. Prompt Submitted to AI
```text
Explain how to implement real-time client-side validation in React using onChange rather than onSubmit. 
Specifically:
1. If the user is typing an email and omits '@', dynamically render a red error message.
2. If password length is under 8 characters, show a character count warning in real time.
3. How to dynamically validate that 'confirmPassword' matches 'password' on every keystroke.
4. How to conditionally disable the 'Next' button so it is physically unclickable and visually styled as disabled until all fields in the active view clear validation.
```

### 3. Key Concepts Learned & Architectural Synthesis
- **Granular Error State**: Maintain a parallel `errors` state object in the parent. On each input's `onChange` event, execute the validator immediately and update `errors[fieldName]`.
- **Derived Step Validity**: Rather than maintaining a redundant `isNextDisabled` boolean in state (which causes synchronization lag), derive `isStepValid` dynamically using `useMemo` based on active field values and error states.
- **Accessibility & UX**: For disabled buttons, combine standard HTML `disabled={!isStepValid}` with CSS `cursor: not-allowed` and subtle opacity, while pairing inputs with `aria-invalid` and `aria-describedby` pointing to error containers.

---

## Session 3: Password Visibility Toggles & FinTech Security UX (Phase 2 — P1)

### 1. Context & Objective
Users making typos in obscured password fields during mobile onboarding often abandon the registration funnel. We needed to engineer a "Show/Hide Password" eyeball toggle that dynamically flips input types without losing cursor focus.

### 2. Prompt Submitted to AI
```text
What is the recommended React pattern for a Show/Hide password toggle button? 
How do I toggle the input's type between 'password' and 'text' using an eyeball icon, ensure the button doesn't accidentally submit parent forms, and keep the interaction accessible for screen readers?
```

### 3. Key Concepts Learned & Architectural Synthesis
- **Local Boolean State**: Initialize `const [showPassword, setShowPassword] = useState(false)` inside the isolated `<PasswordInput />` component.
- **Dynamic Attribute Binding**: Bind `type={showPassword ? 'text' : 'password'}`.
- **Preventing Accidental Form Submission**: Nested `<button>` elements inside `<form>` tags default to `type="submit"`. The toggle trigger MUST explicitly specify `type="button"`.
- **Accessibility**: Include `aria-label={showPassword ? "Hide password" : "Show password"}` and `tabIndex={-1}` so keyboard users tabbing between fields are not interrupted.

---

## Session 4: Enterprise Form Architecture — React Hook Form & Zod Schema Validation (Phase 3 — P2)

### 1. Context & Objective
While `useState` satisfies base MVP requirements, large enterprise forms with tens of fields suffer from performance degradation because every keystroke triggers a complete re-render of the parent component tree. Phase 3 mandates migrating to `react-hook-form` and `zod` for type-safe schema declarations and isolated re-renders.

### 2. Prompt Submitted to AI
```text
I need to refactor my multi-step registration form from standard useState to react-hook-form paired with Zod schema validation (@hookform/resolvers/zod).
1. Why does React Hook Form offer superior performance over useState in enterprise forms?
2. In a multi-step form where steps unmount conditionally, how do I prevent React Hook Form from discarding data when switching views?
3. How do I construct a Zod schema that enforces:
   - firstName and lastName min 2 characters
   - dateOfBirth verifying the user is at least 18 years old
   - email containing '@' and matching RFC regex
   - password min 8 characters
   - confirmPassword matching password via .refine()
```

### 3. Key Concepts Learned & Architectural Synthesis
- **Uncontrolled State & Isolated Renders**: React Hook Form registers DOM inputs via references, bypassing React's synthetic event reconciliation on every keystroke. This isolates renders exclusively to the active field or error node.
- **The `shouldUnregister: false` Setting**: By default, React Hook Form unregisters fields when their DOM nodes unmount. In multi-step wizards, setting `shouldUnregister: false` in `useForm()` preserves captured values in the form cache across step transitions.
- **Zod Schema Refinement**: Zod allows schema-level validation pipelines:
  ```javascript
  export const stepTwoSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must strictly match",
    path: ["confirmPassword"],
  });
  ```
- **Dual Architecture Demonstration**: To showcase both foundational mastery (Phase 1/2) and enterprise engineering (Phase 3), the application includes an architecture switcher allowing live toggling between the Lifted useState engine and the React Hook Form + Zod engine.

---

## Session 5: Hard-Refreshes & Linux Case-Sensitive Deployments (Technical FAQ #6 & #12)

### 1. Context & Objective
Resolving common build and deployment pitfalls: form submission browser refreshes and Vercel Linux casing crashes.

### 2. Prompt Submitted to AI
```text
Review Sprint 07 Technical FAQ #6 and #12:
1. Why does clicking 'Next' or 'Back' cause the browser to reload the entire page?
2. Why does Vite build successfully on Windows localhost but fails with 'Module not found' on Vercel or Netlify?
```

### 3. Key Concepts Learned & Architectural Synthesis
- **FAQ #6 (Form Button Behavior)**: Any button without an explicit `type` attribute defaults to `type="submit"`. In our wizard, the "Back" button and step transitions are marked with `type="button"`, and the form element encapsulates `onSubmit={(e) => e.preventDefault()}` on intermediary steps. Only the final Step 3 "Submit Registration" button utilizes `type="submit"`.
- **FAQ #12 (Case-Sensitivity on Linux)**: Windows is case-insensitive, meaning `import StepOne from './stepone'` works locally even if the file is `StepOne.jsx`. However, Vercel and Netlify build environments run Linux (Ubuntu), which is strictly case-sensitive. All import declarations were audited to match exact PascalCase filenames (`StepPersonalInfo.jsx`, `StepAccountDetails.jsx`, `StepReviewSubmit.jsx`, `ProgressBar.jsx`).

---

## Summary of Verification Checks Completed

| Phase | Requirement | Implementation Verification | Status |
|---|---|---|:---:|
| **P0** | UI Segmentation (3 Distinct Views) | `StepPersonalInfo`, `StepAccountDetails`, `StepReviewSubmit` conditionally rendered | ✅ Verified |
| **P0** | Navigation Logic (Next & Back) | Step state increment/decrement with bounds checking (1 to 3) | ✅ Verified |
| **P0** | State Lifting & Back Persistence | Form state preserved in parent; verified inputs retain text upon clicking "Back" | ✅ Verified |
| **P0** | Submission Payload & Success State | `console.log(formData)` logged on Step 3; triggers celebratory `SuccessState` | ✅ Verified |
| **P1** | Real-Time onChange Regex | Missing `@` triggers dynamic red warning; 8+ password char counter; match checks | ✅ Verified |
| **P1** | Conditional Next Button Disabling | "Next" button disabled until active view's fields pass validation | ✅ Verified |
| **P1** | Show/Hide Password Eyeball Toggle | Accessible toggle changing input type from `password` to `text` | ✅ Verified |
| **P1** | Dynamic Progress Bar | Stepper header displaying "Step X of 3", active status rings, and progress strip | ✅ Verified |
| **P2** | React Hook Form Integration | Registered inputs with isolated re-renders and `shouldUnregister: false` | ✅ Verified |
| **P2** | Zod Schema Validation | Strict type-safe schema with `.refine()` cross-field validation rules | ✅ Verified |

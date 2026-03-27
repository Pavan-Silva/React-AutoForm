# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-03-27

### Added

- **Type inference** - Full type safety with `defineForm()` and `defineWizard()` helpers for proper literal type preservation
- **Form data caching** - Optional form state persistence via sessionStorage or localStorage with security features:
  - Auto-excludes sensitive fields (password, file)
  - Allowlist support for explicit field control
  - Auto-expiry (7 days)
  - Debounced saves
- **New utility types** - `FormInfer`, `WizardInfer`, `WizardStepValues`, `StepInfer` for manual type extraction

### Changed

- **Unified `actions` prop** - Button rendering now uses `actions={{ renderSubmit }}` for AutoForm and `actions={{ renderPrevious, renderNext, renderSubmit }}` for wizard (replaces individual render props)
- **UI improvements** - Cleaner stepper design with colored badges, improved input styling

### Breaking Changes

- `renderSubmitButton` prop renamed to `actions.renderSubmit` on AutoForm
- `renderPreviousButton`, `renderNextButton`, `renderSubmitButton` props replaced with `actions` object on AutoFormWizard

---

## [1.2.0] - 2026-03-03

### Added

- New `MultiStepForm` component for building multi-step / wizard-style forms.
- Built-in step navigation handling (next, previous).
- Support for preserving form state across steps.
- Seamless integration with existing field renderers and validation logic.

---

## [1.1.0] - 2026-02-19

### Added

- Optional `styles.css` exported and documented (users can `import "@pavan-silva/react-autoform/styles.css"`).
- README CSS API table showing class names and intentionally preserved inline styles.

### Changed

- Improved default styles to a modern, minimal look (tokens + subtle shadows). Reverted input height to `2rem` and kept colors neutral.
- Preserved key inline styles on built-in renderers to guarantee out-of-the-box layout/behavior.
- Moved non-critical styling to `styles.css` while keeping inline rules required for OOTB correctness.

### Fixed

- Checkbox wrapper/class mismatch — CSS now matches structure.

### Notes

- The default CSS is opt-in and can be fully overridden by providing custom renderers.

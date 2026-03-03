# Changelog

All notable changes to this project will be documented in this file.

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

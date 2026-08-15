# Changelog

All notable changes to this project will be documented in this file.

## [2.1.1] - 2026-08-15

### Added

- **`npm test` in the publish workflow** - CI now runs the unit test suite in addition to `typecheck` and `build` before publishing

### Fixed

- **`WizardInfer` / `WizardStepValues` rejected wizards with component-only steps** - the type constraint only allowed steps with a `definition`, so any wizard containing a custom `component` step failed to typecheck when using these utility types (found while validating the README examples)
- **`visibleWhen` combined conditions** - when multiple condition keys were set (e.g. `equals` + `notEquals`), only the first key was evaluated. All provided keys must now match, matching the documented behavior ("all of them must match"); regression tests added

### Docs

- **README examples validated against the published package** - every code sample now typechecks as written:
  - Correct package name (`@pavan-silva/react-autoform`) in all imports
  - `handleSubmit` callbacks annotated with `FormInfer` / `WizardInfer`
  - Added the missing `zod` import to the type-inference sample
  - Custom renderer example uses `FieldRendererProps<string | undefined>` and drops the unused `AutoFormRenderers` import
  - Validation example annotates the definition with `AutoFormDefinition`
  - Removed the invalid `dist/styles.css` import fallback (only the `./styles.css` subpath is exported)

---

## [2.1.0] - 2026-08-14

### Added

- **Conditional fields** - `visibleWhen` on any field shows/hides it based on another field's value (`equals`, `notEquals`, `truthy`, `falsy`). Hidden fields keep their value and are excluded from the generated schema so they never block submission
- **`onValuesChange` prop** - live subscription to form values on both `AutoForm` and `AutoFormWizard` (fires on every change)
- **Async validators** - field validators can now use async Zod refinements (e.g. username uniqueness checks); the submit button disables while validation is in flight
- **New field types** - `radio`, `switch` (boolean toggle) and `multiselect` (array value), all with built-in renderers and CSS
- **Per-field `defaultValue`** - set a default directly on a field; precedence is `defaultValue` < `initialValues` < cached values
- **Nested field keys** - dot-paths (`"address.street"`) produce nested objects with full type inference, validation and submit output
- **Unit tests** - First test suite (`vitest`) covering generated schema logic (required/optional, checkbox/email/date validation, coercion) extended with coverage for the new field types, nested keys, async validators, and visibility evaluation, and `defineForm` type inference (44 tests total)
- **`typecheck` and `test` scripts** - `npm run typecheck` (was missing despite being referenced by CI) and `npm run test`
- **`sideEffects` field** - Marked CSS as the only side-effectful entry so bundlers don't tree-shake `import "@pavan-silva/react-autoform/styles.css"`
- **Explicit `types` export condition** - `exports["."].types` so TypeScript resolves types reliably under `moduleResolution: "node16"`/`"bundler"`

### Changed

- **Dependencies updated to latest** - `zod` ^4.4.3, `react-hook-form` ^7.85.0, `@hookform/resolvers` ^5.7.1, React 19, `@types/react` 19, TypeScript 5.9.3, tsup 8.5.1, Vite 8 (examples)
- **Runtime libs moved to `peerDependencies`** - `react`, `react-dom`, `react-hook-form`, `zod`, `@hookform/resolvers` are no longer duplicated in `dependencies`, avoiding version conflicts for consumers
- **`date` field inference** - Form values now infer `Date` (matching the runtime value) instead of `number`
- **Wizard submit values** - `AutoFormWizard` now runs the generated schema over the raw values and submits parsed/transformed output, consistent with `AutoForm`; values added by custom step components are preserved
- **Optional field values** - Empty optional `number`/`date`/`email`/`select` values resolve to `undefined` instead of `""`
- **Zod 4 API** - Replaced deprecated `.email()` with `z.email()`, `ZodTypeAny` with `z.ZodType`, and `errorMap` with the `error` param
- **Performance** - Fields subscribe to their own `useFormState` (per-key) instead of the full form state; custom renderers are shallow-compared and merged once (`useMergedRenderers`); the cache is read/saved against a stable key instead of object identity
- **Custom wizard steps** - `values` prop is now live via `useWatch` (reactive to edits on the current step)
- **Dynamic schema** - the generated schema now only includes currently visible fields (via a stable resolver reading the latest schema), keeping the form type-safe while hidden required fields can't fail validation
- **Cache** - `allowlist` entries support nested dot-paths (`"address.street"`)
- **Examples** - basic and wizard examples now demonstrate conditional fields, `onValuesChange`, async validation, `defaultValue`, radio/switch/multiselect
- **CI** - Publish workflow uses `npm ci` (was pnpm with a missing `pnpm-lock.yaml`) on Node 22, and runs `typecheck`, `test`, and `build`
- **tsconfig** - `moduleResolution` set to `"bundler"`
- **`defineForm` signature** - the definition parameter is now typed per-element (object → `FieldDef`, array → `FieldDef[]`) instead of a `FieldDef | FieldDef[]` union, so editors can autocomplete field props (`key`, `label`, `type`, `defaultValue`, …) inside `defineForm([...])`
- **New `row()` helper** - wrap a group of fields to place them on one row; unlike a plain nested array, `row(...)` keeps editor autocompletion working for the fields inside the row (works both standalone and inside `defineForm`)
- **Renderers moved into the definition** - the `renderers` prop is removed from `AutoForm`/`AutoFormWizard`. Custom renderers are now declared in the definition: a per-field `renderer` on any `FieldDef`, and/or a per-type `renderers` map passed to `defineForm(definition, { renderers })` / `defineWizard(steps, { renderers })`. Precedence is `field.renderer` → `renderers` map → built-in defaults (breaking change)
- **Default UI redesigned to a modern, shadcn-style theme** - neutral zinc palette (softer primary than pure black), flush focus rings on inputs/buttons/switch, larger refined stepper badges, shadcn-sized switch, auto-height textarea, custom tag-based multiselect with removable chips, styled file input with a `::file-selector-button`, and a custom select chevron with right-edge spacing. A subtle accent (default Facebook-blue, `--af-accent`) colors active/interactive states (active step, switch, radio/checkbox, selected options). Everything stays themeable via CSS variables on `.autoform-container`

### Fixed

- **Editor autocomplete inside `defineForm`** - object literals no longer lose their contextual type (the union element type made editors fall back to unrelated global suggestions); completions and excess-property checks now work inside `defineForm([...])` (regression tests added)

- **Optional fields with custom validators** - a custom validator no longer bypasses the optional/required wrapping, so untouched optional fields pass validation (regression test added)
- **Required `number`/`date`/`checkbox` fields always failed validation** - the required check was piped through `z.string()`, which rejected non-string values; now applied via `z.any().refine(...)`
- **Required checkboxes could be left unchecked** - `required: true` on a checkbox now means it must be checked
- **Cache cleared before `onSubmit` succeeded** - a failed submit no longer discards the user's saved progress; cache is cleared only after a successful submit
- **`package-lock.json` out of sync** - regenerated to match `package.json` (was pinned to 1.2.0 / zod 3)
- **Examples referenced a stale tarball** - updated to the `2.0.0` package archive

---

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

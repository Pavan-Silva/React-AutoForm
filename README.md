# React AutoForm

**React AutoForm** is a fully type-safe, flexible, and UI-agnostic form library for React using **react-hook-form** and **Zod**.  
It allows you to define forms declaratively in JSON, supports multiple fields per row, validation, and custom field renderers.

This library is **agnostic to UI libraries**, so you can use it with **shadcn/ui**, **Material-UI**, **Chakra UI**, or any custom React component.

---

## Features

- Declarative form definition in JSON
- **Automatic type inference** — form values are fully typed based on field definitions
- Support for multiple fields per row
- Automatic Zod validation
- Custom field renderers (UI-agnostic)
- Supports common field types: text, email, number, textarea, select, checkbox, file, date, password
- Multi-step wizard with type-safe step navigation
- Minimal dependencies: `react`, `react-hook-form`, `zod`, `@hookform/resolvers`

---

## Installation

```bash
npm install @pavan-silva/react-autoform
# or using yarn
yarn add @pavan-silva/react-autoform
```

---

## Basic Usage

```ts
import { AutoForm, defineForm } from "react-autoform";
import React from "react";

const formDefinition = defineForm([
  [
    { key: "firstName", label: "First Name", type: "text", required: true },
    { key: "lastName", label: "Last Name", type: "text", required: true },
  ],
  { key: "email", label: "Email", type: "email", required: true },
  { key: "bio", label: "Bio", type: "textarea" },
]);

export default function App() {
  // values is automatically typed based on the form definition
  const handleSubmit = (values) => {
    // TypeScript knows: firstName, lastName are required strings; email is required; bio is optional
    console.log("Form values:", values);
  };

  return (
    <AutoForm
      definition={formDefinition}
      onSubmit={handleSubmit}
      /* you can render a custom submit control:
         actions={{ renderSubmit: ({disabled}) => <button disabled={disabled}>Save</button> }} */
    />
  );
}
```

---

## Type Inference

The library provides powerful type inference out of the box. Use the `defineForm` and `defineWizard` helpers to get full IDE autocompletion:

### `defineForm`

Wraps your form definition to preserve literal types for proper inference:

```ts
import { AutoForm, defineForm } from "react-autoform";

const formDef = defineForm([
  { key: "name", label: "Name", type: "text" },
  { key: "age", label: "Age", type: "number" },
  { key: "email", label: "Email", type: "email" },
  {
    key: "status",
    label: "Status",
    type: "text",
    validator: z.enum(["active", "inactive", "pending"]),
  },
]);

// values is fully typed! TypeScript infers:
// { name: string; age: number; email: string; status: "active" | "inactive" | "pending" }
<AutoForm definition={formDef} onSubmit={(values) => {
  // IDE autocompletion works here!
  console.log(values.name, values.age);
}} />
```

### `defineWizard`

Wraps wizard steps for combined type inference:

```ts
import { AutoFormWizard, defineForm, defineWizard } from "react-autoform";

const personal = defineForm([
  { key: "firstName", label: "First Name", type: "text" },
  { key: "lastName", label: "Last Name", type: "text" },
]);

const address = defineForm([
  { key: "street", label: "Street", type: "text" },
  { key: "city", label: "City", type: "text" },
  { key: "zip", label: "ZIP", type: "number" },
]);

const steps = defineWizard([
  { definition: personal },
  { definition: address },
]);

// onSubmit receives all fields combined: { firstName: string; lastName: string; street: string; city: string; zip: number }
<AutoFormWizard steps={steps} onSubmit={(values) => {
  console.log(values);
}} />
```

### Manual Type Inference

You can also manually extract types using utility types:

```ts
import { FormInfer, WizardInfer, WizardStepValues } from "react-autoform";

// Extract form type from definition
type FormValues = FormInfer<typeof formDef>;

// Extract wizard type from steps
type WizardValues = WizardInfer<typeof steps>;

// Get specific step values
type Step0Values = WizardStepValues<typeof steps, 0>;
```

---

## Multiple Fields Per Row

You can group multiple fields into the same row using an array:

```ts
const formDef: AutoFormDefinition = [
  [
    { key: "firstName", label: "First Name", type: "text" },
    { key: "lastName", label: "Last Name", type: "text" },
  ],
  { key: "email", label: "Email", type: "email" },
];
```

---

## Select / Checkbox / File Inputs

```ts
const formDef: AutoFormDefinition = [
  {
    key: "role",
    label: "Role",
    type: "select",
    options: [
      { label: "Admin", value: "admin" },
      { label: "User", value: "user" },
    ],
  },
  { key: "acceptTerms", label: "Accept Terms", type: "checkbox" },
  {
    key: "profilePic",
    label: "Profile Picture",
    type: "file",
    accept: "image/*",
  },
];
```

---

## Form Validation

- AutoForm automatically generates a Zod schema based on your JSON definition.
- You can also define inline validators inside each field.

**Error display:** validation errors are shown inline under each field by default to improve UX.

```ts
const formDef = [
  {
    key: "email",
    label: "Email",
    type: "email",
    required: true,
    validator: z
      .string()
      .regex(/.+@.+/, "Email must contain an @ symbol")
      .min(5, "Email must be at least 5 characters")
      .max(50, "Email must be at most 50 characters"),
  },
];
```

---

## Initial Values

```ts
const initialValues = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
};

<AutoForm
  definition={formDef}
  initialValues={initialValues}
  onSubmit={handleSubmit}
/>;
```

---

## Multi‑Step Forms

For more complex flows you can use the `AutoFormWizard` component. It shares
`react-hook-form` state across all steps and will run validation specific to the
current step when the user advances. A modern step indicator header is
rendered automatically when you supply `title` values for each step, showing
the current, completed, and upcoming stages with a clean, minimal style. Steps
can either be defined as `AutoFormDefinition` objects or you can supply a
completely custom React component when you need fine‑grained control.

```ts
import {
  AutoFormWizard,
  defineForm,
  defineWizard,
} from "react-autoform";

const personal = defineForm([
  { key: "firstName", label: "First Name", type: "text" },
  { key: "lastName", label: "Last Name", type: "text" },
]);

const address = defineForm([
  { key: "street", label: "Street", type: "text" },
  { key: "city", label: "City", type: "text" },
  { key: "zip", label: "ZIP code", type: "number" },
]);

const steps = defineWizard([
  { key: "personal", title: "Personal info", definition: personal },
  { key: "address", title: "Address", definition: address },
  {
    key: "review",
    title: "Review",
    component: ({ formMethods, next, previous }) => {
      const values = formMethods.getValues();
      return (
        <div>
          <pre>{JSON.stringify(values, null, 2)}</pre>
          <button type="button" onClick={previous}>
            Back
          </button>
          <button type="button" onClick={next}>
            Submit
          </button>
        </div>
      );
    },
  },
]);

function App() {
  // onSubmit receives fully typed values from all steps
  const handleSubmit = (values) => {
    // values is: { firstName: string; lastName: string; street: string; city: string; zip: number }
    console.log("final submit", values);
  };

  return (
    <AutoFormWizard
      steps={steps}
      onSubmit={handleSubmit}
      /* you can override buttons via the actions prop:
         actions={{
           renderNext: ({onClick}) => <button onClick={onClick}>→</button>,
           renderSubmit: ({onClick}) => <button onClick={onClick}>Finish</button>,
         }} */
    />
  );
}
```

The wizard now renders a full‑width step indicator with each title left‑aligned
and a colored underline showing progress. If you prefer custom markup you can
pass your own component via the `stepIndicator` prop; it will be given a
`steps`, `currentIndex` and `totalSteps` object so you can render whatever you
like.

Each step object also accepts `onNext`/`onPrevious` callbacks that are invoked
when the user attempts to move between steps. Returning `false` (or a promise
that resolves to `false`) from `onNext` prevents navigation, which is handy for
async side‑effects:

```ts
{
  definition: personal,
  onNext: async (values) => {
    const ok = await saveDraft(values);
    return ok; // if false, the step won't advance
  },
}
```

The custom `component` variant receives a set of helpers (`next`, `previous`,
`stepIndex`, etc.) plus the raw `formMethods` object so you can render whatever
markup or controls you like.

---

## Form Data Caching

AutoForm can persist form values to browser storage (sessionStorage or localStorage), allowing users to resume where they left off after a page reload.

```ts
import { AutoForm } from "react-autoform";

<AutoForm
  cache={{ enabled: true, key: "contact-form" }}
  definition={formDef}
  onSubmit={handleSubmit}
/>
```

### Cache Config

| Option      | Type                   | Default     | Description                          |
| ----------- | ---------------------- | ----------- | ------------------------------------ |
| `enabled`   | `boolean`              | `false`     | Enable/disable caching               |
| `key`       | `string`               | required    | Unique identifier for this form      |
| `storage`   | `"session" \| "local"` | `"session"` | Storage type                         |
| `allowlist` | `readonly string[]`    | undefined   | Only cache these specific field keys |

### Security

Cached data is stored as plain JSON in the browser's storage, accessible to:

- Any script on your domain
- XSS attacks
- Browser dev tools

**By design, sensitive fields are automatically excluded:**

- Fields named `password` or `file` are never cached

**For additional control, use the `allowlist` option:**

```ts
<AutoForm
  cache={{
    enabled: true,
    key: "contact-form",
    allowlist: ["firstName", "lastName", "email"]  // Only these fields are cached
  }}
  definition={formDef}
  onSubmit={handleSubmit}
/>
```

**Best practices:**

- Only cache non-sensitive data
- Use `allowlist` to explicitly control which fields persist
- Use `session` storage for temporary data (default)
- Use `local` storage only when you need cross-session persistence

### Exported Cache Utilities

```ts
import {
  loadCachedValues,
  saveCachedValues,
  clearCachedValues,
} from "react-autoform";

// Load cached values manually
const cached = loadCachedValues<MyFormValues>({
  enabled: true,
  key: "my-form",
});

// Clear cache on logout
clearCachedValues({ key: "my-form" });
```

---

## Custom Renderers

You can pass your own components for each field type:

```ts
import {
  AutoForm,
  AutoFormDefinition,
  AutoFormRenderers,
  defaultRenderers,
} from "react-autoform";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const formDef: AutoFormDefinition = [
  { key: "firstName", label: "First Name", type: "text" },
  { key: "bio", label: "Bio", type: "textarea" },
];

// you can override or extend the default renderers
const renderers: AutoFormRenderers = {
  text: ({ field, value, onChange }) => (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
    />
  ),
};

<AutoForm
  definition={formDef}
  onSubmit={(v) => console.log(v)}
  renderers={renderers}
/>;
```

---

## Default Renderers

This library ships with a set of default renderers which you can import via `defaultRenderers` or `Renderers` (named exports) if you want to reuse or compose them in your app.

```ts
import { defaultRenderers, Renderers } from "react-autoform";
// defaultRenderers.text etc.
```

---

## Optional CSS

This package ships an **opt-in** CSS file with basic, themeable styles for the built-in renderers. Import it if you want the default look — otherwise the library is completely unstyled and you can provide custom renderers.

Usage:

```js
// preferred: package subpath (supported by bundlers)
import "@pavan-silva/react-autoform/styles.css";

// fallback:
// import "@pavan-silva/react-autoform/dist/styles.css";
```

The default CSS targets the provided class names (for example `autoform-text`, `autoform-label`, `autoform-submit`) so you can fully override styles in your app CSS or by replacing renderers.

### CSS API — class names & preserved inline styles

The built-in renderers expose a small, stable CSS surface so you can opt in to the default look or fully replace styles. A few inline styles are intentionally preserved on the built-in components to guarantee correct out-of-the-box layout and accessibility.

Key class names (purpose + intentionally preserved inline styles):

| Class                                                                                                                                               | Purpose                                      | Preserved inline styles                                          |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------- |
| `autoform-container`                                                                                                                                | Top-level wrapper (theme tokens / variables) | —                                                                |
| `autoform-row`                                                                                                                                      | Row wrapper                                  | `display:flex; gap:12px; margin-bottom:16px;`                    |
| `autoform-field`                                                                                                                                    | Field container                              | `flex:1; min-width:0;`                                           |
| `autoform-label`                                                                                                                                    | Field label                                  | `display:block; margin-bottom:8px;`                              |
| `autoform-text`, `autoform-email`, `autoform-number`, `autoform-password`, `autoform-date`, `autoform-textarea`, `autoform-select`, `autoform-file` | Inputs                                       | `display:block; width:100%; padding:6px; box-sizing:border-box;` |
| `autoform-checkbox`                                                                                                                                 | Checkbox wrapper                             | `display:flex; align-items:center; gap:8px;`                     |
| `autoform-error`                                                                                                                                    | Error text                                   | `color:#c53030; margin-top:6px;`                                 |
| `autoform-submit`                                                                                                                                   | Submit button                                | — (styled via CSS)                                               |

Notes:

- Preserved inline styles apply only to the **built-in** renderers (so the library works OOTB). To change those exact inline rules, provide a custom renderer — that is the supported override path.
- The optional `styles.css` styles the above class names but cannot override inline styles; use custom renderers for full control.

---

## API Reference

### Props Overview

| Prop          | Type                                                | Description              |
| ------------- | --------------------------------------------------- | ------------------------ |
| definition    | `AutoFormDefinition`                                | The JSON form definition |
| initialValues | `Partial<FormInfer<TDef>>` (optional)               | Default form values      |
| onSubmit      | `(values) => void \| Promise<void>`                 | Called on submit         |
| actions       | `{ renderSubmit?: (opts) => ReactNode }` (optional) | Custom submit button     |
| cache         | `FormCacheConfig` (optional)                        | Enable form data caching |
| renderers     | `AutoFormRenderers` (optional)                      | Custom field renderers   |

### Wizard Props

| Prop          | Type                                                          | Description                     |
| ------------- | ------------------------------------------------------------- | ------------------------------- |
| steps         | `readonly AutoFormStep[]`                                     | Array of wizard steps           |
| onSubmit      | `(values) => void \| Promise<void>`                           | Called on final submit          |
| actions       | `{ renderPrevious?, renderNext?, renderSubmit? }` (optional)  | Custom navigation buttons       |
| stepIndicator | `ComponentType<{steps, currentIndex, totalSteps}>` (optional) | Custom step indicator component |
| initialValues | `Partial<WizardInfer<TSteps>>` (optional)                     | Initial form values             |
| cache         | `FormCacheConfig` (optional)                                  | Enable form data caching        |
| renderers     | `AutoFormRenderers` (optional)                                | Custom field renderers          |

### Field Types

| Type     | Description                   |
| -------- | ----------------------------- |
| text     | Standard text input           |
| email    | Email input with validation   |
| number   | Number input                  |
| textarea | Multi-line input              |
| select   | Dropdown with `options` array |
| checkbox | Boolean checkbox              |
| file     | File input                    |
| date     | Date input                    |
| password | Password input                |

### Helper Functions

| Function                 | Description                                      |
| ------------------------ | ------------------------------------------------ |
| `defineForm(definition)` | Preserve literal types for form field inference  |
| `defineWizard(steps)`    | Preserve literal types for wizard step inference |

### Utility Types

| Type                               | Description                                                                |
| ---------------------------------- | -------------------------------------------------------------------------- |
| `FormInfer<TDef>`                  | Infer form values from field definitions                                   |
| `FormInferFromDefinition<T>`       | Infer form values from `AutoFormDefinition`                                |
| `WizardInfer<TSteps>`              | Infer full form type from wizard steps                                     |
| `WizardStepValues<TSteps, TIndex>` | Infer values for a specific step                                           |
| `StepInfer<T>`                     | Infer values for a single step definition                                  |
| `FieldDef<TKey, TValidator>`       | Field definition type                                                      |
| `FieldRenderer<T>`                 | Custom renderer function type                                              |
| `FieldRendererProps<T>`            | Props passed to custom renderers                                           |
| `AutoFormActions`                  | Actions config for AutoForm (`{ renderSubmit }`)                           |
| `AutoFormWizardActions`            | Actions config for wizard (`{ renderPrevious, renderNext, renderSubmit }`) |
| `FormCacheConfig`                  | Cache configuration options                                                |

---

## Examples

See the `examples/` folder included in this repo for small Vite + React demos:

- `basic` — default renderers, custom renderers, and type inference
- `wizard` — wizard-style flow using `AutoFormWizard` with type-safe steps

Each example shows a simple setup with `react-hook-form` + Zod and builds with
Vite.

Run a specific example (e.g. basic):

```bash
cd examples/basic
npm install
npm run dev
```

---

## License

MIT License

# React AutoForm

**React AutoForm** is a fully type-safe, flexible, and UI-agnostic form library for React using **react-hook-form** and **Zod**.  
It allows you to define forms declaratively in JSON, supports multiple fields per row, validation, and custom field renderers.

This library is **agnostic to UI libraries**, so you can use it with **shadcn/ui**, **Material-UI**, **Chakra UI**, or any custom React component.

---

## Features

- Declarative form definition in JSON
- Type-safe field definitions with TypeScript
- Support for multiple fields per row
- Automatic Zod validation
- Custom field renderers (UI-agnostic)
- Supports common field types: text, email, number, textarea, select, checkbox, file, date, password
- Minimal dependencies: `react`, `react-hook-form`, `zod`, `@hookform/resolvers`

---

## Installation

```bash
npm install @pavan-silva/react-autoform
# or using yarn
yarn add @pavan-silva/react-autoform
```

## Basic Usage

```ts
import { AutoForm, AutoFormDefinition } from "react-autoform";
import React from "react";

const formDefinition: AutoFormDefinition = [
  [
    { key: "firstName", label: "First Name", type: "text", required: true },
    { key: "lastName", label: "Last Name", type: "text", required: true },
  ],
  { key: "email", label: "Email", type: "email", required: true },
  { key: "bio", label: "Bio", type: "textarea" },
];

export default function App() {
  const handleSubmit = (values: Record<string, unknown>) => {
    console.log("Form values:", values);
  };

  return (
    <AutoForm
      definition={formDefinition}
      onSubmit={handleSubmit}
      /* you can render a custom submit control if you like:
         renderSubmitButton={({disabled}) => <button disabled={disabled}>Save</button>} */
    />
  );
}
```

## Examples

See the `examples/` folder included in this repo for small Vite + React demos:

- `basic` — default renderers and how to override them
- `wizard` — wizard-style flow using `AutoFormWizard` with custom step components

Each example shows a simple setup with `react-hook-form` + Zod and builds with
Vite.

Run a specific example (e.g. basic):

```bash
cd examples/basic
npm install
npm run dev
```

## Default Renderers

This library ships with a set of default renderers which you can import via `defaultRenderers` or `Renderers` (named exports) if you want to reuse or compose them in your app.

```ts
import { defaultRenderers, Renderers } from "react-autoform";
// defaultRenderers.text etc.
```

## Optional default CSS

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
  AutoFormStep,
  AutoFormDefinition,
} from "react-autoform";

const personal: AutoFormDefinition = [
  { key: "firstName", label: "First Name", type: "text" },
  { key: "lastName", label: "Last Name", type: "text" },
];

const address: AutoFormDefinition = [
  { key: "street", label: "Street", type: "text" },
  { key: "city", label: "City", type: "text" },
  { key: "zip", label: "ZIP code", type: "number" },
];

const steps: AutoFormStep[] = [
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
];

function App() {
  const handleSubmit = (values: Record<string, unknown>) => {
    console.log("final submit", values);
  };

  return (
    <AutoFormWizard
      steps={steps}
      onSubmit={handleSubmit}
      /* you can override the navigation controls via render props:
         renderNextButton={({onClick}) => <button onClick={onClick}>→</button>}
         renderSubmitButton={({onClick}) => <button onClick={onClick}>Finish</button> */
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

## Props Overview

| Prop                 | Type                                                                                       | Description                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| definition           | `AutoFormDefinition`                                                                       | The JSON form definition                                                             |
| initialValues        | `Record<string, unknown>` (optional)                                                       | Default form values                                                                  |
| onSubmit             | `(values: Record<string, unknown>) => void \| Promise<void>`                               | Called on submit                                                                     |
| renderPreviousButton | `(opts:{onClick:()=>void;disabled:boolean}) => React.ReactNode` (optional)                 | Render prop for a completely custom previous control                                 |
| renderNextButton     | `(opts:{onClick:()=>void;disabled:boolean;isFinal:boolean}) => React.ReactNode` (optional) | Render prop for a custom next/submit control                                         |
| renderSubmitButton   | `(opts:{onClick:()=>void;disabled:boolean}) => React.ReactNode` (optional)                 | Render prop used on the final wizard step (takes precedence over `renderNextButton`) |
| className            | `string` (optional)                                                                        | CSS class for form container                                                         |
| renderers            | `AutoFormRenderers` (optional)                                                             | Custom component renderers                                                           |

## Field Types

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

## License

MIT License

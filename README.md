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
npm install react-autoform
# or using yarn
yarn add react-autoform
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
      submitLabel="Save"
    />
  );
}
```

## Examples

See the `examples/` folder included in this repo for a small Vite + React example that demonstrates:

- Using the default renderers
- Overriding a renderer with your UI system
- Performance tip: built with `Controller` and memoized renderers to reduce re-renders

Run the example (inside `examples/basic`):

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

## Props Overview

| Prop          | Type                                                         | Description                  |
| ------------- | ------------------------------------------------------------ | ---------------------------- |
| definition    | `AutoFormDefinition`                                         | The JSON form definition     |
| initialValues | `Record<string, unknown>` (optional)                         | Default form values          |
| onSubmit      | `(values: Record<string, unknown>) => void \| Promise<void>` | Called on submit             |
| submitLabel   | `string` (optional)                                          | Text for submit button       |
| className     | `string` (optional)                                          | CSS class for form container |
| renderers     | `AutoFormRenderers` (optional)                               | Custom component renderers   |

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

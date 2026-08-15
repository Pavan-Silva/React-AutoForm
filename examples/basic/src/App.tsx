import {
  AutoForm,
  defineForm,
  row,
} from "@pavan-silva/react-autoform";
import type {
  FieldRenderer,
  FormInfer,
} from "@pavan-silva/react-autoform";
import { useState } from "react";
import z from "zod";

import "@pavan-silva/react-autoform/styles.css";

const MyInput: FieldRenderer<string | undefined> = ({
  field,
  value,
  onChange,
}) => (
  <div>
    <label style={{ display: "block", marginBottom: 6 }}>
      {field.label} (custom)
    </label>
    <input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      style={{
        padding: 8,
        width: "100%",
        borderRadius: 6,
        border: "1px solid #ddd",
        boxSizing: "border-box",
      }}
    />
  </div>
);

const CustomEmail: FieldRenderer<string | undefined> = ({
  field,
  value,
  onChange,
}) => (
  <div>
    <label style={{ display: "block", marginBottom: 6 }}>
      {field.label} (per-field custom email)
    </label>
    <input
      type="email"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: 8,
        width: "100%",
        borderRadius: 6,
        border: "1px solid rebeccapurple",
        boxSizing: "border-box",
      }}
    />
  </div>
);

const formDef = defineForm([
  row([
    { key: "firstName", label: "First Name", type: "text", required: true },
    { key: "lastName", label: "Last Name", type: "text" },
  ]),
  {
    key: "email",
    label: "Email",
    type: "email",
    required: true,
    renderer: CustomEmail,
  },
  {
    key: "username",
    label: "Username",
    type: "text",
    validator: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .refine(async (v) => v !== "admin", "Username is already taken"),
  },
  {
    key: "bio",
    label: "Bio",
    type: "textarea",
    validator: z
      .string()
      .trim()
      .min(10, "Bio must be at least 10 characters")
      .max(200, "Bio must be at most 200 characters"),
  },
  {
    key: "country",
    label: "Country",
    type: "select",
    defaultValue: "US",
    options: [
      { label: "United States", value: "US" },
      { label: "United Kingdom", value: "UK" },
      { label: "Canada", value: "CA" },
    ],
  },
  {
    key: "state",
    label: "State",
    type: "text",
    placeholder: "Only shown for US",
    visibleWhen: { field: "country", equals: "US" },
  },
  {
    key: "role",
    label: "Role",
    type: "radio",
    defaultValue: "admin",
    options: [
      { label: "Admin", value: "admin" },
      { label: "User", value: "user" },
      { label: "Guest", value: "guest" },
    ],
  },
  {
    key: "tags",
    label: "Tags",
    type: "multiselect",
    options: [
      { label: "React", value: "react" },
      { label: "TypeScript", value: "ts" },
      { label: "Zod", value: "zod" },
    ],
  },
  { key: "notify", label: "Email me updates", type: "switch", defaultValue: true },
  { key: "accept", label: "Accept Terms", type: "checkbox", required: true },
], {
  renderers: {
    text: MyInput,
  },
});

// Same fields, but no custom renderers at all — every field uses the
// library's built-in default renderers.
const defaultFormDef = defineForm([
  row([
    { key: "firstName", label: "First Name", type: "text", required: true },
    { key: "lastName", label: "Last Name", type: "text" },
  ]),
  {
    key: "email",
    label: "Email",
    type: "email",
    required: true,
  },
  {
    key: "username",
    label: "Username",
    type: "text",
    validator: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .refine(async (v) => v !== "admin", "Username is already taken"),
  },
  {
    key: "bio",
    label: "Bio",
    type: "textarea",
    validator: z
      .string()
      .trim()
      .min(10, "Bio must be at least 10 characters")
      .max(200, "Bio must be at most 200 characters"),
  },
  {
    key: "country",
    label: "Country",
    type: "select",
    defaultValue: "US",
    options: [
      { label: "United States", value: "US" },
      { label: "United Kingdom", value: "UK" },
      { label: "Canada", value: "CA" },
    ],
  },
  {
    key: "state",
    label: "State",
    type: "text",
    placeholder: "Only shown for US",
    visibleWhen: { field: "country", equals: "US" },
  },
  {
    key: "role",
    label: "Role",
    type: "radio",
    defaultValue: "admin",
    options: [
      { label: "Admin", value: "admin" },
      { label: "User", value: "user" },
      { label: "Guest", value: "guest" },
    ],
  },
  {
    key: "tags",
    label: "Tags",
    type: "multiselect",
    options: [
      { label: "React", value: "react" },
      { label: "TypeScript", value: "ts" },
      { label: "Zod", value: "zod" },
    ],
  },
  { key: "notify", label: "Email me updates", type: "switch", defaultValue: true },
  { key: "accept", label: "Accept Terms", type: "checkbox", required: true },
]);

type FormValues = FormInfer<typeof formDef>;

export default function App() {
  const [liveValues, setLiveValues] = useState<FormValues>({} as FormValues);

  const handleSubmit = (values: FormValues) => {
    // values is fully typed based on the form definition!
    alert(JSON.stringify(values, null, 2));
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h1>React AutoForm — Example</h1>
      <p>
        In the first form, all `text` fields use a custom renderer (set via the
        `renderers` map) and the `email` field uses its own per-field renderer.
        Hover over the form definition to see type inference in action!
      </p>

      <AutoForm
        definition={formDef}
        onSubmit={handleSubmit}
        initialValues={{ firstName: "John" }}
        onValuesChange={setLiveValues}
        actions={{
          renderSubmit: ({ disabled }) => (
            <button
              type="submit"
              disabled={disabled}
              style={{
                background: "teal",
                color: "#fff",
                padding: "8px 16px",
                border: "none",
                borderRadius: 4,
              }}
            >
              Custom save
            </button>
          ),
        }}
      />

      <details style={{ margin: "16px 0" }}>
        <summary>Live values (via onValuesChange)</summary>
        <pre>{JSON.stringify(liveValues, null, 2)}</pre>
      </details>

      <hr style={{ margin: "20px 0" }} />

      <h2>Same fields, default renderers</h2>
      <p>
        The same fields rendered with the library's built-in default renderers —
        no custom renderers attached.
      </p>
      <AutoForm definition={defaultFormDef} onSubmit={handleSubmit} />
    </div>
  );
}

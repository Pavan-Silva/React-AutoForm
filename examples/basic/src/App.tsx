import {
  AutoForm,
  AutoFormDefinition,
  defaultRenderers,
} from "@pavan-silva/react-autoform";
import type { FieldRendererProps } from "@pavan-silva/react-autoform";
import React from "react";
import z from "zod";

const formDef: AutoFormDefinition = [
  [
    { key: "firstName", label: "First Name", type: "text", required: true },
    { key: "lastName", label: "Last Name", type: "text" },
  ],
  { key: "email", label: "Email", type: "email", required: true },
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
    key: "role",
    label: "Role",
    type: "select",
    options: [
      { label: "Admin", value: "admin" },
      { label: "User", value: "user" },
    ],
  },
  { key: "accept", label: "Accept Terms", type: "checkbox" },
];

const MyInput: React.FC<FieldRendererProps<string | undefined>> = ({
  field,
  value,
  onChange,
}) => (
  <div style={{ marginBottom: 12 }}>
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

export default function App() {
  const handleSubmit = (values: Record<string, unknown>) => {
    alert(JSON.stringify(values, null, 2));
  };

  const renderers = {
    ...defaultRenderers,
    text: MyInput,
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h1>React AutoForm — Example</h1>
      <p>
        Default renderers are used, but `text` is overridden to show
        customization.
      </p>

      <AutoForm
        definition={formDef}
        onSubmit={handleSubmit}
        renderers={renderers}
        submitLabel="Save"
      />

      <hr />

      <h2>Using default renderers directly</h2>
      <AutoForm definition={formDef} onSubmit={handleSubmit} />
    </div>
  );
}

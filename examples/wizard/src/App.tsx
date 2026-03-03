import React from "react";
import {
  AutoFormWizard,
  AutoFormStep,
  AutoFormDefinition,
} from "@pavan-silva/react-autoform";
import "@pavan-silva/react-autoform/styles.css";

// simple fields we will reuse
const personal: AutoFormDefinition = [
  { key: "firstName", label: "First Name", type: "text", required: true },
  { key: "lastName", label: "Last Name", type: "text" },
];

const address: AutoFormDefinition = [
  { key: "street", label: "Street", type: "text" },
  { key: "city", label: "City", type: "text" },
  { key: "zip", label: "ZIP", type: "number" },
];

const steps: AutoFormStep[] = [
  { key: "personal", title: "Personal", definition: personal },
  { key: "address", title: "Address", definition: address },
  {
    key: "review",
    title: "Review",
    component: ({ formMethods, previous, next }) => {
      const values = formMethods.getValues();
      return (
        <div style={{ whiteSpace: "pre-wrap" }}>
          <h2>Review</h2>
          <pre>{JSON.stringify(values, null, 2)}</pre>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button type="button" onClick={previous}>
              Back
            </button>
            <button type="button" onClick={next}>
              Submit
            </button>
          </div>
        </div>
      );
    },
  },
];

export default function App() {
  const handleSubmit = (v: Record<string, unknown>) => {
    alert("final values: " + JSON.stringify(v, null, 2));
  };

  // tiny custom indicator just to demonstrate the prop
  const MyIndicator: React.FC<{
    steps: AutoFormStep[];
    currentIndex: number;
    totalSteps: number;
  }> = ({ steps, currentIndex }) => (
    <div style={{ textAlign: "center", marginBottom: 16 }}>
      Step {currentIndex + 1} of {steps.length}
    </div>
  );

  return (
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <h1>Multi‑Step Example</h1>
      <p style={{ marginBottom: 40 }}>
        A simple three-step wizard using AutoFormWizard.
      </p>

      <AutoFormWizard
        steps={steps}
        onSubmit={handleSubmit}
        // you can override the buttons via render props:
        // renderNextButton={({onClick}) => <button onClick={onClick}>→</button>}
        // renderSubmitButton={({onClick}) => <button onClick={onClick}>Finish</button>}

        // you can use a custom step indicator
        // stepIndicator={MyIndicator}
      />
    </div>
  );
}

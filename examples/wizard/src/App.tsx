import {
  AutoFormWizard,
  defineForm,
  defineWizard,
} from "@pavan-silva/react-autoform";
import "@pavan-silva/react-autoform/styles.css";

const personal = defineForm([
  { key: "firstName", label: "First Name", type: "text", required: true },
  { key: "lastName", label: "Last Name", type: "text" },
]);

const address = defineForm([
  { key: "street", label: "Street", type: "text" },
  { key: "city", label: "City", type: "text" },
  { key: "zip", label: "ZIP", type: "number" },
]);

const steps = defineWizard([
  { key: "personal", title: "Personal", definition: personal },
  { key: "address", title: "Address", definition: address },
  {
    key: "review",
    title: "Review",
    component: ({
      formMethods,
      previous,
      next,
    }: {
      formMethods: any;
      previous: () => void;
      next: () => void;
    }) => {
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
]);

export default function App() {
  const handleSubmit = (values: {
    firstName: string;
    lastName?: string;
    street?: string;
    city?: string;
    zip?: number;
  }) => {
    // values is fully typed from all wizard steps combined!
    alert("final values: " + JSON.stringify(values, null, 2));
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <h1>Multi‑Step Example</h1>
      <p style={{ marginBottom: 40 }}>
        A simple three-step wizard using AutoFormWizard. Hover over the steps
        definition to see type inference!
      </p>

      <AutoFormWizard
        steps={steps}
        onSubmit={handleSubmit}
        // you can override buttons via the actions prop:
        // actions={{
        //   renderNext: ({onClick}) => <button onClick={onClick}>→</button>,
        //   renderSubmit: ({onClick}) => <button onClick={onClick}>Finish</button>,
        // }}
      />
    </div>
  );
}

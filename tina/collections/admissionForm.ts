import type { Collection } from "tinacms";

export const AdmissionFormCollection = (
  label = "Admission Form",
): Collection => ({
  name: "admissionForm",
  label,
  path: "content/admission-form",
  format: "json",
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
  },
  fields: [
    {
      name: "intro",
      label: "Page Intro",
      type: "rich-text",
      description: "Paragraph shown above the form.",
    },
    {
      name: "sessionOptions",
      label: "Session Dropdown Options",
      type: "string",
      list: true,
      description:
        "Each entry becomes one option in the session dropdown (e.g. \"2026–2027\").",
    },
    {
      name: "headings",
      label: "Section Headings",
      type: "object",
      fields: [
        { name: "session", label: "Session", type: "string" },
        { name: "child", label: "Child's Information", type: "string" },
        { name: "parents", label: "Parents' Information", type: "string" },
        { name: "motherDetails", label: "Mother's Details Sub-heading", type: "string" },
        { name: "fatherDetails", label: "Father's Details Sub-heading", type: "string" },
        { name: "sibling", label: "Sibling(s) Information", type: "string" },
        { name: "emergency", label: "Emergency Contact", type: "string" },
        { name: "hearAbout", label: "How did you hear about us?", type: "string" },
        { name: "fit", label: "Why Kiva is a good fit?", type: "string" },
        { name: "declaration", label: "Declaration", type: "string" },
      ],
    },
    {
      name: "prompts",
      label: "Question Prompts",
      type: "object",
      fields: [
        {
          name: "appliedBefore",
          label: "Applied Before Prompt",
          type: "string",
        },
        {
          name: "progressReport",
          label: "Progress Report Prompt",
          type: "string",
        },
        {
          name: "specialNeeds",
          label: "Special Needs Prompt",
          type: "string",
        },
      ],
    },
    {
      name: "specialNeeds",
      label: "Special Needs Messaging",
      type: "object",
      fields: [
        {
          name: "helperText",
          label: "Helper Text (under the question)",
          type: "string",
          ui: { component: "textarea" },
        },
        {
          name: "modalTitle",
          label: "Modal Title (shown when 'Yes' is selected)",
          type: "string",
        },
        {
          name: "modalBody",
          label: "Modal Body",
          type: "rich-text",
          description:
            "Shown in the popup when a parent selects 'Yes' for special needs. Submission is blocked.",
        },
      ],
    },
    {
      name: "declarationStatement",
      label: "Declaration Statement",
      type: "string",
      ui: { component: "textarea" },
      description: "Text next to the declaration checkbox.",
    },
    {
      name: "signatureLabel",
      label: "Signature Field Label",
      type: "string",
    },
    {
      name: "submitButtonText",
      label: "Submit Button Text",
      type: "string",
    },
    {
      name: "success",
      label: "Success Notification",
      type: "object",
      fields: [
        { name: "title", label: "Title", type: "string" },
        {
          name: "message",
          label: "Message",
          type: "string",
          ui: { component: "textarea" },
        },
      ],
    },
  ],
});

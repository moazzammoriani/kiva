import type { Collection } from "tinacms";

export const AdmissionProcessCollection = (label = "Admission Process"): Collection => ({
  name: "admissionProcess",
  label,
  path: "content/admission-process",
  format: "json",
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
  },
  fields: [
    {
      name: "heroImage",
      label: "Hero Banner Image",
      type: "image",
    },
    {
      name: "title",
      label: "Section Title",
      type: "string",
    },
    {
      name: "processDiagram",
      label: "Process Diagram (Desktop)",
      type: "image",
    },
    {
      name: "processDiagramMobile",
      label: "Process Diagram (Mobile)",
      type: "image",
    },
    {
      name: "buttonText",
      label: "Button Text",
      type: "string",
    },
    {
      name: "faqsTitle",
      label: "FAQs Section Title",
      type: "string",
    },
    {
      name: "faqs",
      label: "FAQs",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.title || "New FAQ" }),
      },
      fields: [
        {
          name: "title",
          label: "Question",
          type: "string",
        },
        {
          name: "content",
          label: "Answer",
          type: "rich-text",
        },
      ],
    },
  ],
});

import type { Collection } from "tinacms";

export const AdmissionTermsCollection = (
  label = "Admission Terms and Conditions",
): Collection => ({
  name: "admissionTerms",
  label,
  path: "content/admission-terms",
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
      name: "heroAlt",
      label: "Hero Alt Text",
      type: "string",
    },
    {
      name: "pageTitle",
      label: "Browser Page Title",
      type: "string",
    },
    {
      name: "sectionTitle",
      label: "Section Title",
      type: "string",
    },
    {
      name: "sectionDescription",
      label: "Section Description",
      type: "string",
    },
    {
      name: "sections",
      label: "Terms Sections",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.title || "Terms Section" }),
      },
      fields: [
        {
          name: "title",
          label: "Heading",
          type: "string",
        },
        {
          name: "body",
          label: "Body",
          type: "rich-text",
        },
      ],
    },
  ],
});

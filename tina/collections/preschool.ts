import type { Collection } from "tinacms";

const imageFields = [
  {
    name: "src",
    label: "Image",
    type: "image" as const,
  },
  {
    name: "alt",
    label: "Alt Text",
    type: "string" as const,
  },
];

export const PreschoolCollection: Collection = {
  name: "preschool",
  label: "Preschool & Elementary",
  path: "content/preschool",
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
      name: "preschoolTitle",
      label: "Pre-School Section Title",
      type: "string",
    },
    {
      name: "preschoolIntro",
      label: "Pre-School Introduction",
      type: "rich-text",
    },
    {
      name: "preschoolImages",
      label: "Pre-School Gallery Images",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.alt || "Gallery Image" }),
      },
      fields: imageFields,
    },
    {
      name: "curiosityApproach",
      label: "Curiosity Approach Paragraph",
      type: "rich-text",
    },
    {
      name: "ageGroups",
      label: "Age Groups",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.name || "Age Group" }),
      },
      fields: [
        {
          name: "name",
          label: "Group Name",
          type: "string",
        },
        {
          name: "ageRange",
          label: "Age Range",
          type: "string",
        },
      ],
    },
    {
      name: "elementaryTitle",
      label: "Elementary Section Title",
      type: "string",
    },
    {
      name: "elementaryIntro",
      label: "Elementary Introduction",
      type: "rich-text",
    },
    {
      name: "elementaryImages",
      label: "Elementary Gallery Images",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.alt || "Gallery Image" }),
      },
      fields: imageFields,
    },
    {
      name: "elementarySecond",
      label: "Elementary Second Paragraph",
      type: "rich-text",
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
};

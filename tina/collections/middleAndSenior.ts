import type { Collection } from "tinacms";

export const MiddleAndSeniorCollection = (label = "Senior School"): Collection => ({
  name: "middleAndSenior",
  label,
  path: "content/middle-and-senior",
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
      name: "galleryImages",
      label: "Gallery Images",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.alt || "Gallery Image" }),
      },
      fields: [
        {
          name: "src",
          label: "Image",
          type: "image",
        },
        {
          name: "alt",
          label: "Alt Text",
          type: "string",
        },
      ],
    },
    {
      name: "bodyText",
      label: "Body Text",
      type: "rich-text",
    },
    {
      name: "buttonText",
      label: "Button Text",
      type: "string",
    },
    {
      name: "buttonLink",
      label: "Button Link",
      type: "string",
    },
  ],
});

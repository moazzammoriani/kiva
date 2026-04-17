import type { Collection } from "tinacms";

export const KivaKampFormCollection = (
  label = "Kiva Kamp Form",
): Collection => ({
  name: "kivaKampForm",
  label,
  path: "content/kiva-kamp-form",
  format: "json",
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
  },
  fields: [
    {
      name: "bannerSlides",
      label: "Banner Slides",
      type: "object",
      list: true,
      ui: {
        itemProps: (item: Record<string, string>) => ({
          label: item?.alt || item?.src || "Slide",
        }),
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
      name: "intro",
      label: "Intro Section",
      type: "object",
      fields: [
        {
          name: "title",
          label: "Heading",
          type: "string",
        },
        {
          name: "kicker",
          label: "Kicker",
          type: "string",
        },
        {
          name: "lead",
          label: "Lead Text",
          type: "rich-text",
        },
        {
          name: "bodyLines",
          label: "Body Lines",
          type: "string",
          list: true,
          ui: {
            component: "textarea",
          },
        },
        {
          name: "contactText",
          label: "Contact Prefix",
          type: "string",
        },
        {
          name: "contactNumber",
          label: "Contact Number",
          type: "string",
        },
        {
          name: "disclaimer",
          label: "Disclaimer",
          type: "string",
          ui: {
            component: "textarea",
          },
        },
      ],
    },
    {
      name: "cardGroups",
      label: "Card Groups",
      type: "object",
      list: true,
      ui: {
        itemProps: (item: Record<string, string>) => ({
          label: item?.variant || "Card group",
        }),
      },
      fields: [
        {
          name: "variant",
          label: "Layout Variant",
          type: "string",
          options: ["details", "offers"],
        },
        {
          name: "items",
          label: "Cards",
          type: "object",
          list: true,
          ui: {
            itemProps: (item: Record<string, string>) => ({
              label: item?.label || "Card",
            }),
          },
          fields: [
            {
              name: "label",
              label: "Label",
              type: "string",
            },
            {
              name: "value",
              label: "Value",
              type: "string",
            },
          ],
        },
      ],
    },
    {
      name: "form",
      label: "Registration Form",
      type: "object",
      fields: [
        {
          name: "title",
          label: "Form Heading",
          type: "string",
        },
        {
          name: "textFields",
          label: "Text Inputs",
          type: "object",
          list: true,
          ui: {
            itemProps: (item: Record<string, string>) => ({
              label: item?.label || item?.key || "Field",
            }),
          },
          fields: [
            {
              name: "key",
              label: "Internal Key",
              type: "string",
              description:
                "Used as the form field name. Keep this stable once integrations depend on it.",
            },
            {
              name: "label",
              label: "Visible Label",
              type: "string",
            },
            {
              name: "type",
              label: "Input Type",
              type: "string",
              options: ["text", "tel", "email"],
            },
            {
              name: "required",
              label: "Required",
              type: "boolean",
            },
            {
              name: "inputMode",
              label: "Input Mode",
              type: "string",
              options: ["text", "numeric", "tel", "email"],
            },
            {
              name: "pattern",
              label: "Validation Pattern",
              type: "string",
            },
          ],
        },
        {
          name: "choiceGroups",
          label: "Choice Groups",
          type: "object",
          list: true,
          ui: {
            itemProps: (item: Record<string, string>) => ({
              label: item?.prompt || item?.key || "Choice group",
            }),
          },
          fields: [
            {
              name: "key",
              label: "Internal Key",
              type: "string",
              description:
                "Used as the radio group name. Keep this stable once integrations depend on it.",
            },
            {
              name: "prompt",
              label: "Question",
              type: "string",
              ui: {
                component: "textarea",
              },
            },
            {
              name: "required",
              label: "Required",
              type: "boolean",
            },
            {
              name: "options",
              label: "Options",
              type: "object",
              list: true,
              ui: {
                itemProps: (item: Record<string, string>) => ({
                  label: item?.label || item?.value || "Option",
                }),
              },
              fields: [
                {
                  name: "label",
                  label: "Visible Label",
                  type: "string",
                },
                {
                  name: "value",
                  label: "Submitted Value",
                  type: "string",
                },
              ],
            },
          ],
        },
        {
          name: "submitButtonText",
          label: "Submit Button Text",
          type: "string",
        },
        {
          name: "successTitle",
          label: "Success Title",
          type: "string",
        },
        {
          name: "successMessage",
          label: "Success Message",
          type: "string",
          ui: {
            component: "textarea",
          },
        },
      ],
    },
  ],
});

import type { Collection } from "tinacms";

const RESERVED_SLUGS = ["2024", "2026"];

const slugify = (title: string) =>
  (title || "untitled")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const KivaSquarePagesCollection = (groupLabel = "Kiva Square"): Collection => ({
  name: "kivaSquarePages",
  label: `📁 ${groupLabel} Pages`,
  path: "content/kiva-square-pages",
  format: "json",
  ui: {
    allowedActions: {
      create: true,
      delete: true,
    },
    filename: {
      slugify: () => crypto.randomUUID().split("-")[0],
    },
    beforeSubmit: async ({ values }) => {
      const slug = values.slug || slugify(String(values.title ?? ""));
      if (RESERVED_SLUGS.includes(slug)) {
        throw new Error(
          `The slug "${slug}" is reserved by an existing page. Choose a different title.`
        );
      }
      return { ...values, slug };
    },
  },
  fields: [
    {
      name: "title",
      label: "Page Title",
      type: "string",
      required: true,
      isTitle: true,
    },
    {
      name: "slug",
      label: "URL Slug",
      type: "string",
      description:
        "The URL path for this page (auto-generated from title, editable). Changing this changes the page URL.",
    },
    {
      name: "navLabel",
      label: "Navigation Label",
      type: "string",
      description:
        "Short label for the nav dropdown (defaults to Page Title if empty)",
    },
    {
      name: "navOrder",
      label: "Navigation Order",
      type: "number",
      description:
        "Lower numbers appear first in the dropdown (after the fixed pages)",
    },
    {
      name: "heroImage",
      label: "Hero Banner Image",
      type: "image",
    },
    {
      name: "heroAlt",
      label: "Hero Image Alt Text",
      type: "string",
    },
    {
      name: "blocks",
      label: "Page Sections",
      type: "object",
      list: true,
      templates: [
        {
          name: "textSection",
          label: "Text Section",
          ui: {
            defaultItem: {
              variant: "plain",
              contentWidth: "narrow",
            },
          },
          fields: [
            { name: "sectionTitle", label: "Section Title", type: "string" },
            { name: "body", label: "Body Text", type: "rich-text" },
            {
              name: "variant",
              label: "Style Variant",
              type: "string",
              options: ["plain", "panel", "accent"],
            },
            {
              name: "contentWidth",
              label: "Content Width",
              type: "string",
              options: ["full", "narrow", "tight"],
            },
          ],
        },
        {
          name: "imageGallery",
          label: "Image Gallery",
          fields: [
            { name: "sectionTitle", label: "Section Title", type: "string" },
            {
              name: "images",
              label: "Images",
              type: "object",
              list: true,
              ui: {
                itemProps: (item: Record<string, string>) => ({
                  label: item?.alt || "Image",
                }),
              },
              fields: [
                { name: "src", label: "Image", type: "image" },
                { name: "alt", label: "Alt Text", type: "string" },
              ],
            },
          ],
        },
        {
          name: "featureImage",
          label: "Feature Image",
          fields: [
            { name: "src", label: "Image", type: "image" },
            { name: "alt", label: "Alt Text", type: "string" },
            { name: "caption", label: "Caption", type: "string" },
          ],
        },
        {
          name: "callToAction",
          label: "Call to Action",
          fields: [
            { name: "heading", label: "Heading", type: "string" },
            { name: "body", label: "Body Text", type: "rich-text" },
            { name: "buttonText", label: "Button Text", type: "string" },
            { name: "buttonLink", label: "Button Link", type: "string" },
          ],
        },
      ],
    },
  ],
});

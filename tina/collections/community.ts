import type { Collection } from "tinacms";

export const CommunityCollection = (label = "Community Enrichment"): Collection => ({
  name: "community",
  label,
  path: "content/community",
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
      name: "introTitle",
      label: "Intro Section Title",
      type: "string",
    },
    {
      name: "introText",
      label: "Intro Text",
      type: "rich-text",
    },
    {
      name: "events",
      label: "Events",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.title || "New Event" }),
      },
      fields: [
        {
          name: "title",
          label: "Event Title",
          type: "string",
        },
        {
          name: "image",
          label: "Event Image",
          type: "image",
        },
        {
          name: "description",
          label: "Description",
          type: "rich-text",
        },
      ],
    },
  ],
});

import type { Collection } from "tinacms";

export const OurStoryCollection = (label = "Our Story"): Collection => ({
  name: "ourStory",
  label,
  path: "content/our-story",
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
      name: "sectionTitle",
      label: "Section Title",
      type: "string",
    },
    {
      name: "timelineImage",
      label: "Timeline Image",
      type: "image",
    },
    {
      name: "timelineMobileImage",
      label: "Mobile Timeline Image",
      type: "image",
    },
    {
      name: "timelineAlt",
      label: "Timeline Alt Text",
      type: "string",
    },
  ],
});

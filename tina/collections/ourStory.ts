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
      description: "Recommended upload size: 1440 x 464 px. Use WebP or PNG.",
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
      label: "Desktop Timeline Image",
      type: "image",
      description: "Recommended upload size: 1440 x 2002 px. Use WebP or PNG.",
    },
    {
      name: "timelineMobileImage",
      label: "Mobile Timeline Image",
      type: "image",
      description: "Recommended upload size: 1440 x 1988 px. Use WebP or PNG.",
    },
    {
      name: "timelineAlt",
      label: "Timeline Alt Text",
      type: "string",
    },
  ],
});

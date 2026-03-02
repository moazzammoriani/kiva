import type { Collection } from "tinacms";

export const MissionCollection: Collection = {
  name: "mission",
  label: "Mission Page",
  path: "content/mission",
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
      name: "visionText",
      label: "Vision Text",
      type: "rich-text",
    },
    {
      name: "missionText",
      label: "Mission Text",
      type: "rich-text",
    },
    {
      name: "sisuText",
      label: "Sisu Value Text",
      type: "rich-text",
    },
    {
      name: "inclusivityText",
      label: "Inclusivity Value Text",
      type: "rich-text",
    },
    {
      name: "socialResponsibilityText",
      label: "Social Responsibility Value Text",
      type: "rich-text",
    },
  ],
};

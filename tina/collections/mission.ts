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
      type: "string",
      ui: {
        component: "textarea",
      },
    },
    {
      name: "missionText",
      label: "Mission Text",
      type: "string",
      ui: {
        component: "textarea",
      },
    },
    {
      name: "sisuText",
      label: "Sisu Value Text",
      type: "string",
      ui: {
        component: "textarea",
      },
    },
    {
      name: "inclusivityText",
      label: "Inclusivity Value Text",
      type: "string",
      ui: {
        component: "textarea",
      },
    },
    {
      name: "socialResponsibilityText",
      label: "Social Responsibility Value Text",
      type: "string",
      ui: {
        component: "textarea",
      },
    },
  ],
};

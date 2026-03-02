import type { Collection } from "tinacms";

const memberFields = [
  {
    name: "name",
    label: "Name",
    type: "string" as const,
  },
  {
    name: "bio",
    label: "Bio",
    type: "string" as const,
    ui: {
      component: "textarea" as const,
    },
  },
  {
    name: "image",
    label: "Photo",
    type: "image" as const,
  },
];

export const TeamCollection: Collection = {
  name: "team",
  label: "Team Page",
  path: "content/team",
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
      name: "directorsTitle",
      label: "Directors Section Title",
      type: "string",
    },
    {
      name: "directors",
      label: "Directors",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.name || "New Director" }),
      },
      fields: memberFields,
    },
    {
      name: "teamTitle",
      label: "Team Section Title",
      type: "string",
    },
    {
      name: "teamMembers",
      label: "Team Members",
      type: "object",
      list: true,
      ui: {
        itemProps: (item) => ({ label: item?.name || "New Member" }),
      },
      fields: memberFields,
    },
  ],
};

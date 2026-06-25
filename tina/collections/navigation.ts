import type { Collection } from "tinacms";

export const NavigationCollection: Collection = {
  name: "navigation",
  label: "Settings: Navigation Labels",
  path: "content/navigation",
  format: "json",
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
  },
  fields: [
    // Top-level simple links
    { name: "homeLabel", label: "Home", type: "string" },
    { name: "careersLabel", label: "Careers", type: "string" },
    { name: "contactUsLabel", label: "Contact Us", type: "string" },
    {
      name: "communityEnrichmentLabel",
      label: "Community Enrichment",
      type: "string",
    },
    // Dropdown groups (collapsible list objects with dynamic headers)
    {
      name: "aboutUs",
      label: "About Us",
      type: "object",
      list: true,
      ui: {
        itemProps: (item: Record<string, string>) => ({
          label: item?.label || "About Us",
        }),
      },
      fields: [
        { name: "label", label: "Dropdown Heading", type: "string" },
        { name: "ourStoryLabel", label: "Our Story", type: "string" },
        {
          name: "missionLabel",
          label: "Mission, Vision & Values",
          type: "string",
        },
        { name: "teamLabel", label: "Meet the Team", type: "string" },
      ],
    },
    {
      name: "programmes",
      label: "Programmes",
      type: "object",
      list: true,
      ui: {
        itemProps: (item: Record<string, string>) => ({
          label: item?.label || "Programmes",
        }),
      },
      fields: [
        { name: "label", label: "Dropdown Heading", type: "string" },
        {
          name: "preschoolLabel",
          label: "Pre-school & Elementary School",
          type: "string",
        },
        { name: "seniorLabel", label: "Senior School", type: "string" },
        { name: "kampsLabel", label: "Kiva Kamps", type: "string" },
      ],
    },
    {
      name: "admissions",
      label: "Admissions",
      type: "object",
      list: true,
      ui: {
        itemProps: (item: Record<string, string>) => ({
          label: item?.label || "Admissions",
        }),
      },
      fields: [
        { name: "label", label: "Dropdown Heading", type: "string" },
        { name: "processLabel", label: "Admission Process", type: "string" },
        { name: "formLabel", label: "Admission Form", type: "string" },
      ],
    },
    {
      name: "kivaSquare",
      label: "Kiva Square",
      type: "object",
      list: true,
      ui: {
        itemProps: (item: Record<string, string>) => ({
          label: item?.label || "Kiva Square",
        }),
      },
      fields: [
        { name: "label", label: "Dropdown Heading", type: "string" },
        { name: "year2024Label", label: "2024", type: "string" },
      ],
    },
  ],
};

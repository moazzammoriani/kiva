import type { Collection } from "tinacms";

export const HomeCollection: Collection = {
  name: "home",
  label: "Home Page",
  path: "content/home",
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
      name: "birdHouseImage",
      label: "Birdhouse Image",
      type: "image",
    },
    {
      name: "welcomeHeading",
      label: "Welcome Heading",
      type: "string",
    },
    {
      name: "welcomeTagline",
      label: "Welcome Tagline",
      type: "string",
    },
    {
      name: "welcomeParagraphs",
      label: "Welcome Paragraphs",
      type: "string",
      list: true,
      ui: {
        component: "textarea",
      },
    },
    {
      name: "spacesTitle",
      label: "Our Spaces Section Title",
      type: "string",
    },
    {
      name: "slideshowImages",
      label: "Slideshow Images",
      type: "object",
      list: true,
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
        {
          name: "label",
          label: "Caption Label",
          type: "string",
        },
      ],
    },
    {
      name: "educationWorksTitle",
      label: "Education Works Section Title",
      type: "string",
    },
    {
      name: "educationWorksLogos",
      label: "Education Works Logos",
      type: "object",
      list: true,
      fields: [
        {
          name: "src",
          label: "Logo Image",
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
      name: "partnersTitle",
      label: "Partners Section Title",
      type: "string",
    },
    {
      name: "partnerLogos",
      label: "Partner Logos",
      type: "object",
      list: true,
      fields: [
        {
          name: "src",
          label: "Logo Image",
          type: "image",
        },
        {
          name: "alt",
          label: "Alt Text",
          type: "string",
        },
      ],
    },
  ],
};

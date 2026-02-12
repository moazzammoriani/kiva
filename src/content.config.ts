import { defineCollection, z } from "astro:content";
import { file } from "astro/loaders";

const home = defineCollection({
  loader: file("content/home/home.json", {
    parser: (text) => [{ id: "home", ...JSON.parse(text) }],
  }),
  schema: z.object({
    heroImage: z.string().optional(),
    birdHouseImage: z.string().optional(),
    welcomeHeading: z.string().optional(),
    welcomeTagline: z.string().optional(),
    welcomeBody: z.any().optional(),
    spacesTitle: z.string().optional(),
    slideshowImages: z
      .array(
        z.object({
          src: z.string().optional(),
          alt: z.string().optional(),
          label: z.string().optional(),
        })
      )
      .optional(),
    educationWorksTitle: z.string().optional(),
    educationWorksLogos: z
      .array(
        z.object({
          src: z.string().optional(),
          alt: z.string().optional(),
        })
      )
      .optional(),
    partnersTitle: z.string().optional(),
    partnerLogos: z
      .array(
        z.object({
          src: z.string().optional(),
          alt: z.string().optional(),
        })
      )
      .optional(),
  }),
});

export const collections = { home };

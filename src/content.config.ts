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

const mission = defineCollection({
  loader: file("content/mission/mission.json", {
    parser: (text) => [{ id: "mission", ...JSON.parse(text) }],
  }),
  schema: z.object({
    heroImage: z.string().optional(),
    visionText: z.any().optional(),
    missionText: z.any().optional(),
    sisuText: z.any().optional(),
    inclusivityText: z.any().optional(),
    socialResponsibilityText: z.any().optional(),
  }),
});

const memberSchema = z.object({
  name: z.string().optional(),
  bio: z.any().optional(),
  image: z.string().optional(),
});

const team = defineCollection({
  loader: file("content/team/team.json", {
    parser: (text) => [{ id: "team", ...JSON.parse(text) }],
  }),
  schema: z.object({
    heroImage: z.string().optional(),
    directorsTitle: z.string().optional(),
    directors: z.array(memberSchema).optional(),
    teamTitle: z.string().optional(),
    teamMembers: z.array(memberSchema).optional(),
  }),
});

const preschool = defineCollection({
  loader: file("content/preschool/preschool.json", {
    parser: (text) => [{ id: "preschool", ...JSON.parse(text) }],
  }),
  schema: z.object({
    heroImage: z.string().optional(),
    preschoolTitle: z.string().optional(),
    preschoolIntro: z.any().optional(),
    preschoolImages: z
      .array(
        z.object({
          src: z.string().optional(),
          alt: z.string().optional(),
        })
      )
      .optional(),
    curiosityApproach: z.any().optional(),
    ageGroups: z
      .array(
        z.object({
          name: z.string().optional(),
          ageRange: z.string().optional(),
        })
      )
      .optional(),
    elementaryTitle: z.string().optional(),
    elementaryIntro: z.any().optional(),
    elementaryImages: z
      .array(
        z.object({
          src: z.string().optional(),
          alt: z.string().optional(),
        })
      )
      .optional(),
    elementarySecond: z.any().optional(),
    faqsTitle: z.string().optional(),
    faqs: z
      .array(
        z.object({
          title: z.string().optional(),
          content: z.any().optional(),
        })
      )
      .optional(),
  }),
});

export const collections = { home, mission, team, preschool };

import { defineCollection, z } from "astro:content";
import { file, glob } from "astro/loaders";

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
    instagramEmbeds: z
      .array(z.object({ embedCode: z.string().optional() }))
      .optional(),
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

const middleAndSenior = defineCollection({
  loader: file("content/middle-and-senior/middle-and-senior.json", {
    parser: (text) => [{ id: "middleAndSenior", ...JSON.parse(text) }],
  }),
  schema: z.object({
    heroImage: z.string().optional(),
    title: z.string().optional(),
    galleryImages: z
      .array(
        z.object({
          src: z.string().optional(),
          alt: z.string().optional(),
        })
      )
      .optional(),
    bodyText: z.any().optional(),
    buttonText: z.string().optional(),
    buttonLink: z.string().optional(),
  }),
});

const admissionProcess = defineCollection({
  loader: file("content/admission-process/admission-process.json", {
    parser: (text) => [{ id: "admissionProcess", ...JSON.parse(text) }],
  }),
  schema: z.object({
    heroImage: z.string().optional(),
    title: z.string().optional(),
    processDiagram: z.string().optional(),
    processDiagramMobile: z.string().optional(),
    buttonText: z.string().optional(),
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

const community = defineCollection({
  loader: file("content/community/community.json", {
    parser: (text) => [{ id: "community", ...JSON.parse(text) }],
  }),
  schema: z.object({
    heroImage: z.string().optional(),
    introTitle: z.string().optional(),
    introText: z.any().optional(),
    events: z
      .array(
        z.object({
          title: z.string().optional(),
          image: z.string().optional(),
          description: z.any().optional(),
        })
      )
      .optional(),
  }),
});

const blockSchema = z.discriminatedUnion("_template", [
  z.object({
    _template: z.literal("textSection"),
    sectionTitle: z.string().optional(),
    body: z.any().optional(),
    variant: z.enum(["plain", "panel", "accent"]).optional(),
    contentWidth: z.enum(["full", "narrow", "tight"]).optional(),
  }),
  z.object({
    _template: z.literal("imageGallery"),
    sectionTitle: z.string().optional(),
    images: z
      .array(z.object({ src: z.string().optional(), alt: z.string().optional() }))
      .optional(),
  }),
  z.object({
    _template: z.literal("featureImage"),
    src: z.string().optional(),
    alt: z.string().optional(),
    caption: z.string().optional(),
  }),
  z.object({
    _template: z.literal("callToAction"),
    heading: z.string().optional(),
    body: z.any().optional(),
    buttonText: z.string().optional(),
    buttonLink: z.string().optional(),
  }),
]);

const dynamicPageSchema = z.object({
  title: z.string().optional(),
  navLabel: z.string().optional(),
  navOrder: z.number().optional(),
  heroImage: z.string().optional(),
  heroAlt: z.string().optional(),
  blocks: z.array(blockSchema).optional(),
});

const aboutPages = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "content/about-pages" }),
  schema: dynamicPageSchema,
});

const programmePages = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "content/programme-pages" }),
  schema: dynamicPageSchema,
});

const admissionPages = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "content/admission-pages" }),
  schema: dynamicPageSchema,
});

const kivaSquarePages = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "content/kiva-square-pages" }),
  schema: dynamicPageSchema,
});

const navigation = defineCollection({
  loader: file("content/navigation/navigation.json", {
    parser: (text) => [{ id: "navigation", ...JSON.parse(text) }],
  }),
  schema: z.object({
    homeLabel: z.string().optional(),
    careersLabel: z.string().optional(),
    contactUsLabel: z.string().optional(),
    communityEnrichmentLabel: z.string().optional(),
    aboutUs: z.object({
      label: z.string().optional(),
      ourStoryLabel: z.string().optional(),
      missionLabel: z.string().optional(),
      teamLabel: z.string().optional(),
    }).optional(),
    programmes: z.object({
      label: z.string().optional(),
      preschoolLabel: z.string().optional(),
      seniorLabel: z.string().optional(),
      kampsLabel: z.string().optional(),
    }).optional(),
    admissions: z.object({
      label: z.string().optional(),
      processLabel: z.string().optional(),
      formLabel: z.string().optional(),
    }).optional(),
    kivaSquare: z.object({
      label: z.string().optional(),
      year2024Label: z.string().optional(),
      year2026Label: z.string().optional(),
    }).optional(),
  }),
});

export const collections = { home, mission, team, preschool, middleAndSenior, admissionProcess, community, aboutPages, programmePages, admissionPages, kivaSquarePages, navigation };

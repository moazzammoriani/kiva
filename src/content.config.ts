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
        }),
      )
      .optional(),
    educationWorksTitle: z.string().optional(),
    educationWorksLogos: z
      .array(
        z.object({
          src: z.string().optional(),
          alt: z.string().optional(),
        }),
      )
      .optional(),
    partnersTitle: z.string().optional(),
    partnerLogos: z
      .array(
        z.object({
          src: z.string().optional(),
          alt: z.string().optional(),
        }),
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
        }),
      )
      .optional(),
    curiosityApproach: z.any().optional(),
    ageGroups: z
      .array(
        z.object({
          name: z.string().optional(),
          ageRange: z.string().optional(),
        }),
      )
      .optional(),
    elementaryTitle: z.string().optional(),
    elementaryIntro: z.any().optional(),
    elementaryImages: z
      .array(
        z.object({
          src: z.string().optional(),
          alt: z.string().optional(),
        }),
      )
      .optional(),
    elementarySecond: z.any().optional(),
    faqsTitle: z.string().optional(),
    faqs: z
      .array(
        z.object({
          title: z.string().optional(),
          content: z.any().optional(),
        }),
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
        }),
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
        }),
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
        }),
      )
      .optional(),
  }),
});

const admissionForm = defineCollection({
  loader: file("content/admission-form/admission-form.json", {
    parser: (text) => [{ id: "admissionForm", ...JSON.parse(text) }],
  }),
  schema: z.object({
    intro: z.any().optional(),
    sessionOptions: z.array(z.string()).optional(),
    headings: z
      .object({
        session: z.string().optional(),
        child: z.string().optional(),
        parents: z.string().optional(),
        motherDetails: z.string().optional(),
        fatherDetails: z.string().optional(),
        sibling: z.string().optional(),
        emergency: z.string().optional(),
        hearAbout: z.string().optional(),
        fit: z.string().optional(),
        declaration: z.string().optional(),
      })
      .optional(),
    prompts: z
      .object({
        appliedBefore: z.string().optional(),
        progressReport: z.string().optional(),
        specialNeeds: z.string().optional(),
      })
      .optional(),
    specialNeeds: z
      .object({
        helperText: z.string().optional(),
        modalTitle: z.string().optional(),
        modalBody: z.any().optional(),
      })
      .optional(),
    declarationStatement: z.string().optional(),
    signatureLabel: z.string().optional(),
    submitButtonText: z.string().optional(),
    success: z
      .object({
        title: z.string().optional(),
        message: z.string().optional(),
      })
      .optional(),
  }),
});

const kivaKampForm = defineCollection({
  loader: file("content/kiva-kamp-form/kiva-kamp-form.json", {
    parser: (text) => [{ id: "kivaKampForm", ...JSON.parse(text) }],
  }),
  schema: z.object({
    bannerSlides: z
      .array(
        z.object({
          src: z.string().optional(),
          alt: z.string().optional(),
        }),
      )
      .optional(),
    intro: z
      .object({
        title: z.string().optional(),
        kicker: z.string().optional(),
        lead: z.any().optional(),
        bodyLines: z.array(z.string()).optional(),
        contactText: z.string().optional(),
        contactNumber: z.string().optional(),
        disclaimer: z.string().optional(),
      })
      .optional(),
    cardGroups: z
      .array(
        z.object({
          variant: z.enum(["details", "offers"]).optional(),
          items: z
            .array(
              z.object({
                label: z.string().optional(),
                value: z.string().optional(),
              }),
            )
            .optional(),
        }),
      )
      .optional(),
    form: z
      .object({
        title: z.string().optional(),
        textFields: z
          .array(
            z.object({
              key: z.string().optional(),
              label: z.string().optional(),
              type: z.string().optional(),
              required: z.boolean().optional(),
              inputMode: z.string().optional(),
              pattern: z.string().optional(),
            }),
          )
          .optional(),
        choiceGroups: z
          .array(
            z.object({
              key: z.string().optional(),
              prompt: z.string().optional(),
              required: z.boolean().optional(),
              options: z
                .array(
                  z.object({
                    label: z.string().optional(),
                    value: z.string().optional(),
                  }),
                )
                .optional(),
            }),
          )
          .optional(),
        submitButtonText: z.string().optional(),
        successTitle: z.string().optional(),
        successMessage: z.string().optional(),
      })
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
      .array(
        z.object({ src: z.string().optional(), alt: z.string().optional() }),
      )
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
  slug: z.string().optional(),
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
    aboutUs: z
      .array(
        z.object({
          label: z.string().optional(),
          ourStoryLabel: z.string().optional(),
          missionLabel: z.string().optional(),
          teamLabel: z.string().optional(),
        }),
      )
      .optional(),
    programmes: z
      .array(
        z.object({
          label: z.string().optional(),
          preschoolLabel: z.string().optional(),
          seniorLabel: z.string().optional(),
          kampsLabel: z.string().optional(),
        }),
      )
      .optional(),
    admissions: z
      .array(
        z.object({
          label: z.string().optional(),
          processLabel: z.string().optional(),
          formLabel: z.string().optional(),
        }),
      )
      .optional(),
    kivaSquare: z
      .array(
        z.object({
          label: z.string().optional(),
          year2024Label: z.string().optional(),
        }),
      )
      .optional(),
  }),
});

export const collections = {
  home,
  mission,
  team,
  preschool,
  middleAndSenior,
  admissionProcess,
  community,
  kivaKampForm,
  admissionForm,
  aboutPages,
  programmePages,
  admissionPages,
  kivaSquarePages,
  navigation,
};

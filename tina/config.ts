import { defineConfig } from "tinacms";
import { HomeCollection } from "./collections/home";
import { OurStoryCollection } from "./collections/ourStory";
import { MissionCollection } from "./collections/mission";
import { TeamCollection } from "./collections/team";
import { PreschoolCollection } from "./collections/preschool";
import { MiddleAndSeniorCollection } from "./collections/middleAndSenior";
import { AdmissionProcessCollection } from "./collections/admissionProcess";
import { CommunityCollection } from "./collections/community";
import { AboutPagesCollection } from "./collections/aboutPages";
import { ProgrammePagesCollection } from "./collections/programmePages";
import { AdmissionPagesCollection } from "./collections/admissionPages";
import { KivaSquarePagesCollection } from "./collections/kivaSquarePages";
import { NavigationCollection } from "./collections/navigation";
import { KivaKampFormCollection } from "./collections/kivaKampForm";
import { AdmissionFormCollection } from "./collections/admissionForm";
import { AdmissionTermsCollection } from "./collections/admissionTerms";
import { KivaAuthProvider } from "./auth";
import { PublishScreen } from "./PublishScreen";
import navLabels from "../content/navigation/navigation.json";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

const withGroup = (group: string, label?: string, fallback?: string) =>
  `${group}: ${label || fallback}`;

const aboutLabels = navLabels.aboutUs?.[0];
const programmeLabels = navLabels.programmes?.[0];
const admissionLabels = navLabels.admissions?.[0];
const kivaSquareLabels = navLabels.kivaSquare?.[0];
const aboutGroup = aboutLabels?.label || "About Us";
const programmeGroup = programmeLabels?.label || "Programmes";
const admissionGroup = admissionLabels?.label || "Admissions";
const kivaSquareGroup = kivaSquareLabels?.label || "Kiva Square";

export default defineConfig({
  branch,

  // No clientId/token = local self-hosted mode
  clientId: process.env.PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,

  authProvider: new KivaAuthProvider(""),
  contentApiUrlOverride: "/graphql",

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    loadCustomStore: async () => {
      const { LocalMediaStore } = await import("./media-store");
      return LocalMediaStore;
    },
  },
  cmsCallback: (cms) => {
    cms.plugins.add({
      __type: "screen",
      name: "Publish",
      Component: PublishScreen,
    });
    return cms;
  },
  schema: {
    collections: [
      HomeCollection(withGroup("Main Pages", navLabels.homeLabel, "Home")),
      CommunityCollection(
        withGroup(
          "Main Pages",
          navLabels.communityEnrichmentLabel,
          "Community Enrichment",
        ),
      ),

      OurStoryCollection(
        withGroup(aboutGroup, aboutLabels?.ourStoryLabel, "Our Story"),
      ),
      MissionCollection(
        withGroup(
          aboutGroup,
          aboutLabels?.missionLabel,
          "Mission, Vision & Values",
        ),
      ),
      TeamCollection(
        withGroup(aboutGroup, aboutLabels?.teamLabel, "Meet the Team"),
      ),
      AboutPagesCollection(aboutGroup),

      PreschoolCollection(
        withGroup(
          programmeGroup,
          programmeLabels?.preschoolLabel,
          "Elementary & Junior School",
        ),
      ),
      MiddleAndSeniorCollection(
        withGroup(
          programmeGroup,
          programmeLabels?.seniorLabel,
          "Senior School",
        ),
      ),
      KivaKampFormCollection(
        withGroup(programmeGroup, programmeLabels?.kampsLabel, "Kiva Kamps"),
      ),
      ProgrammePagesCollection(programmeGroup),

      AdmissionProcessCollection(
        withGroup(
          admissionGroup,
          admissionLabels?.processLabel,
          "Admission Process",
        ),
      ),
      AdmissionFormCollection(
        withGroup(admissionGroup, admissionLabels?.formLabel, "Admission Form"),
      ),
      AdmissionTermsCollection(
        withGroup(admissionGroup, "Terms and Conditions"),
      ),
      AdmissionPagesCollection(admissionGroup),

      KivaSquarePagesCollection(kivaSquareGroup),
      NavigationCollection,
    ],
  },
});

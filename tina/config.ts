import { defineConfig } from "tinacms";
import { HomeCollection } from "./collections/home";
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
import { KivaAuthProvider } from "./auth";
import { PublishScreen } from "./PublishScreen";
import navLabels from "../content/navigation/navigation.json";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

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
      HomeCollection(navLabels.homeLabel),
      MissionCollection(navLabels.aboutUs?.[0]?.missionLabel),
      TeamCollection(navLabels.aboutUs?.[0]?.teamLabel),
      PreschoolCollection(navLabels.programmes?.[0]?.preschoolLabel),
      MiddleAndSeniorCollection(navLabels.programmes?.[0]?.seniorLabel),
      AdmissionProcessCollection(navLabels.admissions?.[0]?.processLabel),
      CommunityCollection(navLabels.communityEnrichmentLabel),
      AboutPagesCollection(navLabels.aboutUs?.[0]?.label),
      ProgrammePagesCollection(navLabels.programmes?.[0]?.label),
      AdmissionPagesCollection(navLabels.admissions?.[0]?.label),
      KivaSquarePagesCollection(navLabels.kivaSquare?.[0]?.label),
      KivaKampFormCollection(),
      AdmissionFormCollection(navLabels.admissions?.[0]?.formLabel),
      NavigationCollection,
    ],
  },
});

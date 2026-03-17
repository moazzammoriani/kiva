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
import { KivaAuthProvider } from "./auth";
import { PublishScreen } from "./PublishScreen";

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
    collections: [HomeCollection, MissionCollection, TeamCollection, PreschoolCollection, MiddleAndSeniorCollection, AdmissionProcessCollection, CommunityCollection, AboutPagesCollection, ProgrammePagesCollection],
  },
});

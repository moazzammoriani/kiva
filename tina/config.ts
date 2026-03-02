import { defineConfig } from "tinacms";
import { HomeCollection } from "./collections/home";
import { MissionCollection } from "./collections/mission";
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
    tina: {
      mediaRoot: "",
      publicFolder: "public",
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
    collections: [HomeCollection, MissionCollection],
  },
});

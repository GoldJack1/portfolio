import { defineStackbitConfig, type DocumentStringLikeFieldNonLocalized, type SiteMapEntry } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";
import { allModels } from "./.stackbit/models";

function sitePageUrl(route: string | undefined): string | null {
  if (!route) return null;
  if (route === "home") return "/";
  return `/${route}`;
}

export default defineStackbitConfig({
  stackbitVersion: "~0.7.0",
  ssgName: "nextjs",
  nodeVersion: "20",
  devCommand: "node scripts/dev-with-content-watch.mjs {PORT}",
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ["content"],
      models: allModels,
      assetsConfig: {
        referenceType: "static",
        staticDir: "public",
        uploadDir: "uploads",
        publicPath: "/",
      },
    }),
  ],
  siteMap: ({ documents }): SiteMapEntry[] => {
    const entries: SiteMapEntry[] = [];

    for (const document of documents) {
      const id = document.id;

      if (document.modelName === "SitePage") {
        const route = (document.fields.route as DocumentStringLikeFieldNonLocalized | undefined)?.value;
        const urlPath = sitePageUrl(route);
        if (urlPath) entries.push({ urlPath, document });
        continue;
      }

      if (document.modelName === "CustomPage") {
        const slug = (document.fields.slug as DocumentStringLikeFieldNonLocalized | undefined)?.value;
        if (slug) entries.push({ urlPath: `/pages/${slug}`, document });
        continue;
      }

      if (document.modelName === "Project") {
        const slug =
          (document.fields.slug as DocumentStringLikeFieldNonLocalized | undefined)?.value ??
          id.replace("content/projects/", "").replace(/\.json$/, "");
        if (slug) entries.push({ urlPath: `/projects/${slug}`, document });
      }
    }

    return entries;
  },
});

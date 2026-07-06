import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const contentDir = path.join(root, "content");

const syncScripts = [
  "scripts/sync-projects.mjs",
  "scripts/sync-site-pages.mjs",
  "scripts/sync-site-settings.mjs",
  "scripts/sync-cms-nav-pages.mjs",
];

const watchDirs = [
  path.join(contentDir, "site-pages"),
  path.join(contentDir, "pages"),
  path.join(contentDir, "projects"),
  path.join(contentDir, "site"),
];

function runSync(label = "sync") {
  for (const script of syncScripts) {
    const result = spawnSync("node", [path.join(root, script)], {
      cwd: root,
      stdio: "inherit",
    });
    if (result.status !== 0) {
      console.error(`[content-watch] ${label}: failed running ${script}`);
    }
  }
}

function latestContentMtime() {
  let latest = 0;

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }
      if (!entry.name.endsWith(".json")) continue;
      const mtime = fs.statSync(fullPath).mtimeMs;
      if (mtime > latest) latest = mtime;
    }
  }

  for (const dir of watchDirs) walk(dir);
  return latest;
}

function watchContent() {
  let timer = null;
  let lastMtime = latestContentMtime();

  const scheduleSync = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      const currentMtime = latestContentMtime();
      if (currentMtime <= lastMtime) return;
      lastMtime = currentMtime;
      runSync("watch");
    }, 150);
  };

  for (const dir of watchDirs) {
    if (!fs.existsSync(dir)) continue;
    try {
      fs.watch(dir, scheduleSync).on("error", (error) => {
        console.warn(`[content-watch] watcher error for ${dir}:`, error.message);
      });
    } catch (error) {
      console.warn(`[content-watch] could not watch ${dir}:`, error.message);
    }
  }

  setInterval(scheduleSync, 1500);
  console.log("[content-watch] Watching content/ for Visual Editor preview updates");
}

const port = process.argv[2] || "3000";

runSync("initial");
watchContent();

const nextBin = path.join(root, "node_modules", ".bin", "next");
const child = spawn(nextBin, ["dev", "--port", port, "--hostname", "127.0.0.1"], {
  cwd: root,
  stdio: "inherit",
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});

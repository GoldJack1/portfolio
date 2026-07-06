import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectsDir = path.join(__dirname, "..", "content", "projects");
const outFile = path.join(__dirname, "..", "src", "data", "projects.json");

function loadProjects() {
  if (!fs.existsSync(projectsDir)) return [];

  return fs
    .readdirSync(projectsDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(fs.readFileSync(path.join(projectsDir, file), "utf8")))
    .sort((a, b) => b.year.localeCompare(a.year) || a.title.localeCompare(b.title));
}

const projects = loadProjects();
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, `${JSON.stringify(projects, null, 2)}\n`);
console.log(`Synced ${projects.length} projects → src/data/projects.json`);

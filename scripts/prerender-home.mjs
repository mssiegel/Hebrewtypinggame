import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(rootDir, "dist");
const distServerDir = path.join(rootDir, "dist-server");
const indexPath = path.join(distDir, "index.html");
const serverEntryPath = path.join(distServerDir, "entry-server.js");

const { renderHome } = await import(pathToFileURL(serverEntryPath));
const html = await readFile(indexPath, "utf8");
const renderedHome = renderHome();

if (!html.includes('<div id="root"></div>')) {
  throw new Error('Expected dist/index.html to contain <div id="root"></div>.');
}

await writeFile(indexPath, html.replace('<div id="root"></div>', `<div id="root">${renderedHome}</div>`));
await rm(distServerDir, { recursive: true, force: true });

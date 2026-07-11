import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const [packageDirectory, version, canonicalName] = process.argv.slice(2);
if (!packageDirectory || !version || !canonicalName || !/^2\./.test(version)) {
    throw new Error(
        "usage: node scripts/prepare-npm-v2-package.mjs <directory> <2.x version> <canonical name>"
    );
}

const manifestPath = path.resolve(packageDirectory, "package.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
manifest.name = canonicalName;
manifest.version = version;
delete manifest.private;

if (canonicalName === "@swc/core") {
    delete manifest.dependencies["@swc-internal/types-v2"];
    manifest.dependencies["@swc/types"] = version;
    manifest.optionalDependencies = { "@swc/wasm": version };
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

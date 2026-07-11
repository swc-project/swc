import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [version, requestedOutput] = process.argv.slice(2);

if (!version || !/^2\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
    throw new Error(
        "usage: node scripts/stage-npm-v2.mjs <2.x version> [output directory]"
    );
}

const output = path.resolve(
    requestedOutput ?? path.join(root, "target/npm-v2", version)
);
await rm(output, { force: true, recursive: true });
await mkdir(output, { recursive: true });

async function readJson(file) {
    return JSON.parse(await readFile(file, "utf8"));
}

async function writeJson(file, value) {
    await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

async function stageSource(sourceName, targetName, canonicalName) {
    const source = path.join(root, "packages", sourceName);
    const target = path.join(output, targetName);
    await cp(source, target, {
        recursive: true,
        filter(entry) {
            const relative = path.relative(source, entry);
            return (
                !relative.startsWith("node_modules") &&
                !relative.startsWith("tests")
            );
        },
    });

    const manifestPath = path.join(target, "package.json");
    const manifest = await readJson(manifestPath);
    manifest.name = canonicalName;
    manifest.version = version;
    delete manifest.private;

    if (canonicalName === "@swc/core") {
        delete manifest.dependencies["@swc-internal/types-v2"];
        manifest.dependencies["@swc/types"] = version;
        manifest.optionalDependencies = { "@swc/wasm": version };
    }

    await writeJson(manifestPath, manifest);
}

await stageSource("core-v2", "core", "@swc/core");
await stageSource("types-v2", "types", "@swc/types");

const platformSource = path.join(root, "packages/core/scripts/npm");
const platformTarget = path.join(output, "platform");
await cp(platformSource, platformTarget, { recursive: true });

const { readdir } = await import("node:fs/promises");
for (const entry of await readdir(platformTarget, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const manifestPath = path.join(platformTarget, entry.name, "package.json");
    const manifest = await readJson(manifestPath);
    manifest.version = version;
    await writeJson(manifestPath, manifest);
}

const wasmPackage = path.join(root, "bindings/binding_core_wasm_v2/pkg");
try {
    await cp(wasmPackage, path.join(output, "wasm"), { recursive: true });
    const manifestPath = path.join(output, "wasm/package.json");
    const manifest = await readJson(manifestPath);
    manifest.name = "@swc/wasm";
    manifest.version = version;
    await writeJson(manifestPath, manifest);
} catch (error) {
    if (error?.code !== "ENOENT") throw error;
}

process.stdout.write(`${output}\n`);

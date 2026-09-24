// Temporary diagnostics use the production samples, baselines, and budgets.
import {
    cpSync,
    copyFileSync,
    linkSync,
    mkdirSync,
    mkdtempSync,
    rmSync,
    writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import {
    createMeasurementCache,
    measureLoads,
    validateMeasurements,
} from "./measurements.mjs";

const [name] = process.argv.slice(2);
if (!["current", "lazy"].includes(name))
    throw new Error("Unknown scheduling comparison");
const target = "x86_64-apple-darwin";
const input = resolve("target/diagnostic-input");
const stage = mkdtempSync(resolve("target/diagnostic-"));
const cacheRoot = createMeasurementCache();
function variant(label, source, hold = false, root = stage) {
    const directory = join(root, label);
    const base = resolve("packages/core");
    cpSync(base, directory, {
        recursive: true,
        filter: (path) => {
            const relative = path.slice(base.length);
            return (
                !/(^|\/)(node_modules|scripts|target|artifacts|artifacts_cli)(\/|$)/.test(
                    relative
                ) && !relative.endsWith(".node")
            );
        },
    });
    const addon = join(directory, "swc.darwin-x64.node");
    copyFileSync(source, addon);
    if (hold) linkSync(addon, join(directory, ".hold"));
    return { entry: join(directory, "index.js"), addon };
}
try {
    const raw = variant("raw", join(input, "raw.node"));
    const carrier = variant("carrier", join(input, name + ".node"), true);
    const smoke = (entry, addon, cache) => {
        const result = spawnSync(
            process.execPath,
            [resolve("scripts/native/smoke.cjs"), "core", entry, addon, target],
            {
                encoding: "utf8",
                env: { ...process.env, SWC_NATIVE_BINDING_CACHE: cache },
            }
        );
        if (result.status !== 0) throw new Error(result.stderr);
        return JSON.parse(result.stdout.trim().split("\n").at(-1));
    };
    const result = {
        variant: name,
        target,
        node: process.version,
        ...measureLoads({
            raw,
            carrier,
            copyRaw: (sample, root) =>
                variant(
                    "raw-cold-" + sample,
                    join(input, "raw.node"),
                    false,
                    root
                ),
            smoke,
            cacheRoot,
        }),
    };
    // Persist failures too, explicitly separate from release evidence. The
    // comparison job still fails if any variant exceeds the unchanged budget.
    try {
        validateMeasurements(result);
        result.gatePassed = true;
    } catch (error) {
        result.gatePassed = false;
        result.gateError = error.message;
        process.exitCode = 1;
    }
    mkdirSync(resolve("target/diagnostic-results"), { recursive: true });
    writeFileSync(
        resolve("target/diagnostic-results", name + ".json"),
        JSON.stringify(result, null, 2)
    );
    console.log(JSON.stringify(result));
} finally {
    rmSync(stage, { recursive: true, force: true });
    rmSync(cacheRoot, { recursive: true, force: true });
}

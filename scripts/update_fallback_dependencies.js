// For some native targets, we'll make `@swc/wasm` as dependency to ensure it can gracefully fallback
// While we migrate native builds into `@swc/wasm`.

const path = require("path");
const fs = require("fs");

const npmDir = path.resolve(
    __dirname,
    "..",
    "packages",
    "core",
    "scripts",
    "npm"
);

const targets = [
    "freebsd-x64",
    "win32-ia32-msvc",
    "linux-arm-gnueabihf",
    "android-arm64",
    "win32-arm64-msvc",
    "android-arm-eabi",
    "linux-ppc64-gnu",
    "linux-s390x-gnu",
    "aix-ppc64",
];

(async () => {
    if (!fs.existsSync(npmDir)) {
        console.warn(`Skipping fallback dependency update; npm dir does not exist: ${npmDir}`);
        return;
    }

    for (const target of targets) {
        const pkgPath = path.join(npmDir, target, "package.json");
        if (!fs.existsSync(pkgPath)) {
            continue;
        }

        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
        const { version } = pkg;
        pkg.dependencies = {
            ...pkg.dependencies,
            "@swc/wasm": version,
        };
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    }
})().catch((err) => {
    console.error("Failed to update dependencies", err);
});

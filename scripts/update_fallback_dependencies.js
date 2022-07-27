// For some native targets, we'll make `@swc/wasm` as dependency to ensure it can gracefully fallback
// While we migrate native builds into `@swc/wasm`.

const path = require("path");
const fs = require("fs");

const targets = [
    "freebsd-x64",
    "win32-ia32-msvc",
    "linux-arm-gnueabihf",
    "android-arm64",
    "win32-arm64-msvc",
    "android-arm-eabi",
];

(async () => {
    for (const target of targets) {
        const pkgPath = path.resolve(__dirname, "npm", target, "package.json");
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
        const { version } = pkg;
        pkg.dependencies = {
            "@swc/wasm": version,
        };
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    }
})().catch((err) => {
    console.error("Failed to update dependencies", err);
});

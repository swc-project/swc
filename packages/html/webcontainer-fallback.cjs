const fs = require("node:fs");
const path = require("node:path");
const childProcess = require("node:child_process");

const pkg = JSON.parse(
    fs.readFileSync(path.join(__dirname, "package.json"), "utf-8")
);
const version = pkg.version;
const baseDir = `/tmp/swc-html-${version}`;
const bindingEntry = `${baseDir}/node_modules/@swc/html-wasm/wasm.js`;

if (!fs.existsSync(bindingEntry)) {
    fs.rmSync(baseDir, { recursive: true, force: true });
    fs.mkdirSync(baseDir, { recursive: true });
    const bindingPkg = `@swc/html-wasm@${version}`;
    console.log(`[swc] Downloading ${bindingPkg} on WebContainer...`);
    childProcess.execFileSync("pnpm", ["i", bindingPkg], {
        cwd: baseDir,
        stdio: "inherit",
    });
}

module.exports = require(bindingEntry);

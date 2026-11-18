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

const wasmBinding = require(bindingEntry);

module.exports.minify = (content, options) => {
    return wasmBinding.minify(toString(content), toOptions(options));
};

module.exports.minifyFragment = (content, options) => {
    return wasmBinding.minifyFragment(toString(content), toOptions(options));
};

module.exports.minifySync = (content, options) => {
    return wasmBinding.minifySync(toString(content), toOptions(options));
};

module.exports.minifyFragmentSync = (content, options) => {
    return wasmBinding.minifyFragmentSync(toString(content), toOptions(options));
};

function toString(content) {
    return Buffer.isBuffer(content) ? content.toString("utf8") : content;
}

function toOptions(options) {
    if (options == null) {
        return {};
    }

    if (Buffer.isBuffer(options)) {
        if (options.length === 0) {
            return {};
        }

        return JSON.parse(options.toString("utf8"));
    }

    if (typeof options === "string") {
        if (options.length === 0) {
            return {};
        }

        return JSON.parse(options);
    }

    return options;
}

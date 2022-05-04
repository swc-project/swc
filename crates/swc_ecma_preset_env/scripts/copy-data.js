const fs = require("fs");
const path = require("path");

const nodeModulesDirectory = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "node_modules"
);
/**
 *
 * @param {string} s
 */
function copy(s) {
    console.log(`es/preset-env: Copying ${s}`);

    const targetPath = path.join(__dirname, "..", "data", s);
    const targetDir = path.dirname(targetPath);

    fs.mkdirSync(targetDir, { recursive: true });

    fs.copyFileSync(path.join(nodeModulesDirectory, s), targetPath);
}

copy("@babel/compat-data/data/plugins.json");
copy("@babel/compat-data/data/plugin-bugfixes.json");
copy("core-js-compat/data.json");
copy("core-js-compat/entries.json");
copy("core-js-compat/modules-by-versions.json");

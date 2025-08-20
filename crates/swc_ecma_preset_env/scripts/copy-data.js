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

try {
    const builtInDefinitionsPath = path.join(
        nodeModulesDirectory,
        "babel-plugin-polyfill-corejs3",
        "lib",
        "built-in-definitions.js",
    );
    const builtInDefinitions = require(builtInDefinitionsPath);

    const builtinData = {
        built_ins: builtInDefinitions.BuiltIns,
        static_properties: builtInDefinitions.StaticProperties,
        instance_properties: builtInDefinitions.InstanceProperties,
    };

    const builtinPath = path.join(
        __dirname,
        "..",
        "data",
        "corejs3",
        "builtin.json",
    );
    const builtinDir = path.dirname(builtinPath);

    fs.mkdirSync(builtinDir, { recursive: true });
    fs.writeFileSync(builtinPath, JSON.stringify(builtinData, null, 2));

    console.log("es/preset-env: Generated corejs3/builtin.json");
} catch (error) {
    console.error("Error generating builtin.json:", error);
}

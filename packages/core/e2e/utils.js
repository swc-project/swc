const assert = require("assert");
const glob = require("glob");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const getPkgRoot = (() => () => {
    let ret;

    if (!ret) {
        ret = path.resolve(__dirname, "..");
    }
    return ret;
})();

/**
 * Temporarily move out existing napi bindings to avoid test fixture setup overwrite it.
 */
const preserveBinaries = async (fromExt, toExt) => {
    const existingBinary = glob.sync(`${getPkgRoot()}/*.${fromExt}`);
    assert.equal(
        existingBinary.length <= 1,
        true,
        "There are more than one prebuilt binaries, current test fixture setup cannot handle this"
    );

    const binaryPath = existingBinary[0];
    if (!binaryPath) {
        return;
    }

    const tmpBinaryPath = path.join(
        path.dirname(binaryPath),
        `${path.basename(binaryPath, `.${fromExt}`)}.${toExt}`
    );

    await promisify(fs.rename)(binaryPath, tmpBinaryPath);
};

module.exports = {
    getPkgRoot,
    preserveBinaries,
};

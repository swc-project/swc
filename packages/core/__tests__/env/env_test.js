const swc = require("../../");
const path = require("path");
const vm = require("node:vm");

// it("should handle browserslistrc", () => {
//   const filename = path.resolve(
//     __dirname + "/../tests/env/default/input.js"
//   );
//   expect(swc.transformFileSync(filename).code.trim()).toContain(
//     `const a of foo`
//   );
// });

it("should handle targets in env", () => {
    const filename = path.resolve(
        __dirname + "/../../tests/env/targets/input.js",
    );
    expect(swc.transformFileSync(filename).code.trim()).toContain(
        `const a of foo`,
    );
});

it("preserves scoped regexp modifiers for Safari and iOS 26", () => {
    const filename = path.resolve(
        __dirname,
        "../../tests/env/regexp-modifiers/input.js",
    );
    const { code } = swc.transformFileSync(filename, {
        swcrc: false,
        configFile: false,
        env: { targets: { safari: "26", ios: "26" } },
    });
    expect(vm.runInNewContext(code)).toBe(true);
});

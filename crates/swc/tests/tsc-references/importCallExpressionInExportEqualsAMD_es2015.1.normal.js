import * as swcHelpers from "@swc/helpers";
// @module: amd
// @target: esnext
// @filename: something.ts
module.exports = 42;
// @filename: index.ts
module.exports = swcHelpers.asyncToGenerator(function*() {
    const something = yield import("./something");
});
export { };

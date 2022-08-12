// @module: amd
// @target: esnext
// @filename: something.ts
module.exports = 42;
export { };
// @filename: index.ts
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
module.exports = /*#__PURE__*/ _async_to_generator(function*() {
    const something = yield import("./something");
});
export { };

import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
// @filename: index.ts
module.exports = _async_to_generator(function*() {
    const something = yield import("./something");
});
// @module: amd
// @target: esnext
// @filename: something.ts
export { };

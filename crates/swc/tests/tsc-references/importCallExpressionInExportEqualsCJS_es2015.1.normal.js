import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
// @module: commonjs
// @target: esnext
// @filename: something.ts
module.exports = 42;
// @filename: index.ts
module.exports = _async_to_generator(function*() {
    const something = yield import("./something");
});
export { };

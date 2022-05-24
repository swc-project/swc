import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
// @module: umd
// @target: esnext
// @filename: something.ts
module.exports = 42;
// @filename: index.ts
module.exports = _async_to_generator(function*() {
    const something = yield import("./something");
});
export { };

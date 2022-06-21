import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
module.exports = _async_to_generator(function*() {
    yield import("./something");
});

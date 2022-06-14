import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
_async_to_generator(function*(i) {
    return yield someOtherFunction(i);
}), _async_to_generator(function*(i) {
    return yield someOtherFunction(i);
});

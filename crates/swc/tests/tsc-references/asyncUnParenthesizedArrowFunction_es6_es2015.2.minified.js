import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
_async_to_generator(function*(i) {
    return yield someOtherFunction(i);
}), _async_to_generator(function*(i) {
    return yield someOtherFunction(i);
});

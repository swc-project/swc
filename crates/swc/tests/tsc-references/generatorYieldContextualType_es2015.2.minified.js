import _wrap_async_generator from "@swc/helpers/lib/_wrap_async_generator.js";
f1(function*() {
    return yield 0, 0;
}), f2(_wrap_async_generator(function*() {
    return yield 0, 0;
}));

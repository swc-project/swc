import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
f1(function*() {
    return yield 0, 0;
}), f2(_wrap_async_generator(function*() {
    return yield 0, 0;
}));

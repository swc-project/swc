import _wrap_async_generator from "@swc/helpers/src/_wrap_async_generator.mjs";
f1(function*() {
    const a = yield 0;
    return 0;
});
f2(_wrap_async_generator(function*() {
    const a = yield 0;
    return 0;
}));

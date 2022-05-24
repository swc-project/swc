import _wrap_async_generator from "@swc/helpers/lib/_wrap_async_generator.js";
f1(function*() {
    const a = yield 0;
    return 0;
});
f2(_wrap_async_generator(function*() {
    const a = yield 0;
    return 0;
}));

import * as swcHelpers from "@swc/helpers";
f1(function*() {
    const a = yield 0;
    return 0;
});
f2(swcHelpers.wrapAsyncGenerator(function*() {
    const a = yield 0;
    return 0;
}));

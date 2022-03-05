import * as swcHelpers from "@swc/helpers";
f1(function*() {
    return yield 0, 0;
}), f2(swcHelpers.wrapAsyncGenerator(function*() {
    return yield 0, 0;
}));

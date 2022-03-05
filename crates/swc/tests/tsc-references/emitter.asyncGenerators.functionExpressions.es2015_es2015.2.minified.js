import * as swcHelpers from "@swc/helpers";
swcHelpers.wrapAsyncGenerator(function*() {}), swcHelpers.wrapAsyncGenerator(function*() {
    yield;
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield 1;
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* [
        1
    ];
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* swcHelpers.wrapAsyncGenerator(function*() {
        yield 1;
    })();
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield swcHelpers.awaitAsyncGenerator(1);
}), swcHelpers.wrapAsyncGenerator(function*() {
    return 1;
});

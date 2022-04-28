import * as swcHelpers from "@swc/helpers";
swcHelpers.wrapAsyncGenerator(function*() {}), swcHelpers.wrapAsyncGenerator(function*() {
    yield;
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield 1;
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator([
        1
    ]), swcHelpers.awaitAsyncGenerator);
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator(swcHelpers.wrapAsyncGenerator(function*() {
        yield 1;
    })()), swcHelpers.awaitAsyncGenerator);
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield swcHelpers.awaitAsyncGenerator(1);
}), swcHelpers.wrapAsyncGenerator(function*() {
    return 1;
});

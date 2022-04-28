import * as swcHelpers from "@swc/helpers";
function _inferReturnType2() {
    return (_inferReturnType2 = swcHelpers.wrapAsyncGenerator(function*() {
        yield* swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator(function() {
            return _inferReturnType2.apply(this, arguments);
        }()), swcHelpers.awaitAsyncGenerator);
    })).apply(this, arguments);
}
swcHelpers.wrapAsyncGenerator(function*() {
    yield "a";
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator([
        "a",
        "b"
    ]), swcHelpers.awaitAsyncGenerator);
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator(swcHelpers.wrapAsyncGenerator(function*() {
        yield "a";
    })()), swcHelpers.awaitAsyncGenerator);
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield "a";
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator([
        "a",
        "b"
    ]), swcHelpers.awaitAsyncGenerator);
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator(swcHelpers.wrapAsyncGenerator(function*() {
        yield "a";
    })()), swcHelpers.awaitAsyncGenerator);
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield "a";
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator([
        "a",
        "b"
    ]), swcHelpers.awaitAsyncGenerator);
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator(swcHelpers.wrapAsyncGenerator(function*() {
        yield "a";
    })()), swcHelpers.awaitAsyncGenerator);
});

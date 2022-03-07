import * as swcHelpers from "@swc/helpers";
function _inferReturnType2() {
    return (_inferReturnType2 = swcHelpers.wrapAsyncGenerator(function*() {
        yield* function() {
            return _inferReturnType2.apply(this, arguments);
        }();
    })).apply(this, arguments);
}
swcHelpers.wrapAsyncGenerator(function*() {
    yield "a";
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* [
        "a",
        "b"
    ];
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* swcHelpers.wrapAsyncGenerator(function*() {
        yield "a";
    })();
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield "a";
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* [
        "a",
        "b"
    ];
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* swcHelpers.wrapAsyncGenerator(function*() {
        yield "a";
    })();
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield "a";
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* [
        "a",
        "b"
    ];
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* swcHelpers.wrapAsyncGenerator(function*() {
        yield "a";
    })();
});

import * as swcHelpers from "@swc/helpers";
swcHelpers.wrapAsyncGenerator(function*() {
    yield 1;
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield Promise.resolve(1);
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* [
        1,
        2
    ];
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* [
        Promise.resolve(1)
    ];
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* swcHelpers.wrapAsyncGenerator(function*() {
        yield 1;
    })();
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield 1;
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield Promise.resolve(1);
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* [
        1,
        2
    ];
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* [
        Promise.resolve(1)
    ];
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* swcHelpers.wrapAsyncGenerator(function*() {
        yield 1;
    })();
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield 1;
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield Promise.resolve(1);
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* [
        1,
        2
    ];
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* [
        Promise.resolve(1)
    ];
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* swcHelpers.wrapAsyncGenerator(function*() {
        yield 1;
    })();
});

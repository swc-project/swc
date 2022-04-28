import * as swcHelpers from "@swc/helpers";
swcHelpers.wrapAsyncGenerator(function*() {
    yield 1;
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield Promise.resolve(1);
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator([
        1,
        2
    ]), swcHelpers.awaitAsyncGenerator);
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator([
        Promise.resolve(1)
    ]), swcHelpers.awaitAsyncGenerator);
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator(swcHelpers.wrapAsyncGenerator(function*() {
        yield 1;
    })()), swcHelpers.awaitAsyncGenerator);
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield 1;
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield Promise.resolve(1);
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator([
        1,
        2
    ]), swcHelpers.awaitAsyncGenerator);
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator([
        Promise.resolve(1)
    ]), swcHelpers.awaitAsyncGenerator);
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator(swcHelpers.wrapAsyncGenerator(function*() {
        yield 1;
    })()), swcHelpers.awaitAsyncGenerator);
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield 1;
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield Promise.resolve(1);
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator([
        1,
        2
    ]), swcHelpers.awaitAsyncGenerator);
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator([
        Promise.resolve(1)
    ]), swcHelpers.awaitAsyncGenerator);
}), swcHelpers.wrapAsyncGenerator(function*() {
    yield* swcHelpers.asyncGeneratorDelegate(swcHelpers.asyncIterator(swcHelpers.wrapAsyncGenerator(function*() {
        yield 1;
    })()), swcHelpers.awaitAsyncGenerator);
});

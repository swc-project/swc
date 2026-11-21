// `yield*` over a sync iterable wraps it in an async-from-sync iterator, so
// `throw()` on the outer async generator must reach the sync iterator's `throw`.
//
// This fixture compares with native output, so it covers only behavior that
// every supported Node.js version implements. The missing-`throw` and
// close-on-rejection cases are in `es2017_async_to_generator.rs`.
function* syncWithThrow() {
    try {
        yield 1;
    } catch (e) {
        console.log("sync caught", e.message);
        yield 2;
    } finally {
        console.log("sync finally");
    }
}

async function* delegate(iterable) {
    yield* iterable;
}

(async () => {
    const it = delegate(syncWithThrow());
    console.log(JSON.stringify(await it.next()));
    console.log(JSON.stringify(await it.throw(new Error("boom"))));
    console.log(JSON.stringify(await it.next()));
})();

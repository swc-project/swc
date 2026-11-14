// `yield*` over a sync iterable wraps it in an async-from-sync iterator, so
// `throw()` on the outer async generator must reach the sync iterator's `throw`.
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

function syncWithoutThrow() {
    return {
        [Symbol.iterator]() {
            return this;
        },
        next() {
            return { value: 1, done: false };
        },
        return() {
            console.log("sync return called");
            return { done: true };
        },
    };
}

async function* delegate(iterable) {
    yield* iterable;
}

async function check(label, iterable) {
    const it = delegate(iterable);
    console.log(label, JSON.stringify(await it.next()));
    try {
        console.log(label, JSON.stringify(await it.throw(new Error("boom"))));
    } catch (e) {
        console.log(label, "rejected", e instanceof TypeError, e.message === "boom");
    }
    console.log(label, JSON.stringify(await it.next()));
}

(async () => {
    await check("with throw", syncWithThrow());
    await check("without throw", syncWithoutThrow());
    await check("array", [1, 2]);
})();

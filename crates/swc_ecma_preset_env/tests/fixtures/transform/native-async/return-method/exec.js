async function consume(kind, exit) {
    const events = [];
    let reads = 0;
    const originalError = new Error("body error");
    const close = function(...args) {
        events.push(this === iterator, args.length);
        return Promise.resolve({ done: true });
    };
    // Calling an iterator method must not consult its own call/apply properties.
    close.call = close.apply = () => { throw new Error("own call/apply"); };
    const iterator = {
        [Symbol.asyncIterator]() { return this; },
        next() { return Promise.resolve({ value: 1, done: exit === "complete" }); },
        get return() {
            events.push("get return");
            reads++;
            if (kind === "changing" && reads > 1) return null;
            if (kind === "null") return null;
            if (kind === "undefined") return undefined;
            if (kind === "noncallable") return { call() { return {}; } };
            if (kind === "throwing") throw new Error("getter error");
            return close;
        },
    };
    try {
        for await (const value of iterator) {
            if (exit === "throw") throw originalError;
            if (exit === "return") {
                events.push("returning");
                return events;
            }
            break;
        }
        events.push("finished");
    } catch (error) {
        events.push(error === originalError ? "body error" : error.name);
    }
    return events;
}

(async () => {
    for (const kind of ["changing", "function", "null", "undefined", "noncallable", "throwing"]) {
        for (const exit of ["break", "return", "throw", "complete"]) {
            console.log(kind, exit, JSON.stringify(await consume(kind, exit)));
        }
    }
})().catch(error => { console.error(error); process.exitCode = 1; });

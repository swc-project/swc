async function consume(iterator) {
    try {
        for await (const value of { [Symbol.asyncIterator]() { return iterator; } }) {
            console.log("value", value);
        }
        return "finished";
    } catch (error) {
        return error.name;
    }
}

(async () => {
    for (const iterator of [null, undefined, 1, true, "primitive", Symbol(), 1n]) {
        let reads = 0;
        const prototype = iterator == null ? null : Object.getPrototypeOf(iterator);
        if (prototype) {
            Object.defineProperty(prototype, "next", {
                configurable: true,
                get() {
                    reads++;
                    return () => ({ done: true });
                },
            });
        }
        try {
            console.log(typeof iterator, await consume(iterator), reads);
        } finally {
            if (prototype) delete prototype.next;
        }
    }
    for (const iterator of [{}, function() {}]) {
        let reads = 0;
        Object.defineProperty(iterator, "next", {
            get() {
                reads++;
                return function(...args) {
                    console.log("receiver", this === iterator, args.length);
                    return Promise.resolve({ done: true });
                };
            },
        });
        console.log(typeof iterator, await consume(iterator), reads);
    }
})().catch(error => { console.error(error); process.exitCode = 1; });

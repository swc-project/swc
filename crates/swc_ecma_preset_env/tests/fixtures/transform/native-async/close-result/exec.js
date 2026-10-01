async function consume(result, exit) {
    const originalError = new Error("body error");
    const iterator = {
        [Symbol.asyncIterator]() { return this; },
        next() { return Promise.resolve({ value: 1, done: false }); },
        return() { return Promise.resolve(result); },
    };
    try {
        for await (const value of iterator) {
            if (exit === "throw") throw originalError;
            if (exit === "return") return "returned";
            break;
        }
        return "finished";
    } catch (error) {
        return error === originalError ? "body error" : error.name;
    }
}

(async () => {
    for (const result of [null, undefined, 0, true, "primitive", {}, function() {}]) {
        for (const exit of ["break", "return", "throw"]) {
            console.log(typeof result, exit, await consume(result, exit));
        }
    }
})().catch(error => { console.error(error); process.exitCode = 1; });

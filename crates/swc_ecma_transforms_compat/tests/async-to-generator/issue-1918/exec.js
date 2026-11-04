(async function () {
    let counter = 0;
    let resolve;
    let promise = new Promise((r) => (resolve = r));
    let iterable = {
        [Symbol.asyncIterator]() {
            return {
                next() {
                    return promise;
                },
            };
        },
    };

    const res = (async () => {
        for await (let value of iterable) {
            counter++;
            console.log(value);
        }

        if (counter !== 2) {
            throw new Error("");
        }
    })();

    for (let v of [0, 1]) {
        await null;
        let oldresolve = resolve;
        promise = new Promise((r) => (resolve = r));
        oldresolve({ value: v, done: false });
    }
    resolve({ value: undefined, done: true });

    await res;
})();

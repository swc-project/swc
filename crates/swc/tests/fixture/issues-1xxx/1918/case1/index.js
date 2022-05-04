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

(async () => {
    for await (let value of iterable) {
        console.log(value);
    }
})();

(async function () {
    resolve({ value: 0, done: false });
    promise = new Promise((r) => (resolve = r));

    await null;
    resolve({ value: 1, done: false });
    promise = new Promise((r) => (resolve = r));

    resolve({ value: undefined, done: true });
})();

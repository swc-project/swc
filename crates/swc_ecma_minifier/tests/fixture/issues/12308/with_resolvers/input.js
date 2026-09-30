// Older supported Node.js releases do not provide Promise.withResolvers.
// Keep both calls in the snapshot and execute them when the builtin is available.
if (typeof Promise.withResolvers === "function") {
    const first = Promise.withResolvers();
    const second = Promise.withResolvers();
    first.resolve(1);
    second.reject(2);
    Promise.all([first.promise, second.promise.catch(value => value)]).then(values => {
        if (JSON.stringify(values) !== "[1,2]") {
            throw new Error("Incorrect Promise.withResolvers result");
        }
    });
}
console.log("PASS");

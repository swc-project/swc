const profile = (_s, fn) => {
    return fn();
};

profile("trace1", () => {
    someFunction({
        args1: profile("trace2", () => JSON.stringify(someObj)), // if this line removed, the issue will not reproduce
        args2: JSON.stringify(someObj),
    });
});

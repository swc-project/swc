const logClean = function () {
    return {
        [Symbol.dispose]() {
            console.log("clean in sync");
        },
        [Symbol.asyncDispose]() {
            console.log("clean in async");
        },
    };
};

async function foo() {
    using a = logClean();
    await using b = logClean();
    for (using a of [logClean(), logClean()]) {
    }
    for (await using a of [logClean(), logClean()]) {
    }
}

foo();

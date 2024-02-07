//// [dependentDestructuredVariablesFromNestedPatterns.ts]
function test1(arg) {
    const [[p1, p1Error]] = arg;
    if (p1Error) {
        return;
    }
    p1;
}
function test2([[p1, p1Error]]) {
    if (p1Error) {
        return;
    }
    p1;
}
async function myAllSettled(fn) {
    const promises = await Promise.allSettled(fn());
    return promises.map((result)=>result.status === "fulfilled" ? [
            result.value,
            undefined
        ] : [
            undefined,
            new Error(String(result.reason))
        ]);
}
async function test3() {
    const [[p1, p1Error], _] = await myAllSettled(()=>[
            Promise.resolve(0),
            Promise.reject(1)
        ]);
    if (p1Error) return;
    p1;
}
function test4([[p1, p1Error]]) {
    if (Math.random()) {
        p1 = undefined;
    }
    if (p1Error) {
        return;
    }
    p1;
}

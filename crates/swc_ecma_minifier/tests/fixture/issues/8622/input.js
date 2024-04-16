export function foo(cond) {
    let reserved = 1;
    if (cond) {
        reserved = 2;
    }
    return [reserved, bar(cond)];
}

function bar(cond) {
    let reserved = 1;
    if (cond) {
        reserved = 2;
    }
    return reserved;
}

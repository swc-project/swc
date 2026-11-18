function* shadowed(undefined) {
    yield undefined;
}
function* local(value) {
    yield value;
}
function* global() {
    yield;
}
function* delegated(undefined) {
    yield* undefined;
}
console.log(shadowed(7).next().value);
console.log(local(7).next().value);
console.log(global().next().value);
try {
    console.log(delegated([
        7
    ]).next().value);
} catch (e) {
    console.log(e.name);
}

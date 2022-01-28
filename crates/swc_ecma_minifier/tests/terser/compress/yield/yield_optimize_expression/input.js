function* f1() {
    yield;
}
function* f2() {
    yield undefined;
}
function* f3() {
    yield null;
}
function* f4() {
    yield* undefined;
}

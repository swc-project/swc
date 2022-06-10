function* a() {
    yield;
}
function* b() {
    yield undefined;
}
function* c() {
    yield null;
}
function* d() {
    yield* undefined;
}

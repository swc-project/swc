//// [generatorImplicitAny.ts]
function* g() {}
function* g2() {
    yield;
}
function* g3() {
    yield;
}
function* g4() {
    yield, yield, noop(), noop(), yield, noop(), yield, yield, noop(), noop(), yield, yield;
}
function* g5() {
    f((yield));
}
function* g6() {
    f((yield));
}

iter = (function* () {
    assignmentResult = [x = yield] = value;
})();
function* g1() {
    yield;
}
function* g2() {
    [yield];
}
function* g3() {
    yield, yield;
}
function* g4() {
    (yield) ? yield : yield;
}

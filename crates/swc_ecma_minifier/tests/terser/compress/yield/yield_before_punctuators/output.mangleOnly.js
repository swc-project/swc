iter = (function* () {
    assignmentResult = [x = yield] = value;
})();
function* i() {
    yield;
}
function* e() {
    [yield];
}
function* n() {
    yield, yield;
}
function* l() {
    (yield) ? yield : yield;
}

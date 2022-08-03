iter = (function*() {
    assignmentResult = [x = yield] = value;
})();
function* i() {
    yield;
}
function* n() {
    [
        yield
    ];
}
function* d() {
    yield, yield;
}
function* e() {
    (yield) ? yield : yield;
}

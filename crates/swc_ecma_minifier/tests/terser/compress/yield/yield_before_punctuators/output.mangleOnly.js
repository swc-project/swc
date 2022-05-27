iter = (function*() {
    assignmentResult = [x = yield] = value;
})();
function* a() {
    yield;
}
function* b() {
    [
        yield
    ];
}
function* c() {
    yield, yield;
}
function* d() {
    (yield) ? yield : yield;
}

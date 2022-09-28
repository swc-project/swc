function* n() {
    var n = yield x();
    return new n();
}

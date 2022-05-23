function* y() {
    var t = yield x();
    return new t();
}

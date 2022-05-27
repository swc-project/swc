function* a() {
    var a = yield x();
    return new a();
}

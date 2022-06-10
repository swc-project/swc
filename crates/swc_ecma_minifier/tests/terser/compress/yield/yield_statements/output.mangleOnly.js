function* a() {
    var a = (yield 1) + (yield 2);
    var b = (yield 3) === (yield 4);
    var c = (yield 5) << (yield 6);
    var d = yield 7;
    var e = (yield 8) ? yield 9 : yield 10;
    var f = -(yield 11);
}

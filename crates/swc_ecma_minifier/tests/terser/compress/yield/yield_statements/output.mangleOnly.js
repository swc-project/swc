function* i() {
    var i = (yield 1) + (yield 2);
    var d = (yield 3) === (yield 4);
    var e = (yield 5) << (yield 6);
    var l = yield 7;
    var y = (yield 8) ? yield 9 : yield 10;
    var a = -(yield 11);
}

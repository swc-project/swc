function* l(l) {
    const e = yield ((o = l), -o);
    var o;
    console.log(o);
    console.log(e);
    yield 2;
}
var e = l(1);
console.log(e.next("first").value);
console.log(e.next("second").value);

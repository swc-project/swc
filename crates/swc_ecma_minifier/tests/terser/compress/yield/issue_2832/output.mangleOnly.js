function* l(l) {
    const e = yield ((o = l), -o);
    var o;
    console.log(o);
    console.log(e);
    yield 2;
}
var o = l(1);
console.log(o.next("first").value);
console.log(o.next("second").value);

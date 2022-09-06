function* o(o) {
    const l = yield ((e = o), -e);
    var e;
    console.log(e);
    console.log(l);
    yield 2;
}
var l = o(1);
console.log(l.next("first").value);
console.log(l.next("second").value);

function* a(a) {
    const b = yield ((c = a), -c);
    var c;
    console.log(c);
    console.log(b);
    yield 2;
}
var b = a(1);
console.log(b.next("first").value);
console.log(b.next("second").value);

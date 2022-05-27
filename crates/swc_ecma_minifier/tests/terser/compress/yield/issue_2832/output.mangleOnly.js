function* b(a) {
    const b = yield ((c = a), -c);
    var c;
    console.log(c);
    console.log(b);
    yield 2;
}
var a = b(1);
console.log(a.next("first").value);
console.log(a.next("second").value);

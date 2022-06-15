function* gen(i) {
    const result = yield (x = i, -x);
    var x;
    console.log(x);
    console.log(result);
    yield 2;
}
var x = gen(1);
console.log(x.next("first").value);
console.log(x.next("second").value);

function* gen(i) {
    const result = yield (x = i, -x);
    var x;
    console.log(x);
    console.log(result);
    yield 2;
}
var x1 = gen(1);
console.log(x1.next("first").value);
console.log(x1.next("second").value);

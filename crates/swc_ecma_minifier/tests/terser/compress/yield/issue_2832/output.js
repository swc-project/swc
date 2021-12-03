function* gen(i) {
    const result = yield (x1 = i, -x1);
    var x1;
    console.log(x1);
    console.log(result);
    yield 2;
}
var x = gen(1);
console.log(x.next("first").value);
console.log(x.next("second").value);

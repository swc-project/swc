function* a() {
    const a = yield 1;
    yield 2;
    return a;
}
var b = a();
console.log(b.next().value, b.next().value);
